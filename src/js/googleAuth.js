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
  }

  // Démarrer le processus d'authentification Google avec popup
  async initiateAuth() {
    return new Promise((resolve, reject) => {
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

      // Ouvrir une popup au lieu de rediriger
      const popup = window.open(
        authUrl.toString(),
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Surveiller la popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Popup fermée par l\'utilisateur'));
        }
      }, 1000);

      // Écouter les messages de la popup
      const messageListener = async (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          
          try {
            const tokens = await this.exchangeCodeForTokens(event.data.code, event.data.state);
            resolve(tokens);
          } catch (error) {
            reject(error);
          }
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  // Échanger le code d'autorisation contre des tokens
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
      
      // Stocker les tokens
      localStorage.setItem('google_access_token', tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem('google_refresh_token', tokens.refresh_token);
      }
      localStorage.setItem('google_expires_at', Date.now() + (tokens.expires_in * 1000));

      // Nettoyer l'état d'authentification
      localStorage.removeItem('google_auth_state');

      return tokens;
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
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
        throw new Error('Erreur lors de la récupération du profil');
      }

      return await response.json();
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
        throw new Error('Erreur lors de la récupération des infos YouTube');
      }

      const data = await response.json();
      return data.items && data.items.length > 0 ? data.items[0] : null;
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
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_expires_at');
    localStorage.removeItem('google_user_profile');
    localStorage.removeItem('youtube_channel_info');
    localStorage.removeItem('google_auth_state');
  }
}

window.GoogleAuth = GoogleAuth;
