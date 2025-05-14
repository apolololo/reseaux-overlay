import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log("WebSocket connected");
      
      // Vérifier les followers toutes les 30 secondes
      const checkFollowers = async () => {
        try {
          const token = req.headers.get('Authorization')?.split(' ')[1];
          if (!token) return;

          const response = await fetch('https://api.twitch.tv/helix/users/follows?to_id=YOUR_CHANNEL_ID', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Client-Id': Deno.env.get('VITE_TWITCH_CLIENT_ID'),
            },
          });

          const data = await response.json();
          socket.send(JSON.stringify({
            type: 'followers_update',
            count: data.total,
          }));
        } catch (error) {
          console.error('Error fetching followers:', error);
        }
      };

      const interval = setInterval(checkFollowers, 30000);
      socket.onclose = () => clearInterval(interval);
    };

    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});