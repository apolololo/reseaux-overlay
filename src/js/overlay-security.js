/**
 * Sécurité des overlays - Ce script est à inclure dans tous les fichiers d'overlay
 * Il redirige vers l'accès sécurisé si l'overlay est accédé directement
 */

(function() {
  // Exécuter immédiatement - bloquer l'affichage du contenu par défaut
  document.documentElement.style.visibility = 'hidden';
  
  // Vérifier si on est dans un iframe (accès normal via token)
  const isInIframe = window !== window.top;
  
  // Si l'accès est valide (dans un iframe), afficher le contenu
  if (isInIframe) {
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