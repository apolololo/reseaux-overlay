/**
 * Module de gestion de l'authentification Twitch
 * Ce module permet de gérer l'authentification OAuth avec Twitch
 * et de stocker/récupérer le token d'accès.
 */

// Fonction pour initialiser l'authentification Twitch
export function initTwitchAuth() {
  // Vérifier si un token est déjà stocké
  const token = localStorage.getItem('twitch_token');
  const expiryTime = localStorage.getItem('twitch_token_expiry');
  
  if (token && expiryTime) {
    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    
    // Vérifier si le token est toujours valide
    if (now < expiry) {
      console.log('Token Twitch valide trouvé');
      return token;
    } else {
      // Token expiré, le supprimer
      console.log('Token Twitch expiré, suppression');
      localStorage.removeItem('twitch_token');
      localStorage.removeItem('twitch_token_expiry');
    }
  }
  
  // Écouter les messages de la page d'authentification
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'twitch_auth') {
      console.log('Token Twitch reçu de la page d\'authentification');
      localStorage.setItem('twitch_token', event.data.token);
      
      // Calculer l'expiration (4 heures)
      const expiry = new Date().getTime() + (4 * 60 * 60 * 1000);
      localStorage.setItem('twitch_token_expiry', expiry.toString());
      
      // Mettre à jour l'interface utilisateur
      updateAuthUI();
    }
  });
  
  // Mettre à jour l'interface utilisateur en fonction de l'état d'authentification
  updateAuthUI();
  
  return null;
}

// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état d'authentification
function updateAuthUI() {
  const authBanner = document.getElementById('auth-banner');
  const authButton = document.getElementById('auth-button');
  const tokenExpiry = document.getElementById('token-expiry');
  
  if (!authBanner || !authButton || !tokenExpiry) {
    return; // Éléments non trouvés
  }
  
  const isAuthenticated = isTokenValid();
  
  if (isAuthenticated) {
    authBanner.classList.add('authenticated');
    authButton.textContent = 'Déconnexion';
    
    // Calculer le temps restant
    const timeLeft = getTokenTimeRemaining();
    tokenExpiry.textContent = `Token valide pour encore ${timeLeft} minutes`;
  } else {
    authBanner.classList.remove('authenticated');
    authButton.textContent = 'Se connecter';
    authButton.href = 'https://apo-overlay.netlify.app/src/auth/twitch-auth.html';
  }
}

// Fonction pour récupérer le token actuel
export function getTwitchToken() {
  const token = localStorage.getItem('twitch_token');
  const expiryTime = localStorage.getItem('twitch_token_expiry');
  
  if (token && expiryTime) {
    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    
    if (now < expiry) {
      return token;
    }
  }
  
  return null;
}

// Fonction pour vérifier si un token est valide
export function isTokenValid() {
  const token = localStorage.getItem('twitch_token');
  const expiryTime = localStorage.getItem('twitch_token_expiry');
  
  if (token && expiryTime) {
    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    return now < expiry;
  }
  
  return false;
}

// Fonction pour calculer le temps restant avant expiration (en minutes)
export function getTokenTimeRemaining() {
  const expiryTime = localStorage.getItem('twitch_token_expiry');
  
  if (expiryTime) {
    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    const timeLeft = Math.floor((expiry - now) / 1000 / 60); // minutes
    return timeLeft > 0 ? timeLeft : 0;
  }
  
  return 0;
}

// Fonction pour effacer le token (déconnexion)
export function clearTwitchToken() {
  localStorage.removeItem('twitch_token');
  localStorage.removeItem('twitch_token_expiry');
  updateAuthUI();
}

// Fonction pour ajouter le token à une URL
export function addTokenToUrl(url) {
  const token = getTwitchToken();
  if (!token) return url;
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('token', token);
    return urlObj.toString();
  } catch (e) {
    console.error('URL invalide:', e);
    return url;
  }
}