
/**
 * Sécurité des overlays - Ce script est à inclure dans tous les fichiers d'overlay
 * Il redirige vers l'accès sécurisé si l'overlay est accédé directement
 */

(function() {
  // Exécuter immédiatement - bloquer l'affichage du contenu par défaut
  document.documentElement.style.visibility = 'hidden';
  
  // Vérifier si on est dans un iframe (accès normal via token)
  const isInIframe = window !== window.top;
  
  // Vérifier si on a un paramètre de token valide
  const hasValidToken = () => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('token')) return false;
    
    // Vérifier que le token est bien formé (base64 valide)
    try {
      const token = params.get('token');
      const decoded = atob(token);
      return decoded.includes('-'); // Format attendu: userID-overlayPath
    } catch (e) {
      console.error("Token invalide", e);
      return false;
    }
  };
  
  // Vérifier l'accès valide
  const isValidAccess = isInIframe || hasValidToken();
  
  // Si l'accès est valide, afficher le contenu
  if (isValidAccess) {
    document.documentElement.style.visibility = 'visible';
  } else {
    // Si l'accès n'est pas valide, rediriger vers la page principale
    console.log('Accès direct non autorisé à l\'overlay détecté. Redirection...');
    
    // Maintenir le contenu caché
    document.documentElement.style.visibility = 'hidden';
    
    // Rediriger immédiatement vers la page principale
    window.location.href = '/index.html';
  }
})();
