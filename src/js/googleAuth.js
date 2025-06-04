import { config } from './config.js';

class GoogleAuth {
  constructor() {
    this.clientId = config.google.clientId;
    this.clientSecret = config.google.clientSecret;
    this.redirectUri = config.google.redirectUri;
    this.scopes = config.google.scopes;
  }

  async initiateAuth() {
    try {
      // Stocker les identifiants pour la page de callback
      localStorage.setItem('google_client_id', this.clientId);
      localStorage.setItem('google_client_secret', this.clientSecret);
      
      // Générer et stocker l'état pour la sécurité
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('google_auth_state', state);
      
      // Construire l'URL d'authentification
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', this.clientId);
      authUrl.searchParams.set('redirect_uri', this.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', this.scopes);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      // Rediriger vers la page d'authentification Google
      window.location.replace(authUrl.toString());
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      throw error;
    }
  }

  async exchangeCodeForTokens(code, state) {
    try {
      const storedState = localStorage.getItem('google_auth_state');
      if (state !== storedState) {
        throw new Error('État invalide');
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || errorData.error || 'Erreur lors de l\'échange du code');
      }

      const data = await response.json();
      
      localStorage.setItem('google_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('google_refresh_token', data.refresh_token);
      }
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('google_expires_at', expiresAt.toString());
      localStorage.setItem('auth_provider', 'google');
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
      throw error;
    }
  }

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
        throw new Error('Erreur lors de la récupération du profil');
      }

      const userProfile = await response.json();
      
      if (userProfile) {
        localStorage.setItem('google_user_profile', JSON.stringify(userProfile));
      }
      
      return userProfile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

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
        throw new Error('Erreur lors de la récupération des infos YouTube');
      }

      const data = await response.json();
      const channelInfo = data.items && data.items.length > 0 ? data.items[0] : null;
      
      if (channelInfo) {
        localStorage.setItem('youtube_channel_info', JSON.stringify(channelInfo));
      }
      
      return channelInfo;
    } catch (error) {
      console.error('Erreur lors de la récupération des infos YouTube:', error);
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('google_access_token');
    const expiresAt = localStorage.getItem('google_expires_at');
    const refreshToken = localStorage.getItem('google_refresh_token');
    const authProvider = localStorage.getItem('auth_provider');
    
    if (!token || !expiresAt || authProvider !== 'google') return false;

    const isExpired = new Date().getTime() >= parseInt(expiresAt);
    
    if (isExpired && refreshToken) {
      this.refreshAccessToken().catch(console.error);
      return true;
    }
    
    return !isExpired;
  }

  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('google_refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rafraîchissement du token');
      }

      const tokens = await response.json();
      localStorage.setItem('google_access_token', tokens.access_token);
      localStorage.setItem('google_expires_at', Date.now() + (tokens.expires_in * 1000));
      
      return tokens;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.logout();
      return null;
    }
  }

  logout() {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).catch(console.error);
    }

    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_expires_at');
    localStorage.removeItem('google_user_profile');
    localStorage.removeItem('youtube_channel_info');
    localStorage.removeItem('google_auth_state');
    localStorage.removeItem('auth_provider');
    
    window.location.replace('/src/auth.html');
  }
}

window.GoogleAuth = GoogleAuth;