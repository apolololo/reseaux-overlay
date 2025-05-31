import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID");
const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET");
const SPOTIFY_REDIRECT_URI = Deno.env.get("SPOTIFY_REDIRECT_URI") || "https://apo-overlay.netlify.app/auth/spotify-callback.html";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function exchangeCodeForToken(code: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed: ${response.status}`);
  }

  return await response.json();
}

async function getCurrentTrack(accessToken: string) {
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get current track: ${response.status}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Code d'autorisation manquant" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const tokenData = await exchangeCodeForToken(code);
    const currentTrack = await getCurrentTrack(tokenData.access_token);

    return new Response(
      JSON.stringify({
        ...tokenData,
        currentTrack,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});