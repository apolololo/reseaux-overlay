
class GoogleAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.redirectUri = 'https://apo-overlay.netlify.app/auth/google-callback.html';
    this.scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
    ].join(' ');
  }

  // Démarrer le processus d'authentification Google
  initiateAuth() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('google_auth_state', state);
    
    const authUrl = new URL('https://accounts.google.com/oauth2/authorize');
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'token id_token');
    authUrl.searchParams.set('scope', this.scopes);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('nonce', Math.random().toString(36).substring(2, 15));

    console.log('Redirection vers Google Auth:', authUrl.toString());
    window.location.href = authUrl.toString();
  }

  // Traiter les tokens reçus directement de Google (implicit flow)
  async handleAuthCallback(params) {
    try {
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');
      const state = params.get('state');
      const expiresIn = params.get('expires_in');

      if (!accessToken || !idToken) {
        throw new Error('Tokens manquants dans la réponse Google');
      }

      const storedState = localStorage.getItem('google_auth_state');
      if (state !== storedState) {
        throw new Error('État de sécurité invalide');
      }

      // Stocker les tokens
      localStorage.setItem('google_access_token', accessToken);
      localStorage.setItem('google_id_token', idToken);
      localStorage.setItem('google_expires_at', Date.now() + (parseInt(expiresIn) * 1000));

      console.log('Tokens Google stockés avec succès');
      return { accessToken, idToken };
    } catch (error) {
      console.error('Erreur lors du traitement des tokens:', error);
      throw error;
    }
  }

  // Récupérer les informations du profil utilisateur
  async getUserProfile() {
    const token = localStorage.getItem('google_access_token');
    if (!token) return null;

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du profil: ${response.status}`);
      }

      const profile = await response.json();
      console.log('Profil utilisateur récupéré:', profile);
      return profile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

  // Récupérer les informations de la chaîne YouTube
  async getYouTubeChannelInfo() {
    const token = localStorage.getItem('google_access_token');
    if (!token) return null;

    try {
      const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des infos YouTube: ${response.status}`);
      }

      const data = await response.json();
      const channelInfo = data.items && data.items.length > 0 ? data.items[0] : null;
      console.log('Infos chaîne YouTube récupérées:', channelInfo);
      return channelInfo;
    } catch (error) {
      console.error('Erreur lors de la récupération des infos YouTube:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('google_access_token');
    const expiresAt = localStorage.getItem('google_expires_at');
    
    return token && expiresAt && new Date().getTime() < parseInt(expiresAt);
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_id_token');
    localStorage.removeItem('google_expires_at');
    localStorage.removeItem('google_user_profile');
    localStorage.removeItem('youtube_channel_info');
    localStorage.removeItem('google_auth_state');
  }
}

window.GoogleAuth = GoogleAuth;
