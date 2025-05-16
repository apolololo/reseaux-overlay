
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
    }
    
    // Vérifier l'accès
    const hasAccess = checkOverlayAccess(overlayPath);
    
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
          </div>
        `;
      }
    }
  });
}
