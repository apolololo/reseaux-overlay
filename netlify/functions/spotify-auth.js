export default async function handler(event, context) {
  try {
    // Vérifier si nous avons des paramètres de requête
    if (!event.queryStringParameters) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Paramètres manquants' })
      };
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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Configuration Spotify manquante' })
      };
    }

    // Construire l'URL d'autorisation Spotify
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

    // Rediriger vers l'URL d'autorisation Spotify
    return {
      statusCode: 302,
      headers: {
        Location: authUrl
      }
    };
  } catch (error) {
    console.error('Erreur dans la fonction spotify-auth:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erreur interne du serveur',
        details: error.message 
      })
    };
  }
} 