// Middleware de sécurité pour la protection des overlays et des fichiers

// Configuration de sécurité
const SECURITY_CONFIG = {
  ALLOWED_PATHS: ['/src/auth.html', '/auth/callback.html', '/src/overlay.css', '/src/images/'], // Chemins publics autorisés
  TOKEN_VERSION: '3', // Version du token pour invalider les anciens tokens
  OVERLAY_PATH_PREFIX: '/src/overlays/' // Préfixe obligatoire pour les chemins d'overlay
};

// Vérification de l'authentification
function checkAuthentication() {
  const token = localStorage.getItem('twitch_token');
  const expiresAt = localStorage.getItem('twitch_expires_at');
  const currentTime = new Date().getTime();

  if (!token || !expiresAt || currentTime > parseInt(expiresAt)) {
    // Rediriger vers la page d'authentification
    window.location.href = '/src/auth.html';
    return false;
  }
  return true;
}

// Génération de token sécurisé pour les overlays
function generateSecureOverlayToken(overlayPath) {
  const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
  const userId = userData?.id || 'anonymous';
  const timestamp = new Date().getTime();
  
  // Structure du token: version-userId-overlayPath
  const tokenData = `${SECURITY_CONFIG.TOKEN_VERSION}-${userId}-${overlayPath}`;
  return btoa(tokenData);
}

// Validation du token d'overlay
function validateOverlayToken(token) {
  try {
    const decodedData = atob(token);
    const [version, userId, overlayPath] = decodedData.split('-');
    
    // Vérifier la version du token
    if (version !== SECURITY_CONFIG.TOKEN_VERSION) {
      throw new Error('Version de token invalide');
    }
    
    // Vérifier le chemin de l'overlay
    if (!overlayPath.startsWith(SECURITY_CONFIG.OVERLAY_PATH_PREFIX)) {
      throw new Error('Chemin d\overlay non autorisé');
    }
    
    return {
      userId,
      overlayPath,
      isValid: true
    };
  } catch (error) {
    console.error('Erreur de validation du token:', error);
    return {
      isValid: false,
      error: error.message
    };
  }
}

// Protection des chemins d'accès
function isPathAllowed(path) {
  // Vérifier si le chemin est dans la liste des chemins autorisés
  return SECURITY_CONFIG.ALLOWED_PATHS.some(allowedPath => 
    path.startsWith(allowedPath)
  );
}

// Middleware de sécurité principal
function securityMiddleware(path) {
  // Permettre l'accès aux chemins publics
  if (isPathAllowed(path)) {
    return true;
  }
  
  // Vérifier l'authentification pour tous les autres chemins
  return checkAuthentication();
}

// Exporter les fonctions
window.securityUtils = {
  checkAuthentication,
  generateSecureOverlayToken,
  validateOverlayToken,
  securityMiddleware
};