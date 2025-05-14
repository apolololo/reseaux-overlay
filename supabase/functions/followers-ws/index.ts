// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Client {
  socket: WebSocket;
  token: string | null;
  userId: string | null;
}

const clients = new Map<WebSocket, Client>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected WebSocket upgrade", {
      status: 426,
      headers: corsHeaders,
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);

    clients.set(socket, { socket, token: null, userId: null });

    socket.onopen = () => {
      console.log("WebSocket connecté");
      socket.send(JSON.stringify({
        type: 'connection_status',
        status: 'connected',
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        const client = clients.get(socket);

        if (!client) {
          socket.close(1008, "Client non trouvé");
          return;
        }

        if (data.type === 'authorization') {
          if (!data.token) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Token manquant dans la requête d\'autorisation'
            }));
            socket.close(4001, "Token manquant");
            return;
          }

          try {
            console.log('Vérification du token Twitch...');
            const userResponse = await fetch('https://api.twitch.tv/helix/users', {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
              }
            });

            if (!userResponse.ok) {
              throw new Error(`Erreur API Twitch: ${userResponse.status}`);
            }

            const userData = await userResponse.json();
            if (!userData.data?.[0]) {
              throw new Error('Données utilisateur invalides');
            }

            const user = userData.data[0];
            client.token = data.token;
            client.userId = user.id;

            const followersResponse = await fetch(
              `https://api.twitch.tv/helix/users/follows?to_id=${user.id}`,
              {
                headers: {
                  'Authorization': `Bearer ${data.token}`,
                  'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
                }
              }
            );

            if (!followersResponse.ok) {
              throw new Error(`Erreur API Twitch Followers: ${followersResponse.status}`);
            }

            const followersData = await followersResponse.json();

            socket.send(JSON.stringify({
              type: 'auth_success',
              userId: user.id,
              username: user.login,
              displayName: user.display_name,
              followers: followersData.total,
            }));

            startFollowersCheck(client);

          } catch (error) {
            console.error('Erreur d\'authentification:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: `Erreur d'authentification: ${error.message}`
            }));
            socket.close(4002, "Erreur d'authentification");
          }
        }
      } catch (error) {
        console.error('Erreur de traitement du message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Erreur de traitement de la requête'
        }));
      }
    };

    socket.onclose = (event) => {
      console.warn('Fermeture WebSocket:', event.code, event.reason);
      clients.delete(socket);
    };

    socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      clients.delete(socket);
    };

    return response;

  } catch (error) {
    console.error('Erreur serveur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function startFollowersCheck(client: Client) {
  if (!client.token || !client.userId) return;

  const checkFollowers = async () => {
    try {
      const followersResponse = await fetch(
        `https://api.twitch.tv/helix/users/follows?to_id=${client.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${client.token}`,
            'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
          },
        }
      );

      if (!followersResponse.ok) {
        throw new Error(`Erreur API Twitch: ${followersResponse.status}`);
      }

      const followersData = await followersResponse.json();

      client.socket.send(JSON.stringify({
        type: 'followers_update',
        count: followersData.total || 0,
        timestamp: Date.now()
      }));

      const recentFollowsResponse = await fetch(
        `https://api.twitch.tv/helix/users/follows?to_id=${client.userId}&first=1`,
        {
          headers: {
            'Authorization': `Bearer ${client.token}`,
            'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
          },
        }
      );

      if (!recentFollowsResponse.ok) {
        throw new Error(`Erreur API Twitch: ${recentFollowsResponse.status}`);
      }

      const recentFollowsData = await recentFollowsResponse.json();

      if (recentFollowsData.data?.[0]) {
        client.socket.send(JSON.stringify({
          type: 'new_follower',
          follower: {
            name: recentFollowsData.data[0].from_name,
            followedAt: recentFollowsData.data[0].followed_at
          }
        }));
      }

    } catch (error) {
      console.error('Erreur followers:', error);

      if (error.message.includes('401')) {
        client.socket.send(JSON.stringify({
          type: 'error',
          message: 'Token Twitch expiré'
        }));
        client.socket.close(4000, 'Token expiré');
        return;
      }

      client.socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur lors de la récupération des followers'
      }));
    }
  };

  await checkFollowers();

  const interval = setInterval(checkFollowers, 30000);
  client.socket.addEventListener('close', () => clearInterval(interval));
}
