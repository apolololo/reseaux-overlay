export default async function handler(event, context) {
  // Récupérer les paramètres de la requête
  const { state, scope } = event.queryStringParameters;
  
  // Récupérer les variables d'environnement
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = `${event.headers.host.startsWith('localhost') ? 'http' : 'https'}://${event.headers.host}/auth/spotify-callback.html`;

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
} 