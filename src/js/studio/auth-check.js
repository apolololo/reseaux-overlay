/**
 * Vérification de l'authentification pour le Studio
 * Ce script s'assure que l'utilisateur est connecté avant d'accéder au Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("auth-check.js: Initialisation de la vérification d'authentification");
  const loadingScreen = document.querySelector('.loading-screen');
  const app = document.getElementById('app');
  
  // Vérifier si l'utilisateur est authentifié
  const checkAuth = () => {
    console.log("auth-check.js: Vérification des tokens");
    const token = localStorage.getItem('twitch_token');
    const expiresAt = localStorage.getItem('twitch_expires_at');
    
    // Vérifier si le token existe et n'est pas expiré
    if (!token || !expiresAt || new Date().getTime() > parseInt(expiresAt)) {
      console.log("auth-check.js: Authentification échouée ou expirée, redirection vers la page d'auth");
      // Rediriger vers la page d'authentification
      window.location.href = './auth.html?redirect=studio';
      return false;
    }
    
    // Récupérer les informations de l'utilisateur
    try {
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      if (!userData.id) {
        console.log("auth-check.js: Données utilisateur invalides");
        throw new Error('Données utilisateur invalides');
      }
      
      // Afficher le nom d'utilisateur
      const usernameElement = document.querySelector('.username');
      if (usernameElement) {
        usernameElement.textContent = userData.display_name || userData.login;
        console.log(`auth-check.js: Nom d'utilisateur affiché: ${userData.display_name || userData.login}`);
      }
      
      return true;
    } catch (error) {
      console.error('auth-check.js: Erreur lors de la récupération des données utilisateur:', error);
      window.location.href = './auth.html?redirect=studio';
      return false;
    }
  };
  
  // Fonction pour montrer l'application
  const showApp = () => {
    console.log("auth-check.js: Tentative d'affichage de l'application");
    
    // Vérifier si les éléments existent avant de les manipuler
    if (!loadingScreen || !app) {
      console.error("auth-check.js: Éléments de l'interface non trouvés");
      return;
    }

    // Masquer l'écran de chargement avec une transition
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      app.style.display = 'flex';
      app.style.opacity = '1';
      console.log("auth-check.js: Interface de l'application affichée avec succès");
      
      // Déclencher l'événement d'authentification complète
      const event = new CustomEvent('authComplete');
      document.dispatchEvent(event);
    }, 300);
  };
  
  // Vérifier l'authentification au chargement
  const initializeApp = () => {
    console.log("auth-check.js: Initialisation de l'application");
    
    if (checkAuth()) {
      console.log("auth-check.js: Authentification réussie");
      showApp();
    } else {
      console.log("auth-check.js: Échec de l'authentification");
      window.location.href = './auth.html';
    }
  };

  // Démarrer l'initialisation après un court délai
  setTimeout(initializeApp, 100);
  
  // Mécanisme de sécurité: afficher l'application après un délai maximum
  setTimeout(() => {
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      console.log("auth-check.js: Fallback - Affichage forcé de l'application après délai maximum");
      showApp();
    }
  }, 2000);
  
  // Gérer la déconnexion
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      console.log("auth-check.js: Déconnexion");
      localStorage.removeItem('twitch_token');
      localStorage.removeItem('twitch_expires_at');
      localStorage.removeItem('twitch_user');
      localStorage.removeItem('twitch_subscriber_count');
      localStorage.removeItem('twitch_subscriber_points');
      window.location.href = './auth.html';
    });
  }
});
