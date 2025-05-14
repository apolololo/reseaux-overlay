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
              client.token = data.token;
              client.userId = userData.data[0].id;
              socket.send(JSON.stringify({ type: 'auth_success' }));

              // Démarrer la vérification des followers
              startFollowersCheck(client);
            } else {
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Token invalide'
              }));
            }
          } catch (error) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Erreur d\'authentification'
            }));
          }
        }
      } catch (error) {
        console.error('Erreur de traitement du message:', error);
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
      const response = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${client.userId}`, {
        headers: {
          'Authorization': `Bearer ${client.token}`,
          'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        client.socket.send(JSON.stringify({
          type: 'followers_update',
          count: data.total
        }));
      } else {
        client.socket.send(JSON.stringify({
          type: 'error',
          message: 'Erreur lors de la récupération des followers'
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des followers:', error);
    }
  };

  // Vérifier immédiatement puis toutes les 30 secondes
  checkFollowers();
  const interval = setInterval(checkFollowers, 30000);

  // Nettoyer l'intervalle quand le client se déconnecte
  client.socket.addEventListener('close', () => clearInterval(interval));
}