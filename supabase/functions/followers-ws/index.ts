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

          // Vérifier le token et obtenir les informations utilisateur
          try {
            console.log('Vérification du token Twitch...');
            const userResponse = await fetch('https://api.twitch.tv/helix/users', {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
              }
            });

            if (!userResponse.ok) {
              console.error('Erreur lors de la récupération des informations utilisateur:', userResponse.status);
              throw new Error(`Erreur API Twitch: ${userResponse.status}`);
            }

            const userData = await userResponse.json();
            console.log('Données utilisateur reçues:', userData);

            if (!userData.data || !userData.data[0]) {
              throw new Error('Données utilisateur invalides');
            }

            const user = userData.data[0];
            console.log('ID utilisateur Twitch:', user.id);

            client.token = data.token;
            client.userId = user.id;

            // Vérifier immédiatement le nombre de followers
            const followersResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
              }
            });

            if (!followersResponse.ok) {
              console.error('Erreur lors de la récupération des followers:', followersResponse.status);
              throw new Error(`Erreur API Twitch Followers: ${followersResponse.status}`);
            }

            const followersData = await followersResponse.json();
            console.log('Nombre de followers:', followersData.total);

            // Envoyer les informations de succès avec le nombre de followers
            socket.send(JSON.stringify({ 
              type: 'auth_success',
              userId: user.id,
              username: user.login,
              displayName: user.display_name,
              followers: followersData.total
            }));

            // Démarrer la vérification continue des followers
            startFollowersCheck(client);
          } catch (error) {
            console.error('Erreur complète:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: `Erreur d'authentification: ${error.message}`
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