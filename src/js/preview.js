// Handle preview iframe
function initPreviewIframe() {
  const previewFrame = document.getElementById('overlay-preview');
  
  previewFrame.onload = function() {
    try {
      // Vérifier si nous sommes sur Netlify
      const isNetlify = window.location.hostname.includes('netlify');
      
      if (isNetlify) {
        // Forcer un rechargement complet sur Netlify
        const currentSrc = this.src;
        const timestamp = new Date().getTime();
        this.src = `${currentSrc}?t=${timestamp}`;
      }

      // S'assurer que l'iframe est visible
      this.style.display = 'block';
      this.style.visibility = 'visible';
      this.style.opacity = '1';
    } catch (error) {
      console.error('Error refreshing preview:', error);
    }
  };

  // Gérer les erreurs de chargement
  previewFrame.onerror = function() {
    console.error('Failed to load preview iframe');
    // Réessayer avec un chemin relatif différent
    if (this.src.startsWith('/')) {
      this.src = this.src.substring(1);
    }
  };
}

export { initPreviewIframe };
