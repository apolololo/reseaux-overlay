
/**
 * Gestion de l'authentification Twitch
 * Fournit des fonctions utilitaires pour vérifier et gérer l'authentification
 */

// Vérifier si l'utilisateur est authentifié
export function isAuthenticated() {
  const token = localStorage.getItem('twitch_token');
  const expiresAt = localStorage.getItem('twitch_expires_at');
  
  // Vérifier si le token existe et n'est pas expiré
  return token && expiresAt && new Date().getTime() < parseInt(expiresAt);
}

// Récupérer les données utilisateur
export function getUserData() {
  try {
    const userData = localStorage.getItem('twitch_user');
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
}

// Se déconnecter
export function logout(redirectUrl = './auth.html') {
  console.log('Déconnexion utilisateur');
  
  // Supprimer toutes les données d'authentification
  localStorage.removeItem('twitch_token');
  localStorage.removeItem('twitch_expires_at');
  localStorage.removeItem('twitch_user');
  localStorage.removeItem('twitch_subscriber_count');
  localStorage.removeItem('twitch_subscriber_points');
  
  // Rediriger vers la page d'authentification
  window.location.href = redirectUrl;
}

// Vérifier l'authentification et rediriger si nécessaire
export function checkAuthAndRedirect(redirectUrl = './auth.html') {
  if (!isAuthenticated()) {
    console.log('Utilisateur non authentifié, redirection...');
    
    // Conserver la page actuelle pour y revenir après connexion
    const currentPage = window.location.pathname;
    let redirectParam = '';
    
    if (currentPage.includes('studio')) {
      redirectParam = '?redirect=studio';
    }
    
    window.location.href = redirectUrl + redirectParam;
    return false;
  }
  
  return true;
}

// Afficher les informations utilisateur dans un élément
export function displayUserInfo(elementSelector = '.username') {
  const userData = getUserData();
  if (!userData) return;
  
  const element = document.querySelector(elementSelector);
  if (element) {
    element.textContent = userData.display_name || userData.login || 'Utilisateur';
  }
}

// Initialiser l'UI après authentification
export function initAuthUI() {
  const loadingScreen = document.querySelector('.loading-screen');
  const app = document.getElementById('app');
  
  if (loadingScreen) loadingScreen.style.display = 'none';
  if (app) app.style.display = 'flex';
  
  // Déclencher un événement pour informer les autres modules
  const event = new CustomEvent('authComplete');
  document.dispatchEvent(event);
}
