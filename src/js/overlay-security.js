
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
      
      // Format attendu: userID-overlayPath
      if (!decoded.includes('-')) return false;
      
      // Vérifier que le chemin dans le token correspond au chemin actuel
      const [userId, overlayPath] = decoded.split('-');
      
      // Obtenir le chemin actuel relatif à la racine
      const currentPath = window.location.pathname;
      
      // Vérifier que le chemin dans le token correspond au chemin actuel
      // Accepter avec ou sans le slash initial
      const normalizedTokenPath = overlayPath.startsWith('/') ? overlayPath : '/' + overlayPath;
      const pathMatches = currentPath === normalizedTokenPath;
      
      if (!pathMatches) {
        console.error("Le chemin dans le token ne correspond pas au chemin actuel");
        return false;
      }
      
      // Vérifier que le token n'est pas expiré (si un timestamp est présent)
      if (decoded.includes('&expires=')) {
        const expiresMatch = decoded.match(/&expires=(\d+)/);
        if (expiresMatch) {
          const expiresAt = parseInt(expiresMatch[1]);
          if (Date.now() > expiresAt) {
            console.error("Token expiré");
            return false;
          }
        }
      }
      
      return true;
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
    
    // Bloquer les téléchargements directs d'images et autres ressources
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    
    // Bloquer le glisser-déposer des images
    document.addEventListener('dragstart', function(e) {
      e.preventDefault();
      return false;
    });
  } else {
    // Si l'accès n'est pas valide, rediriger vers la page principale
    console.log('Accès direct non autorisé à l\'overlay détecté. Redirection...');
    
    // Maintenir le contenu caché
    document.documentElement.style.visibility = 'hidden';
    
    // Rediriger immédiatement vers la page principale
    window.location.href = '/index.html';
  }
})();
