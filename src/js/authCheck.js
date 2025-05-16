
/**
 * Vérifie l'authentification et redirige vers la page de connexion si nécessaire
 */
import { isAuthenticated, redirectToAuth } from './securityMiddleware.js';

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'URL actuelle est une page d'overlay
  const isOverlayPage = window.location.pathname.includes('/overlay.html');
  const isAuthPage = window.location.pathname.includes('/auth.html');
  
  // Ne pas vérifier l'authentification sur les pages d'overlay et d'authentification
  if (isOverlayPage || isAuthPage) {
    return;
  }
  
  // Vérifier l'authentification pour toutes les autres pages
  if (!isAuthenticated()) {
    redirectToAuth();
  }
});
