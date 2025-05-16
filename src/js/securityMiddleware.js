
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
    
    // Paramètres d'URL pour le débogage
    const params = new URLSearchParams(window.location.search);
    const DEBUG = params.get('debug') === '1';
    
    // Decoder le token
    const decodedData = atob(token);
    const separatorIndex = decodedData.indexOf('-');
    
    if (separatorIndex === -1) {
      if (DEBUG) console.log('Format de token invalide, pas de séparateur trouvé');
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
    
    if (DEBUG) {
      console.log('Chemin dans token:', overlayPath);
      console.log('Chemin demandé:', path);
    }
    
    // Autoriser les accès plus flexibles - permettre des correspondances partielles
    // ou des chemins qui sont des variantes d'un même overlay
    
    // Vérification plus permissive:
    // 1. Le chemin dans le token correspond au chemin demandé
    // 2. Le chemin demandé contient le chemin dans le token
    // 3. Le chemin dans le token contient le chemin demandé
    // 4. Les deux chemins contiennent le même sous-dossier d'overlay (/overlays/XXX/)
    
    if (overlayPath === path) {
      if (DEBUG) console.log('Chemin exact correspondant');
      return true;
    }
    
    if (path.includes(overlayPath) || overlayPath.includes(path)) {
      if (DEBUG) console.log('Chemin partiellement correspondant');
      return true;
    }
    
    // Extraire le dossier d'overlay du chemin (ex: /overlays/apo/)
    const getOverlayFolder = (p) => {
      const overlayMatch = p.match(/\/overlays\/([^\/]+)\//);
      return overlayMatch ? overlayMatch[0] : null;
    };
    
    const overlayFolder = getOverlayFolder(overlayPath);
    const requestFolder = getOverlayFolder(path);
    
    if (overlayFolder && requestFolder && overlayFolder === requestFolder) {
      if (DEBUG) console.log('Même dossier d\'overlay:', overlayFolder);
      return true;
    }
    
    if (DEBUG) console.log('Accès refusé: les chemins ne correspondent pas');
    return false;
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
  // Paramètres d'URL pour le débogage
  const params = new URLSearchParams(window.location.search);
  const DEBUG = params.get('debug') === '1';
  const accessToken = params.get('access_token');
  
  if (DEBUG) {
    console.log('Vérification d\'accès pour:', path);
    console.log('Token présent:', accessToken ? 'Oui' : 'Non');
  }
  
  // Mode développement local - autoriser l'accès sans token pour le débogage local
  if (DEBUG && window.location.hostname === 'localhost') {
    console.log('Mode développement local, accès autorisé');
    return true;
  }
  
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
  
  const params = new URLSearchParams(window.location.search);
  const DEBUG = params.get('debug') === '1';
  
  let debugInfo = '';
  if (DEBUG) {
    debugInfo = `
      <div class="debug-info" style="margin-top:20px; font-size:12px; background:rgba(0,0,0,0.5); padding:10px;">
        <strong>Info débogage:</strong><br>
        Chemin demandé: ${window.location.pathname}<br>
        Paramètres: ${window.location.search}<br>
        Token présent: ${params.get('access_token') ? 'Oui' : 'Non'}<br>
      </div>
    `;
  }
  
  element.innerHTML = `
    <div class="error-container">
      <div class="error-icon">🔒</div>
      <div class="error-message">${title}</div>
      <div class="error-details">${message}</div>
      ${debugInfo}
    </div>
  `;
}
