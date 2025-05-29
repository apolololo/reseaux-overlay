import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const REDIRECT_URI = Deno.env.get("REDIRECT_URI") || "https://apo-overlay.netlify.app/auth/google-callback.html";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function exchangeCodeForToken(code: string, redirectUri: string) {
  console.log("Échange du code contre un token Google...");
  console.log("Client ID:", GOOGLE_CLIENT_ID);
  console.log("Redirect URI:", redirectUri);
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    client_secret: GOOGLE_CLIENT_SECRET!,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch(`https://oauth2.googleapis.com/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorJson = await response.json();
      errorText = JSON.stringify(errorJson);
      console.error("Google token exchange failed:", errorJson);
    } catch (e) {
      errorText = await response.text();
      console.error("Google token exchange failed (raw):", errorText);
    }
    throw new Error(`Échec de l'échange du code: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();
  return tokenData;
}

async function getGoogleUserInfo(accessToken: string) {
  console.log("Récupération des informations utilisateur Google...");
  
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google user info failed:", errorText);
    throw new Error(`Échec de récupération des infos utilisateur: ${response.status} ${errorText}`);
  }

  const userData = await response.json();
  return userData;
}

async function getYouTubeChannelInfo(accessToken: string) {
  console.log("Récupération des informations de la chaîne YouTube...");
  
  try {
    const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch YouTube channel info:", await response.text());
      return { error: "Couldn't fetch YouTube channel info" };
    }

    const data = await response.json();
    return data.items?.[0] || { error: "No channel found" };
  } catch (error) {
    console.error("Error fetching YouTube channel info:", error);
    return { error: error.message };
  }
}

serve(async (req) => {
  console.log("Fonction Google Auth appelée");
  
  // Activer CORS pour les requêtes
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Vérifier que les variables d'environnement sont définies
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Configuration manquante (client ID ou secret)");
      return new Response(
        JSON.stringify({
          error: "Configuration manquante (client ID ou secret)",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Récupérer le code d'autorisation depuis le corps de la requête
    const data = await req.json();
    const { code } = data;
    
    // Récupérer l'URL de redirection depuis le corps de la requête ou utiliser celle par défaut
    const redirectUri = data.redirect_uri || REDIRECT_URI;

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

    console.log("Code reçu, échange en cours...");
    console.log("Utilisation de l'URL de redirection:", redirectUri);
    
    // Échanger le code contre un token d'accès
    const tokenData = await exchangeCodeForToken(code, redirectUri);
    
    // Récupérer les informations de l'utilisateur Google
    const userInfo = await getGoogleUserInfo(tokenData.access_token);
    
    // Récupérer les informations de la chaîne YouTube
    const channelInfo = await getYouTubeChannelInfo(tokenData.access_token);
    
    // Extraire les statistiques de la chaîne YouTube
    const statistics = channelInfo.statistics || {};
    const subscriberCount = parseInt(statistics.subscriberCount) || 0;
    const viewCount = parseInt(statistics.viewCount) || 0;
    const videoCount = parseInt(statistics.videoCount) || 0;

    // Retourner les informations du token et de l'utilisateur
    return new Response(
      JSON.stringify({
        ...tokenData,
        user: userInfo,
        channel: {
          id: channelInfo.id,
          title: channelInfo.snippet?.title,
          description: channelInfo.snippet?.description,
          thumbnails: channelInfo.snippet?.thumbnails,
          subscriberCount,
          viewCount,
          videoCount
        }
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
    console.error("Error in Google auth function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne du serveur" }),
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