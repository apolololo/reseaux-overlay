class GoogleAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
    this.redirectUri = 'https://apo-overlay.netlify.app/auth/google-callback.html';
    this.scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
    ].join(' ');
    
    this.initializeMessageListener();
  }

  initializeMessageListener() {
    console.log('Initialisation de l\'écouteur de messages Google Auth');
    window.addEventListener('message', async (event) => {
      console.log('Message reçu:', {
        origin: event.origin,
        data: event.data,
        expectedOrigin: 'https://apo-overlay.netlify.app'
      });

      const allowedOrigin = 'https://apo-overlay.netlify.app';
      if (event.origin !== allowedOrigin) {
        console.log('Origine non autorisée:', event.origin);
        return;
      }

      const data = event.data;
      if (data.type === 'GOOGLE_AUTH_SUCCESS') {
        console.log('Succès de l\'authentification Google reçu');
        try {
          console.log('Code reçu de la popup:', data.code);
          const tokens = await this.exchangeCodeForTokens(data.code, data.state);
          console.log('Tokens reçus:', !!tokens);
          
          if (tokens) {
            await this.getUserProfile();
            await this.getYouTubeChannelInfo();
            window.location.replace('/index.html');
          }
        } catch (error) {
          console.error('Erreur lors du traitement du code:', error);
          throw error;
        }
      }

      if (data.type === 'GOOGLE_AUTH_ERROR') {
        console.error('Erreur Google reçue:', data.error);
      }
    });
  }

  async initiateAuth() {
    return new Promise((resolve, reject) => {
      console.log('Initialisation de l\'authentification Google');
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('google_auth_state', state);
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', this.clientId);
      authUrl.searchParams.set('redirect_uri', this.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', this.scopes);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      console.log('Ouverture de la popup Google');
      const popup = window.open(
        authUrl.toString(),
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('La popup a été bloquée par le navigateur'));
        return;
      }

      const messageHandler = async (event) => {
        console.log('Message reçu dans initiateAuth:', event.data);
        const allowedOrigin = 'https://apo-overlay.netlify.app';
        if (event.origin !== allowedOrigin) return;

        const data = event.data;
        if (data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', messageHandler);
          clearInterval(checkClosed);
          
          try {
            const tokens = await this.exchangeCodeForTokens(data.code, data.state);
            if (tokens) {
              await this.getUserProfile();
              await this.getYouTubeChannelInfo();
              resolve(tokens);
            }
          } catch (error) {
            reject(error);
          }
        } else if (data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', messageHandler);
          clearInterval(checkClosed);
          reject(new Error(data.error));
        }
      };

      window.addEventListener('message', messageHandler);

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          reject(new Error('Popup fermée par l\'utilisateur'));
        }
      }, 1000);
    });
  }

  async exchangeCodeForTokens(code, state) {
    try {
      const storedState = localStorage.getItem('google_auth_state');
      if (state !== storedState) {
        throw new Error('État de sécurité invalide');
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur de l\'API Google:', errorData);
        throw new Error(`Erreur lors de l'échange du code: ${errorData.error_description || errorData.error}`);
      }

      const tokens = await response.json();
      
      localStorage.setItem('google_access_token', tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem('google_refresh_token', tokens.refresh_token);
      }
      localStorage.setItem('google_expires_at', Date.now() + (tokens.expires_in * 1000));
      localStorage.removeItem('google_auth_state');

      return tokens;
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
        console.log('Profil utilisateur stocké:', userProfile.name);
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
        console.log('Infos chaîne YouTube stockées:', channelInfo.snippet?.title);
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
    
    if (token && expiresAt && new Date().getTime() >= parseInt(expiresAt) && refreshToken) {
      this.refreshAccessToken().catch(console.error);
      return true;
    }
    
    return token && expiresAt && new Date().getTime() < parseInt(expiresAt);
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
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_expires_at');
    localStorage.removeItem('google_user_profile');
    localStorage.removeItem('youtube_channel_info');
    localStorage.removeItem('google_auth_state');

    const token = localStorage.getItem('google_access_token');
    if (token) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).catch(console.error);
    }
  }
}

window.GoogleAuth = GoogleAuth;