// Configuration de l'application
const CONFIG = {
  app: {
    name: 'APO Overlays',
    version: '3.0.0'
  },
  auth: {
    twitch: {
      clientId: 'z8q1w4g12yrql6cyb5zzwmhe1pnxyn',
      redirectUri: `${window.location.origin}/auth/callback.html`,
      scopes: ['user:read:email', 'channel:read:subscriptions', 'moderator:read:followers']
    },
    youtube: {
      clientId: import.meta.env?.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/google-callback.html`,
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/youtube.readonly'
      ]
    }
  },
  overlays: [
    {
      id: 'social-networks',
      title: 'Réseaux Sociaux',
      description: 'Affichez vos réseaux sociaux avec des animations fluides et modernes',
      icon: '🌐',
      size: '800x200',
      path: '/overlays/social.html',
      category: 'social'
    },
    {
      id: 'starting-soon',
      title: 'Starting Soon',
      description: 'Écran de démarrage avec compte à rebours personnalisable',
      icon: '⏰',
      size: '1920x1080',
      path: '/overlays/starting.html',
      category: 'stream'
    },
    {
      id: 'be-right-back',
      title: 'Be Right Back',
      description: 'Écran de pause élégant pour vos pauses stream',
      icon: '⏸️',
      size: '1920x1080',
      path: '/overlays/brb.html',
      category: 'stream'
    },
    {
      id: 'end-screen',
      title: 'Fin de Stream',
      description: 'Écran de fin avec tous vos réseaux sociaux',
      icon: '🎬',
      size: '1920x1080',
      path: '/overlays/end.html',
      category: 'stream'
    },
    {
      id: 'followers-goal',
      title: 'Objectif Followers',
      description: 'Barre de progression pour vos objectifs de followers',
      icon: '📈',
      size: '500x300',
      path: '/overlays/followers.html',
      category: 'goals'
    },
    {
      id: 'game-status',
      title: 'Statut de Jeu',
      description: 'Indicateur de changement de jeu avec animations',
      icon: '🎮',
      size: '1920x1080',
      path: '/overlays/game.html',
      category: 'gaming'
    }
  ]
};

// État global de l'application
class AppState {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.platform = null;
    this.listeners = new Map();
  }

  // Gestion des événements
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Gestion de l'utilisateur
  setUser(userData, platform) {
    this.user = userData;
    this.platform = platform;
    this.isAuthenticated = true;
    this.emit('userChanged', { user: userData, platform });
  }

  clearUser() {
    this.user = null;
    this.platform = null;
    this.isAuthenticated = false;
    this.emit('userChanged', { user: null, platform: null });
  }
}

// Utilitaires
class Utils {
  static generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('URL copiée dans le presse-papier !', 'success');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      this.showNotification('Erreur lors de la copie', 'error');
    }
  }

  static showNotification(message, type = 'info') {
    // Créer une notification toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      zIndex: '3000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#10b981' : 
                      type === 'error' ? '#ef4444' : '#6366f1'
    });

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Suppression automatique
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  static generateOverlayToken(overlayId, userData) {
    const tokenData = {
      overlay: overlayId,
      user: userData,
      timestamp: Date.now(),
      version: CONFIG.app.version
    };
    return btoa(JSON.stringify(tokenData));
  }

  static formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Gestionnaire d'authentification
class AuthManager {
  constructor(appState) {
    this.appState = appState;
    this.init();
  }

  init() {
    this.checkExistingAuth();
  }

  checkExistingAuth() {
    const platform = localStorage.getItem('auth_platform');
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');

    if (platform && token && userData) {
      try {
        const user = JSON.parse(userData);
        this.appState.setUser(user, platform);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        this.logout();
      }
    }
  }

  async loginTwitch() {
    const state = Utils.generateState();
    localStorage.setItem('auth_state', state);
    localStorage.setItem('auth_platform', 'twitch');

    const params = new URLSearchParams({
      client_id: CONFIG.auth.twitch.clientId,
      redirect_uri: CONFIG.auth.twitch.redirectUri,
      response_type: 'code',
      scope: CONFIG.auth.twitch.scopes.join(' '),
      state: state
    });

    window.location.href = `https://id.twitch.tv/oauth2/authorize?${params}`;
  }

  async loginYoutube() {
    if (!CONFIG.auth.youtube.clientId) {
      Utils.showNotification('Configuration YouTube manquante', 'error');
      return;
    }

    const state = Utils.generateState();
    localStorage.setItem('auth_state', state);
    localStorage.setItem('auth_platform', 'youtube');

    const params = new URLSearchParams({
      client_id: CONFIG.auth.youtube.clientId,
      redirect_uri: CONFIG.auth.youtube.redirectUri,
      response_type: 'code',
      scope: CONFIG.auth.youtube.scopes.join(' '),
      state: state,
      access_type: 'offline'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  logout() {
    localStorage.clear();
    this.appState.clearUser();
    Utils.showNotification('Déconnexion réussie', 'success');
  }
}

// Gestionnaire des overlays
class OverlayManager {
  constructor(appState) {
    this.appState = appState;
    this.overlays = CONFIG.overlays;
  }

  getOverlays() {
    return this.overlays;
  }

  getOverlayById(id) {
    return this.overlays.find(overlay => overlay.id === id);
  }

  generateOverlayUrl(overlayId, customParams = {}) {
    const overlay = this.getOverlayById(overlayId);
    if (!overlay) return null;

    const token = Utils.generateOverlayToken(overlayId, this.appState.user);
    const params = new URLSearchParams({
      token,
      ...customParams
    });

    return `${window.location.origin}${overlay.path}?${params}`;
  }

  async copyOverlayUrl(overlayId) {
    const url = this.generateOverlayUrl(overlayId);
    if (url) {
      await Utils.copyToClipboard(url);
    }
  }
}

// Gestionnaire des modals
class ModalManager {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    // Fermeture des modals en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    // Fermeture des modals avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      this.activeModal = modal;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
      this.activeModal = null;
      document.body.style.overflow = '';
    }
  }
}

// Interface utilisateur
class UIManager {
  constructor(appState, authManager, overlayManager, modalManager) {
    this.appState = appState;
    this.authManager = authManager;
    this.overlayManager = overlayManager;
    this.modalManager = modalManager;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderOverlays();
    this.updateAuthSection();

    // Écouter les changements d'état utilisateur
    this.appState.on('userChanged', () => {
      this.updateAuthSection();
    });
  }

  bindEvents() {
    // Boutons principaux
    document.getElementById('get-started-btn')?.addEventListener('click', () => {
      if (this.appState.isAuthenticated) {
        document.getElementById('overlays-gallery').scrollIntoView({ behavior: 'smooth' });
      } else {
        this.modalManager.openModal('auth-modal');
      }
    });

    document.getElementById('preview-btn')?.addEventListener('click', () => {
      document.getElementById('overlays-gallery').scrollIntoView({ behavior: 'smooth' });
    });

    // Boutons d'authentification
    document.getElementById('login-twitch')?.addEventListener('click', () => {
      this.authManager.loginTwitch();
    });

    document.getElementById('login-youtube')?.addEventListener('click', () => {
      this.authManager.loginYoutube();
    });

    // Fermeture des modals
    document.getElementById('close-auth-modal')?.addEventListener('click', () => {
      this.modalManager.closeModal();
    });

    document.getElementById('close-preview-modal')?.addEventListener('click', () => {
      this.modalManager.closeModal();
    });

    // Actions des overlays
    document.getElementById('copy-url-btn')?.addEventListener('click', () => {
      const overlayId = this.currentPreviewOverlay;
      if (overlayId) {
        this.overlayManager.copyOverlayUrl(overlayId);
      }
    });
  }

  updateAuthSection() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    if (this.appState.isAuthenticated && this.appState.user) {
      authSection.innerHTML = `
        <div class="auth-user">
          <img src="${this.appState.user.avatar || '/src/images/default-avatar.png'}" 
               alt="Avatar" class="user-avatar">
          <div class="user-info">
            <div class="user-name">${this.appState.user.name || 'Utilisateur'}</div>
            <div class="user-platform">${this.appState.platform === 'twitch' ? 'Twitch' : 'YouTube'}</div>
          </div>
          <button class="btn logout-btn" id="logout-btn">
            Déconnexion
          </button>
        </div>
      `;

      document.getElementById('logout-btn')?.addEventListener('click', () => {
        this.authManager.logout();
      });
    } else {
      authSection.innerHTML = `
        <button class="btn btn-primary" id="login-btn">
          Se connecter
        </button>
      `;

      document.getElementById('login-btn')?.addEventListener('click', () => {
        this.modalManager.openModal('auth-modal');
      });
    }
  }

  renderOverlays() {
    const overlaysGrid = document.getElementById('overlays-grid');
    if (!overlaysGrid) return;

    const overlays = this.overlayManager.getOverlays();
    
    overlaysGrid.innerHTML = overlays.map(overlay => `
      <div class="overlay-card fade-in-up">
        <div class="overlay-preview">
          <span>${overlay.icon}</span>
        </div>
        <div class="overlay-info">
          <h3 class="overlay-title">${overlay.title}</h3>
          <p class="overlay-description">${overlay.description}</p>
          <div class="overlay-actions">
            <button class="btn btn-primary" onclick="app.previewOverlay('${overlay.id}')">
              Aperçu
            </button>
            <button class="btn btn-secondary" onclick="app.copyOverlayUrl('${overlay.id}')">
              Copier URL
            </button>
          </div>
          <div class="overlay-meta">
            <span class="overlay-size">${overlay.size}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  previewOverlay(overlayId) {
    const overlay = this.overlayManager.getOverlayById(overlayId);
    if (!overlay) return;

    this.currentPreviewOverlay = overlayId;
    
    const previewTitle = document.getElementById('preview-title');
    const previewIframe = document.getElementById('preview-iframe');
    
    if (previewTitle) previewTitle.textContent = `Aperçu - ${overlay.title}`;
    
    if (previewIframe) {
      const url = this.overlayManager.generateOverlayUrl(overlayId);
      previewIframe.src = url;
    }

    this.modalManager.openModal('preview-modal');
  }

  async copyOverlayUrl(overlayId) {
    if (!this.appState.isAuthenticated) {
      Utils.showNotification('Veuillez vous connecter pour copier l\'URL', 'error');
      this.modalManager.openModal('auth-modal');
      return;
    }

    await this.overlayManager.copyOverlayUrl(overlayId);
  }
}

// Application principale
class App {
  constructor() {
    this.state = new AppState();
    this.authManager = new AuthManager(this.state);
    this.overlayManager = new OverlayManager(this.state);
    this.modalManager = new ModalManager();
    this.uiManager = new UIManager(
      this.state, 
      this.authManager, 
      this.overlayManager, 
      this.modalManager
    );
  }

  // Méthodes publiques pour les événements globaux
  previewOverlay(overlayId) {
    this.uiManager.previewOverlay(overlayId);
  }

  async copyOverlayUrl(overlayId) {
    await this.uiManager.copyOverlayUrl(overlayId);
  }
}

// Initialisation de l'application
let app;

document.addEventListener('DOMContentLoaded', () => {
  app = new App();
  
  // Exposer l'app globalement pour les événements onclick
  window.app = app;
  
  console.log('APO Overlays v3.0.0 initialisé');
});

// Gestion des callbacks d'authentification
if (window.location.search.includes('code=')) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = localStorage.getItem('auth_state');
  const platform = localStorage.getItem('auth_platform');
  
  if (code && state === storedState && platform) {
    // Simuler le traitement de l'authentification
    Utils.showNotification('Traitement de l\'authentification...', 'info');
    
    setTimeout(() => {
      const mockUser = {
        name: platform === 'twitch' ? 'Streamer Twitch' : 'Créateur YouTube',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
        id: '123456'
      };
      
      localStorage.setItem('access_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      localStorage.removeItem('auth_state');
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/');
      
      Utils.showNotification('Connexion réussie !', 'success');
      
      // Recharger la page pour mettre à jour l'état
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 2000);
  }
}