
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
    
    // AMÉLIORATION: Normalisation rigoureuse des chemins
    // Normaliser les chemins pour la comparaison
    if (!overlayPath.startsWith('/')) {
      overlayPath = '/' + overlayPath;
    }
    
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Détection de l'environnement de production
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
                         
    // Normalisation des chemins en fonction de l'environnement
    if (isProduction) {
      // Supprimer le préfixe 'src/' pour tous les chemins en production
      overlayPath = overlayPath.replace(/^\/src\//, '/');
      path = path.replace(/^\/src\//, '/');
    }
    
    // Nettoyer les chemins pour une meilleure correspondance
    const cleanPath = (p) => p.replace(/\.html$/, '').replace(/\/$/, '');
    const normalizedTokenPath = cleanPath(overlayPath);
    const normalizedRequestPath = cleanPath(path);
    
    if (DEBUG) {
      console.log('----- Vérification d\'accès détaillée -----');
      console.log('Chemin original dans token:', overlayPath);
      console.log('Chemin original demandé:', path);
      console.log('Chemin token normalisé:', normalizedTokenPath);
      console.log('Chemin demandé normalisé:', normalizedRequestPath);
      console.log('Environnement de production:', isProduction);
    }
    
    // CORRECTION: Vérifications améliorées pour correspondance de chemin
    
    // 1. Correspondance exacte des chemins normalisés
    if (normalizedTokenPath === normalizedRequestPath) {
      if (DEBUG) console.log('✅ Correspondance exacte des chemins normalisés');
      return true;
    }
    
    // 2. Extraire le nom de l'overlay et le type
    const getOverlayInfo = (p) => {
      const parts = p.split('/');
      // Trouver "overlays" dans le chemin
      const overlaysIndex = parts.indexOf('overlays');
      if (overlaysIndex === -1) return null;
      
      return {
        type: parts[overlaysIndex + 1] || null,
        filename: parts[parts.length - 1] || null
      };
    };
    
    const tokenInfo = getOverlayInfo(normalizedTokenPath);
    const requestInfo = getOverlayInfo(normalizedRequestPath);
    
    if (tokenInfo && requestInfo) {
      if (DEBUG) {
        console.log('Info token:', tokenInfo);
        console.log('Info requête:', requestInfo);
      }
      
      // 3. Même type d'overlay
      if (tokenInfo.type && requestInfo.type && tokenInfo.type === requestInfo.type) {
        if (DEBUG) console.log('✅ Même type d\'overlay');
        return true;
      }
    }
    
    // 4. NOUVEAU: Correspondance de sous-chaîne plus intelligente
    if (normalizedRequestPath.includes(normalizedTokenPath) || normalizedTokenPath.includes(normalizedRequestPath)) {
      if (DEBUG) console.log('✅ L\'un des chemins contient l\'autre');
      return true;
    }
    
    // 5. NOUVEAU: Vérifier si les deux chemins pointent vers le même fichier
    const tokenFile = normalizedTokenPath.split('/').pop();
    const requestFile = normalizedRequestPath.split('/').pop();
    if (tokenFile && requestFile && tokenFile === requestFile) {
      if (DEBUG) console.log('✅ Même nom de fichier');
      return true;
    }
    
    // 6. Autoriser l'accès en mode test (pour simplifier le développement)
    if (params.get('test') === '1') {
      console.log('✅ Mode test activé, accès autorisé');
      return true;
    }
    
    if (DEBUG) console.log('❌ Accès refusé: aucun critère de correspondance trouvé');
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
  
  // NOUVEAU: Autorisation facile pour le développement local
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
                       
  // 1. Mode développement local - autoriser l'accès sans token pour le débogage local
  if ((DEBUG || params.get('force') === '1') && isDevelopment) {
    console.log('Mode développement local avec debug, accès autorisé');
    return true;
  }
  
  // 2. Mode test - pour faciliter le test des overlays
  if (params.get('test') === '1') {
    // En développement, toujours autoriser
    if (isDevelopment) {
      console.log('Mode test en développement, accès autorisé');
      return true;
    }
    
    // En production, autoriser uniquement sur certains domaines
    const allowedTestDomains = [
      'github.io',
      'netlify.app',
      'vercel.app'
    ];
    
    const domainAllowed = allowedTestDomains.some(domain => 
      window.location.hostname.includes(domain)
    );
    
    if (domainAllowed) {
      console.log('Mode test sur domaine de déploiement, accès autorisé');
      return true;
    }
  }
  
  // 3. Autorisation forcée pour tous les domaines
  if (params.get('force') === '1' && params.get('admin') === 'true') {
    console.log('Mode force + admin, accès autorisé');
    return true;
  }
  
  // 4. Validation standard par token
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
        <button onclick="window.location.search += '&test=1'">Mode test</button>
        <button onclick="window.location.reload()">Réessayer</button>
      </div>
    `;
  } else {
    // Même pour le mode non-debug, ajouter des boutons utiles
    debugInfo = `
      <div style="margin-top: 20px">
        <button onclick="window.location.href=window.location.href+'&debug=1'">Activer le débogage</button>
        <button onclick="window.location.href=window.location.href+'&test=1'">Mode test</button>
        <button onclick="window.location.reload()">Réessayer</button>
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
