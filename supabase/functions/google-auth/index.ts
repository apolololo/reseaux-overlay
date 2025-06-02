import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("VITE_GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("VITE_GOOGLE_CLIENT_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    client_secret: GOOGLE_CLIENT_SECRET!,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${await response.text()}`);
  }

  return await response.json();
}

async function getYouTubeChannelInfo(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube info: ${await response.text()}`);
  }

  const data = await response.json();
  return data.items?.[0] || null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Missing Google client configuration");
    }

    const { code, redirect_uri } = await req.json();

    if (!code) {
      throw new Error("Authorization code is required");
    }

    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(code, redirect_uri);
    
    // Get YouTube channel information
    const channelInfo = await getYouTubeChannelInfo(tokenData.access_token);

    // Return combined data
    return new Response(
      JSON.stringify({
        ...tokenData,
        user: {
          id: channelInfo?.id,
          login: channelInfo?.snippet?.title,
          display_name: channelInfo?.snippet?.title,
          profile_image_url: channelInfo?.snippet?.thumbnails?.default?.url,
          subscriber_count: channelInfo?.statistics?.subscriberCount,
          view_count: channelInfo?.statistics?.viewCount,
          video_count: channelInfo?.statistics?.videoCount,
        },
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
      JSON.stringify({ error: error.message || "Internal server error" }),
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