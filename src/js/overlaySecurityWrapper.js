
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
    if (!checkOverlayAccess(overlayPath)) {
      showAccessDenied(`#${containerId}`, "Accès refusé", "Veuillez utiliser un lien d'overlay généré depuis l'application APO Overlays.");
    } else {
      // Exécuter le code d'initialisation uniquement si l'accès est autorisé
      initializer();
    }
  });
}
