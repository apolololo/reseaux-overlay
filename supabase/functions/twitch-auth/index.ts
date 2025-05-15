
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWITCH_CLIENT_ID = Deno.env.get("VITE_TWITCH_CLIENT_ID");
const TWITCH_CLIENT_SECRET = Deno.env.get("TWITCH_CLIENT_SECRET");
const REDIRECT_URI = "https://apo-overlay.netlify.app/auth/callback";

async function exchangeCodeForToken(code: string) {
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
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-ID": TWITCH_CLIENT_ID!,
    },
  });

  if (!response.ok) {
    throw new Error(`Échec de récupération des infos utilisateur: ${response.status}`);
  }

  const userData = await response.json();
  return userData.data?.[0] || null;
}

serve(async (req) => {
  // Activer CORS pour les requêtes locales de développement
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Vérifier que les variables d'environnement sont définies
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({
          error: "Configuration manquante (client ID ou secret)",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Échanger le code contre un token d'accès
    const tokenData = await exchangeCodeForToken(code);
    
    // Récupérer les informations de l'utilisateur Twitch
    const userInfo = await getTwitchUserInfo(tokenData.access_token);

    // Retourner les informations du token et de l'utilisateur
    return new Response(
      JSON.stringify({
        ...tokenData,
        user: userInfo,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
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
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
