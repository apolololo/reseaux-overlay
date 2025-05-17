
/**
 * Système d'authentification centralisé
 */

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = localStorage.getItem('twitch_token');
  const expiresAt = localStorage.getItem('twitch_expires_at');
  
  // Token valide et non expiré
  return token && expiresAt && new Date().getTime() < parseInt(expiresAt);
};

// Rediriger vers la page d'authentification si nécessaire
export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/src/auth.html';
    return false;
  }
  return true;
};

// Obtenir les informations utilisateur
export const getUserInfo = () => {
  try {
    const userData = localStorage.getItem('twitch_user');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Erreur lors de la récupération des infos utilisateur", e);
    return null;
  }
};

// Générer un jeton pour les overlays
export const generateOverlayToken = (overlayPath) => {
  // Récupérer l'ID utilisateur Twitch
  const userData = getUserInfo();
  const userId = userData?.id || 'anonymous';
  
  // Ajouter une date d'expiration (7 jours)
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
  
  // Créer un jeton qui contient l'ID utilisateur, le chemin de l'overlay et la date d'expiration
  const tokenData = userId + '-' + overlayPath + '&expires=' + expiresAt;
  
  // Ajouter un sel aléatoire pour rendre chaque token unique
  const randomSalt = Math.random().toString(36).substring(2, 15);
  const finalTokenData = tokenData + '&salt=' + randomSalt;
  
  // Encoder en base64
  const token = btoa(finalTokenData);
  
  return token;
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem('twitch_token');
  localStorage.removeItem('twitch_expires_at');
  localStorage.removeItem('twitch_user');
  localStorage.removeItem('twitch_subscriber_count');
  localStorage.removeItem('twitch_subscriber_points');
  window.location.href = '/src/auth.html';
};
