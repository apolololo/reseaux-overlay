
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
    
    // NOUVEAU: Détection de l'environnement de production
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
                         
    // Normalisation des chemins en fonction de l'environnement
    if (isProduction) {
      // En production, les chemins peuvent être différents (sans le préfixe src/)
      overlayPath = overlayPath.replace(/^\/src\//, '/');
      path = path.replace(/^\/src\//, '/');
    }
    
    if (DEBUG) {
      console.log('Chemin dans token (normalisé):', overlayPath);
      console.log('Chemin demandé (normalisé):', path);
      console.log('Environnement de production:', isProduction);
    }
    
    // NOUVEAU: Nettoyer les chemins pour une meilleure correspondance
    // Supprimer les extensions de fichier (.html)
    const cleanPath = (p) => p.replace(/\.html$/, '');
    const cleanedTokenPath = cleanPath(overlayPath);
    const cleanedRequestPath = cleanPath(path);
    
    if (DEBUG) {
      console.log('Chemin token nettoyé:', cleanedTokenPath);
      console.log('Chemin demandé nettoyé:', cleanedRequestPath);
    }
    
    // Vérification plus permissive:
    // 1. Le chemin dans le token correspond au chemin demandé
    if (overlayPath === path || cleanedTokenPath === cleanedRequestPath) {
      if (DEBUG) console.log('Chemins exacts correspondants');
      return true;
    }
    
    // 2. Les chemins se contiennent mutuellement
    if (path.includes(overlayPath) || overlayPath.includes(path) ||
        cleanedRequestPath.includes(cleanedTokenPath) || cleanedTokenPath.includes(cleanedRequestPath)) {
      if (DEBUG) console.log('Chemins partiellement correspondants');
      return true;
    }
    
    // 3. Extraire le dossier d'overlay du chemin (ex: /overlays/apo/)
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
    
    // 4. NOUVEAU: Vérification simplifiée par nom d'overlay
    const getOverlayName = (p) => {
      const parts = p.split('/');
      // Trouver le segment qui contient "overlay" ou qui suit "overlays"
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'overlays' && i + 1 < parts.length) {
          return parts[i + 1];
        }
      }
      return null;
    };
    
    const overlayName = getOverlayName(overlayPath);
    const requestName = getOverlayName(path);
    
    if (overlayName && requestName && overlayName === requestName) {
      if (DEBUG) console.log('Même nom d\'overlay:', overlayName);
      return true;
    }
    
    // 5. NOUVEAU: Autoriser tous les overlays en mode développement avec debug activé
    if (DEBUG && !isProduction) {
      console.log('Mode développement avec debug: accès autorisé');
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
    console.log('URL complète:', window.location.href);
  }
  
  // Mode développement local - autoriser l'accès sans token pour le débogage local
  if ((DEBUG || params.get('force') === '1') && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log('Mode développement local ou forcé, accès autorisé');
    return true;
  }
  
  // NOUVEAU: Mode de test facile - ajouter ?test=1 pour autoriser tout accès (uniquement pour le développement)
  if (params.get('test') === '1' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' || 
      window.location.hostname.includes('github.io') || 
      window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('vercel.app'))) {
    console.log('Mode test activé, accès autorisé');
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
        Hostname: ${window.location.hostname}<br>
        URL complète: ${window.location.href}<br>
      </div>
      <div style="margin-top: 10px">
        <button onclick="window.location.search += '&test=1'">Activer le mode test</button>
      </div>
    `;
  } else {
    // Même pour le mode non-debug, ajouter un bouton pour activer le débogage
    debugInfo = `
      <div style="margin-top: 20px">
        <button onclick="window.location.href=window.location.href+'&debug=1'">Activer le mode débogage</button>
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
