import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

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

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Initialiser le client
    clients.set(socket, { socket, token: null, userId: null });
    
    socket.onopen = () => {
      console.log("WebSocket connecté");
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
            return;
          }

          // Vérifier le token
          try {
            const response = await fetch('https://api.twitch.tv/helix/users', {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
              }
            });

            if (response.ok) {
              const userData = await response.json();
              if (!userData.data || !userData.data[0]) {
                socket.send(JSON.stringify({
                  type: 'error',
                  message: 'Données utilisateur Twitch invalides'
                }));
                return;
              }

              client.token = data.token;
              client.userId = userData.data[0].id;
              socket.send(JSON.stringify({ 
                type: 'auth_success',
                userId: client.userId
              }));

              // Démarrer la vérification des followers
              startFollowersCheck(client);
            } else {
              const errorData = await response.json();
              socket.send(JSON.stringify({
                type: 'error',
                message: `Token invalide: ${errorData.message || 'Erreur inconnue'}`
              }));
            }
          } catch (error) {
            console.error('Erreur d\'authentification:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur lors de la vérification du token'
            }));
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

    socket.onclose = () => {
      clients.delete(socket);
    };

    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function startFollowersCheck(client: Client) {
  if (!client.token || !client.userId) return;

  const checkFollowers = async () => {
    try {
      // Récupérer le nombre total de followers
      const followersResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${client.userId}`, {
        headers: {
          'Authorization': `Bearer ${client.token}`,
          'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
        },
      });

      if (!followersResponse.ok) {
        throw new Error(`Erreur API Twitch: ${followersResponse.status}`);
      }

      const followersData = await followersResponse.json();
      
      // Envoyer la mise à jour au client
      client.socket.send(JSON.stringify({
        type: 'followers_update',
        count: followersData.total || 0,
        timestamp: Date.now()
      }));

      // Vérifier s'il y a de nouveaux followers depuis la dernière vérification
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
      
      // Si on a des followers récents, on les notifie
      if (recentFollowsData.data && recentFollowsData.data.length > 0) {
        client.socket.send(JSON.stringify({
          type: 'new_follower',
          follower: {
            name: recentFollowsData.data[0].from_name,
            followedAt: recentFollowsData.data[0].followed_at
          }
        }));
      }

    } catch (error) {
      console.error('Erreur lors de la vérification des followers:', error);
      
      // Si l'erreur est liée au token expiré
      if (error.message.includes('401')) {
        client.socket.send(JSON.stringify({
          type: 'error',
          message: 'Token Twitch expiré, reconnexion nécessaire'
        }));
        // Fermer la connexion pour forcer une réauthentification
        client.socket.close(4000, 'Token expiré');
        return;
      }
      
      client.socket.send(JSON.stringify({
        type: 'error',
        message: 'Erreur lors de la récupération des followers'
      }));
    }
  };

  // Vérifier immédiatement
  await checkFollowers();

  // Puis vérifier toutes les 30 secondes
  const interval = setInterval(checkFollowers, 30000);

  // Nettoyer l'intervalle quand le client se déconnecte
  client.socket.addEventListener('close', () => clearInterval(interval));
}