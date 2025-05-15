
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWITCH_CLIENT_ID = Deno.env.get("VITE_TWITCH_CLIENT_ID");
const TWITCH_CLIENT_SECRET = Deno.env.get("TWITCH_CLIENT_SECRET");
const REDIRECT_URI = "https://apo-overlay.netlify.app/auth/callback";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function exchangeCodeForToken(code: string) {
  console.log("Échange du code contre un token...");
  
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID!,
    client_secret: TWITCH_CLIENT_SECRET!,
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
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
    
    // Échanger le code contre un token d'accès
    const tokenData = await exchangeCodeForToken(code);
    
    // Récupérer les informations de l'utilisateur Twitch
    const userInfo = await getTwitchUserInfo(tokenData.access_token);
    
    // Récupérer le nombre d'abonnés si l'utilisateur est un partenaire ou un affilié
    let subscriberData = { total: 0, points: 0 };
    if (userInfo && (userInfo.broadcaster_type === 'partner' || userInfo.broadcaster_type === 'affiliate')) {
      subscriberData = await getSubscriberCount(tokenData.access_token, userInfo.id);
    }

    // Retourner les informations du token et de l'utilisateur
    return new Response(
      JSON.stringify({
        ...tokenData,
        user: userInfo,
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
