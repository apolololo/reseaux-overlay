
/**
 * Sécurité des overlays - Ce script est à inclure dans tous les fichiers d'overlay
 * Il redirige vers l'accès sécurisé si l'overlay est accédé directement
 */

(function() {
  console.log("Initializing overlay security script");
  
  // Exécuter immédiatement - bloquer l'affichage du contenu par défaut
  document.documentElement.style.visibility = 'hidden';
  
  // Vérifier si on est dans un iframe (accès normal via token)
  const isInIframe = window !== window.top;
  
  console.log("Is in iframe:", isInIframe);
  
  // Vérifier si nous sommes dans l'URL d'overlay principale
  const isMainOverlayUrl = window.location.pathname.endsWith('/overlay.html');
  
  // Si l'accès est valide (dans un iframe ou que c'est l'overlay principal), afficher le contenu
  if (isInIframe || isMainOverlayUrl) {
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
    
    console.log("Overlay security passed - content visible");
  } else {
    // Accès direct détecté - vérifier si nous sommes dans une preview du studio
    const isStudioPreview = window.location.href.includes('preview=true');
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isStudioPreview || isLocalHost) {
      console.log('Preview du studio ou environnement de développement détecté - affichage du contenu autorisé');
      document.documentElement.style.visibility = 'visible';
    } else {
      // Si l'accès n'est pas valide et n'est pas une preview, rediriger
      console.log('Accès direct non autorisé à l\'overlay détecté. Redirection...');
      
      // Maintenir le contenu caché
      document.documentElement.style.visibility = 'hidden';
      
      // Générer un token temporaire pour ce chemin d'overlay
      const tempUserId = 'temp-user';
      const currentPath = window.location.pathname;
      const tokenData = `${tempUserId}-${currentPath}`;
      const token = btoa(tokenData);
      
      // Rediriger vers la page principale avec ce token
      window.location.href = `/overlay.html?token=${token}`;
    }
  }
})();
