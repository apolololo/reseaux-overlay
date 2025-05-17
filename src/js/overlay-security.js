
/**
 * Sécurité des overlays - Ce script est à inclure dans tous les fichiers d'overlay
 * Il redirige vers l'accès sécurisé si l'overlay est accédé directement
 */

(function() {
  // Vérifier si on est dans un iframe (accès normal via token)
  const isInIframe = window !== window.top;
  
  // Vérifier si on a un paramètre de token valide
  const hasValidToken = () => {
    const params = new URLSearchParams(window.location.search);
    return params.has('token');
  };
  
  // Obtenir le chemin actuel de l'overlay
  const getCurrentPath = () => {
    return window.location.pathname;
  };
  
  // Si on n'est pas dans un iframe et qu'on n'a pas de token, rediriger vers la version sécurisée
  if (!isInIframe && !hasValidToken()) {
    console.log('Accès direct à l\'overlay détecté. Redirection vers la version sécurisée...');
    
    // Rediriger vers la page principale
    window.location.href = '/index.html';
  }
})();
