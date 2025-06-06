// Configuration
const CONFIG = {
  twitch: {
    clientId: 'z8q1w4g12yrql6cyb5zzwmhe1pnxyn',
    redirectUri: 'https://apo-overlay.netlify.app/auth/callback',
    scopes: 'user:read:email channel:read:subscriptions moderator:read:followers'
  },
  youtube: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: 'https://apo-overlay.netlify.app/auth/youtube-callback',
    scopes: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly'
  },
  overlays: {
    social: { path: '/overlays/social.html', size: '800x200' },
    starting: { path: '/overlays/starting.html', size: '1920x1080' },
    brb: { path: '/overlays/brb.html', size: '1920x1080' },
    end: { path: '/overlays/end.html', size: '1920x1080' },
    followers: { path: '/overlays/followers.html', size: '500x300' },
    game: { path: '/overlays/game.html', size: '1920x1080' }
  }
};

// État de l'application
let currentUser = null;
let currentPlatform = null;

// Éléments DOM
const elements = {
  authLogin: document.getElementById('auth-login'),
  authUser: document.getElementById('auth-user'),
  overlaysSection: document.getElementById('overlays-section'),
  loading: document.getElementById('loading'),
  userAvatar: document.getElementById('user-avatar'),
  userName: document.getElementById('user-name'),
  userPlatform: document.getElementById('user-platform'),
  previewModal: document.getElementById('preview-modal'),
  previewIframe: document.getElementById('preview-iframe')
};

// Utilitaires
const utils = {
  show: (element) => element.classList.remove('hidden'),
  hide: (element) => element.classList.add('hidden'),
  
  generateState: () => Math.random().toString(36).substring(2, 15),
  
  generateToken: (overlayType, userData) => {
    const tokenData = {
      overlay: overlayType,
      user: userData,
      timestamp: Date.now()
    };
    return btoa(JSON.stringify(tokenData));
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copiée dans le presse-papier !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }
};

// Gestion de l'authentification
const auth = {
  // Connexion Twitch
  loginTwitch: () => {
    const state = utils.generateState();
    localStorage.setItem('auth_state', state);
    localStorage.setItem('auth_platform', 'twitch');
    
    const params = new URLSearchParams({
      client_id: CONFIG.twitch.clientId,
      redirect_uri: CONFIG.twitch.redirectUri,
      response_type: 'code',
      scope: CONFIG.twitch.scopes,
      state: state
    });
    
    window.location.href = `https://id.twitch.tv/oauth2/authorize?${params}`;
  },

  // Connexion YouTube
  loginYoutube: () => {
    if (!CONFIG.youtube.clientId) {
      alert('Configuration YouTube manquante');
      return;
    }
    
    const state = utils.generateState();
    localStorage.setItem('auth_state', state);
    localStorage.setItem('auth_platform', 'youtube');
    
    const params = new URLSearchParams({
      client_id: CONFIG.youtube.clientId,
      redirect_uri: CONFIG.youtube.redirectUri,
      response_type: 'code',
      scope: CONFIG.youtube.scopes,
      state: state,
      access_type: 'offline'
    });
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  // Déconnexion
  logout: () => {
    localStorage.clear();
    currentUser = null;
    currentPlatform = null;
    ui.showLogin();
  },

  // Vérification de l'authentification
  checkAuth: () => {
    const platform = localStorage.getItem('auth_platform');
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (platform && token && userData) {
      currentPlatform = platform;
      currentUser = JSON.parse(userData);
      ui.showUser();
      return true;
    }
    
    return false;
  }
};

// Gestion de l'interface utilisateur
const ui = {
  showLogin: () => {
    utils.hide(elements.loading);
    utils.hide(elements.authUser);
    utils.hide(elements.overlaysSection);
    utils.show(elements.authLogin);
  },

  showUser: () => {
    utils.hide(elements.loading);
    utils.hide(elements.authLogin);
    utils.show(elements.authUser);
    utils.show(elements.overlaysSection);
    
    if (currentUser) {
      elements.userAvatar.src = currentUser.avatar || '';
      elements.userName.textContent = currentUser.name || 'Utilisateur';
      elements.userPlatform.textContent = currentPlatform === 'twitch' ? 'Twitch' : 'YouTube';
    }
  },

  showLoading: () => {
    utils.hide(elements.authLogin);
    utils.hide(elements.authUser);
    utils.hide(elements.overlaysSection);
    utils.show(elements.loading);
  }
};

// Gestion des overlays
const overlays = {
  preview: (overlayType) => {
    const overlay = CONFIG.overlays[overlayType];
    if (!overlay) return;
    
    const token = utils.generateToken(overlayType, currentUser);
    const url = `${overlay.path}?token=${token}`;
    
    elements.previewIframe.src = url;
    utils.show(elements.previewModal);
  },

  copyUrl: (overlayType) => {
    const overlay = CONFIG.overlays[overlayType];
    if (!overlay) return;
    
    const token = utils.generateToken(overlayType, currentUser);
    const url = `${window.location.origin}${overlay.path}?token=${token}`;
    
    utils.copyToClipboard(url);
  },

  closePreview: () => {
    utils.hide(elements.previewModal);
    elements.previewIframe.src = '';
  }
};

// Fonctions globales pour les boutons
window.previewOverlay = overlays.preview;
window.copyOverlayUrl = overlays.copyUrl;
window.closePreview = overlays.closePreview;

// Gestionnaires d'événements
document.getElementById('login-twitch').addEventListener('click', auth.loginTwitch);
document.getElementById('login-youtube').addEventListener('click', auth.loginYoutube);
document.getElementById('logout').addEventListener('click', auth.logout);

// Gestion des callbacks d'authentification
const handleAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = localStorage.getItem('auth_state');
  const platform = localStorage.getItem('auth_platform');
  
  if (code && state === storedState && platform) {
    ui.showLoading();
    
    // Simuler le traitement de l'authentification
    setTimeout(() => {
      // Ici, vous ajouteriez la logique réelle d'échange de code
      const mockUser = {
        name: platform === 'twitch' ? 'Streamer Twitch' : 'Créateur YouTube',
        avatar: 'https://via.placeholder.com/40',
        id: '123456'
      };
      
      localStorage.setItem('access_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      currentUser = mockUser;
      currentPlatform = platform;
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/');
      
      ui.showUser();
    }, 2000);
  }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si c'est un callback d'authentification
  if (window.location.search.includes('code=')) {
    handleAuthCallback();
  } else if (!auth.checkAuth()) {
    ui.showLogin();
  }
});