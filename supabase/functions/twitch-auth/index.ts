
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWITCH_CLIENT_ID = Deno.env.get("VITE_TWITCH_CLIENT_ID") || "k40r5alkvhaz3aq0sk3mcoufwfvg8y";
const TWITCH_CLIENT_SECRET = Deno.env.get("TWITCH_CLIENT_SECRET") || "0xmcch55lsr4ftorzx5a4qzt19pjrd";
const REDIRECT_URI = Deno.env.get("REDIRECT_URI") || "https://apo-overlay.netlify.app/auth/callback.html";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function exchangeCodeForToken(code: string, redirectUri: string) {
  console.log("Échange du code contre un token...");
  console.log("Client ID:", TWITCH_CLIENT_ID);
  console.log("Redirect URI:", redirectUri);
  
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID!,
    client_secret: TWITCH_CLIENT_SECRET!,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twitch token exchange failed:", errorText);
    throw new Error(`Échec de l'échange du code: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();
  return tokenData;
}

async function getTwitchUserInfo(accessToken: string) {
  console.log("Récupération des informations utilisateur...");
  
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-ID": TWITCH_CLIENT_ID!,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twitch user info failed:", errorText);
    throw new Error(`Échec de récupération des infos utilisateur: ${response.status} ${errorText}`);
  }

  const userData = await response.json();
  return userData.data?.[0] || null;
}

async function getFollowerCount(accessToken: string, broadcasterId: string) {
  console.log("Récupération du nombre de followers...");
  
  try {
    const response = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-ID": TWITCH_CLIENT_ID!,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch followers:", await response.text());
      return { total: 0, error: "Couldn't fetch follower count" };
    }

    const data = await response.json();
    return { total: data.total || 0 };
  } catch (error) {
    console.error("Error fetching follower count:", error);
    return { total: 0, error: error.message };
  }
}

async function getSubscriberCount(accessToken: string, userId: string) {
  console.log("Récupération du nombre d'abonnés...");
  
  try {
    const response = await fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-ID": TWITCH_CLIENT_ID!,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch subscribers:", await response.text());
      return { total: 0, points: 0, error: "Couldn't fetch subscriber count" };
    }

    const data = await response.json();
    return { 
      total: data.total || 0, 
      points: data.points || 0 
    };
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    return { total: 0, points: 0, error: error.message };
  }
}

serve(async (req) => {
  console.log("Fonction Twitch Auth appelée");
  
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
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
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
    
    // Récupérer l'URL de redirection depuis la requête ou utiliser celle par défaut
    const requestURL = new URL(req.url);
    const origin = requestURL.searchParams.get('origin') || 'https://apo-overlay.netlify.app';
    const redirectUri = `${origin}/auth/callback.html`;

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
    
    // Récupérer les informations de l'utilisateur Twitch
    const userInfo = await getTwitchUserInfo(tokenData.access_token);
    
    let followerCount = { total: 0 };
    let subscriberData = { total: 0, points: 0 };
    
    if (userInfo) {
      // Récupérer le nombre de followers
      followerCount = await getFollowerCount(tokenData.access_token, userInfo.id);
      
      // Récupérer le nombre d'abonnés si l'utilisateur est un partenaire ou un affilié
      if (userInfo.broadcaster_type === 'partner' || userInfo.broadcaster_type === 'affiliate') {
        subscriberData = await getSubscriberCount(tokenData.access_token, userInfo.id);
      }
    }

    // Retourner les informations du token et de l'utilisateur
    return new Response(
      JSON.stringify({
        ...tokenData,
        user: userInfo,
        followerCount: followerCount.total,
        subscriberCount: subscriberData.total,
        subscriberPoints: subscriberData.points
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
    console.error("Error in Twitch auth function:", error);
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
