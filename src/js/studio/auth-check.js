
/**
 * Vérification de l'authentification pour le Studio
 * Ce script s'assure que l'utilisateur est connecté avant d'accéder au Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'utilisateur est authentifié
  const checkAuth = () => {
    const token = localStorage.getItem('twitch_token');
    const expiresAt = localStorage.getItem('twitch_expires_at');
    
    // Vérifier si le token existe et n'est pas expiré
    if (!token || !expiresAt || new Date().getTime() > parseInt(expiresAt)) {
      console.log("Authentification échouée ou expirée, redirection vers la page d'auth");
      // Rediriger vers la page d'authentification
      window.location.href = './auth.html?redirect=studio';
      return false;
    }
    
    // Récupérer les informations de l'utilisateur
    try {
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      if (!userData.id) {
        console.log("Données utilisateur invalides");
        throw new Error('Données utilisateur invalides');
      }
      
      // Afficher le nom d'utilisateur
      const usernameElement = document.querySelector('.username');
      if (usernameElement) {
        usernameElement.textContent = userData.display_name || userData.login;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      window.location.href = './auth.html?redirect=studio';
      return false;
    }
  };
  
  // Vérifier l'authentification au chargement
  if (checkAuth()) {
    console.log("Authentification réussie, affichage de l'application");
    // Afficher l'application immédiatement après vérification
    document.querySelector('.loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    
    // Déclencher l'initialisation des vues
    const event = new CustomEvent('authComplete');
    document.dispatchEvent(event);
  } else {
    console.log("Échec de l'authentification");
  }
  
  // Gérer la déconnexion
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('twitch_token');
      localStorage.removeItem('twitch_expires_at');
      localStorage.removeItem('twitch_user');
      localStorage.removeItem('twitch_subscriber_count');
      localStorage.removeItem('twitch_subscriber_points');
      window.location.href = './auth.html';
    });
  }
});
