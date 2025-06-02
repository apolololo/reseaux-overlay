export default async function handler(event, context) {
  try {
    // Vérifier si nous avons des paramètres de requête
    if (!event.queryStringParameters) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Récupérer les paramètres de la requête avec des valeurs par défaut
    const state = event.queryStringParameters.state || '';
    const scope = event.queryStringParameters.scope || 'user-read-currently-playing user-read-playback-state';
    
    // Récupérer les variables d'environnement
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    // Construire l'URL de redirection en fonction de l'environnement
    const host = event.headers.host || 'apo-overlay.netlify.app';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/auth/spotify-callback.html`;

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: 'Configuration Spotify manquante' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Construire l'URL d'autorisation Spotify
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

    // Rediriger vers l'URL d'autorisation Spotify
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl
      }
    });
  } catch (error) {
    console.error('Erreur dans la fonction spotify-auth:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur interne du serveur',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 