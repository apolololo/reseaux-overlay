
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
  
  // Si on n'est pas dans un iframe et qu'on n'a pas de token valide
  if (!isInIframe && !hasValidToken()) {
    console.log('Accès direct à l\'overlay détecté. Redirection vers la version sécurisée...');
    
    // Bloquer l'affichage du contenu
    document.body.innerHTML = '';
    document.body.style.display = 'none';
    
    // Rediriger immédiatement vers la page principale
    window.location.href = '/index.html';
  }
})();
