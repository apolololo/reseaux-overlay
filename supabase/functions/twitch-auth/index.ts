import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, redirectUri } = await req.json()
    console.log('Données reçues:', { code: code ? '***' : 'manquant', redirectUri })
    
    if (!code || !redirectUri) {
      throw new Error('Code et redirectUri requis')
    }

    const clientId = Deno.env.get('VITE_TWITCH_CLIENT_ID')
    const clientSecret = Deno.env.get('TWITCH_CLIENT_SECRET')

    console.log('Configuration:', { 
      clientId: clientId ? '***' : 'manquant',
      clientSecret: clientSecret ? '***' : 'manquant'
    })

    if (!clientId || !clientSecret) {
      throw new Error('Configuration Twitch manquante')
    }

    // Échanger le code contre un token
    console.log('Tentative d\'échange du code...')
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log('Réponse Twitch:', { 
      status: tokenResponse.status,
      ok: tokenResponse.ok,
      error: tokenData.message || null
    })

    if (!tokenResponse.ok) {
      throw new Error(tokenData.message || `Erreur lors de l'échange du code: ${tokenResponse.status}`)
    }

    return new Response(
      JSON.stringify(tokenData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erreur d\'authentification détaillée:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})