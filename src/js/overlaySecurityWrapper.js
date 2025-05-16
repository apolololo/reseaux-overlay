
/**
 * Wrapper de sécurité à inclure dans chaque fichier overlay
 * Vérifie si l'overlay est accédé de manière légitime
 */

import { checkOverlayAccess, showAccessDenied } from './securityMiddleware.js';

/**
 * Initialise la sécurité pour un overlay
 * @param {string} overlayPath - Chemin de l'overlay
 * @param {string} containerId - ID du conteneur HTML de l'overlay
 * @param {Function} initializer - Fonction d'initialisation à exécuter si l'accès est autorisé
 */
export function initializeSecureOverlay(overlayPath, containerId, initializer) {
  document.addEventListener('DOMContentLoaded', () => {
    // Obtenir les paramètres d'URL
    const params = new URLSearchParams(window.location.search);
    const DEBUG = params.get('debug') === '1';
    
    if (DEBUG) {
      console.log('Mode débogage activé dans overlay');
      console.log('Chemin demandé:', overlayPath);
      console.log('Paramètres URL:', Object.fromEntries(params.entries()));
      console.log('URL complète:', window.location.href);
      console.log('Hostname:', window.location.hostname);
    }
    
    // NOUVEAU: Détection automatique de l'environnement
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
    
    // Normaliser le chemin en fonction de l'environnement
    let normalizedPath = overlayPath;
    if (isProduction) {
      // En production, les chemins peuvent être différents
      normalizedPath = overlayPath.replace(/^\/src\//, '/');
    }
    
    if (DEBUG) {
      console.log('Environnement de production:', isProduction);
      console.log('Chemin normalisé:', normalizedPath);
    }
    
    // Vérifier l'accès avec le chemin normalisé
    const hasAccess = checkOverlayAccess(normalizedPath);
    
    if (DEBUG) {
      console.log('Accès autorisé:', hasAccess);
    }
    
    if (!hasAccess) {
      showAccessDenied(`#${containerId}`, "Accès refusé", "Veuillez utiliser un lien d'overlay généré depuis l'application APO Overlays.");
    } else {
      // Exécuter le code d'initialisation uniquement si l'accès est autorisé
      try {
        initializer();
        if (DEBUG) console.log('Initialisation de l\'overlay réussie');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'overlay:', error);
        document.getElementById(containerId).innerHTML = `
          <div class="error-container">
            <div class="error-icon">⚠️</div>
            <div class="error-message">Erreur d'initialisation</div>
            <div class="error-details">Une erreur est survenue lors de l'initialisation de cet overlay.</div>
            ${DEBUG ? `<pre style="text-align:left;background:#333;padding:10px;max-width:90%;overflow:auto;">${error.toString()}\n\n${error.stack}</pre>` : ''}
            <div style="margin-top: 10px">
              <button onclick="window.location.reload()">Recharger</button>
              ${!DEBUG ? `<button onclick="window.location.href=window.location.href+'&debug=1'">Activer le mode débogage</button>` : ''}
            </div>
          </div>
        `;
      }
    }
  });
}
