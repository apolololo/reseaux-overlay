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
      // Rediriger vers la page d'authentification
      window.location.href = './auth.html?redirect=studio';
      return false;
    }
    
    // Récupérer les informations de l'utilisateur
    try {
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      if (!userData.id) {
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
  if (!checkAuth()) return;
  
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
  
  // Afficher l'application une fois l'authentification vérifiée
  setTimeout(() => {
    document.querySelector('.loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  }, 1000);
});