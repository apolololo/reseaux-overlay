
/**
 * Middleware de sécurité pour les overlays d'APO
 * Vérifie les tokens d'accès et protège les ressources
 */

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {boolean} true si l'utilisateur est authentifié, sinon false
 */
export function isAuthenticated() {
  const token = localStorage.getItem('twitch_token');
  const expiresAt = localStorage.getItem('twitch_expires_at');
  return token && expiresAt && new Date().getTime() < parseInt(expiresAt);
}

/**
 * Vérifie si le token d'accès est valide pour un chemin d'overlay
 * @param {string} token - Le token d'accès encodé en base64
 * @param {string} path - Le chemin d'accès à l'overlay
 * @returns {boolean} true si le token est valide pour ce chemin
 */
export function validateOverlayToken(token, path) {
  try {
    if (!token) return false;
    
    // Decoder le token
    const decodedData = atob(token);
    const separatorIndex = decodedData.indexOf('-');
    
    if (separatorIndex === -1) {
      return false;
    }
    
    // Extraire le chemin du token
    let overlayPath = decodedData.substring(separatorIndex + 1);
    
    // Normaliser les chemins pour la comparaison
    if (!overlayPath.startsWith('/')) {
      overlayPath = '/' + overlayPath;
    }
    
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Nettoyer les chemins pour la comparaison
    overlayPath = overlayPath.replace(/\/+\/g, '/').replace(/^\/src\/overlays\//, '');
    path = path.replace(/\/+\/g, '/').replace(/^\/src\/overlays\//, '');
    
    // Vérifier que le chemin demandé correspond au chemin dans le token
    return overlayPath === path || 
           overlayPath === path.replace(/^\/overlays\//, '') ||
           path === overlayPath.replace(/^\/overlays\//, '');
  } catch (error) {
    console.error("Erreur de validation du token:", error);
    return false;
  }
}

/**
 * Vérifie l'accès aux overlays
 * @param {string} path - Le chemin d'accès à l'overlay
 * @returns {boolean} true si l'accès est autorisé
 */
export function checkOverlayAccess(path) {
  // Récupérer le token d'accès de l'URL
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');
  
  // Vérifier si le token est valide pour ce chemin
  return validateOverlayToken(accessToken, path);
}

/**
 * Redirige vers la page d'authentification
 */
export function redirectToAuth() {
  window.location.href = '/src/auth.html';
}

/**
 * Affiche un message d'erreur d'accès
 * @param {string} container - Sélecteur pour le conteneur où afficher l'erreur
 * @param {string} title - Titre de l'erreur
 * @param {string} message - Message détaillé de l'erreur
 */
export function showAccessDenied(container, title = "Accès refusé", message = "Vous n'êtes pas autorisé à accéder à cette ressource.") {
  const element = document.querySelector(container);
  if (!element) return;
  
  element.innerHTML = `
    <div class="error-container">
      <div class="error-icon">🔒</div>
      <div class="error-message">${title}</div>
      <div class="error-details">${message}</div>
    </div>
  `;
}
