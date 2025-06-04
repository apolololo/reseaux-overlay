import { config } from './config.js';

class TwitchAuth {
  constructor() {
    this.clientId = config.twitch.clientId;
    this.redirectUri = config.twitch.redirectUri;
    this.scopes = config.twitch.scopes;
  }

  async initiateAuth() {
    try {
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('twitch_auth_state', state);
      
      const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
      authUrl.searchParams.set('client_id', this.clientId);
      authUrl.searchParams.set('redirect_uri', this.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', this.scopes);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('force_verify', 'true');

      window.location.replace(authUrl.toString());
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      throw error;
    }
  }

  async exchangeCodeForToken(code, state) {
    try {
      const storedState = localStorage.getItem('twitch_auth_state');
      if (state !== storedState) {
        throw new Error('État invalide');
      }

      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'échange du code');
      }

      const data = await response.json();
      
      localStorage.setItem('twitch_token', data.access_token);
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('twitch_expires_at', expiresAt.toString());
      localStorage.setItem('auth_provider', 'twitch');
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
      throw error;
    }
  }

  async getUserProfile() {
    const token = localStorage.getItem('twitch_token');
    if (!token) return null;

    try {
      const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': this.clientId
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const data = await response.json();
      const userProfile = data.data && data.data.length > 0 ? data.data[0] : null;
      
      if (userProfile) {
        localStorage.setItem('twitch_user_profile', JSON.stringify(userProfile));
      }
      
      return userProfile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('twitch_token');
    const expiresAt = localStorage.getItem('twitch_expires_at');
    const authProvider = localStorage.getItem('auth_provider');
    
    if (!token || !expiresAt || authProvider !== 'twitch') return false;
    
    return new Date().getTime() < parseInt(expiresAt);
  }

  logout() {
    localStorage.removeItem('twitch_token');
    localStorage.removeItem('twitch_expires_at');
    localStorage.removeItem('twitch_user_profile');
    localStorage.removeItem('twitch_auth_state');
    localStorage.removeItem('auth_provider');
    
    window.location.replace('/src/auth.html');
  }
}

window.TwitchAuth = TwitchAuth; 