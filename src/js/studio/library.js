
/**
 * Module de bibliothèque pour le Studio
 * Gère l'affichage et l'interaction avec les overlays sauvegardés
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Bibliothèque chargée');
  
  // Initialiser la bibliothèque
  const initLibrary = () => {
    console.log('Initialisation de la bibliothèque');
    
    // Fonction temporaire pour mettre à jour la bibliothèque
    window.updateLibrary = () => {
      console.log('Mise à jour de la bibliothèque');
      
      // Pour l'instant, afficher le message d'une bibliothèque vide
      const libraryGrid = document.querySelector('.overlays-grid');
      if (libraryGrid) {
        libraryGrid.innerHTML = `
          <div class="empty-library-message">
            <div class="empty-icon">📁</div>
            <h2>Votre bibliothèque est vide</h2>
            <p>Créez votre premier overlay personnalisé en utilisant l'éditeur</p>
            <button class="primary-btn switch-to-editor">Créer un overlay</button>
          </div>
        `;
        
        // Ajouter l'événement pour passer à l'éditeur
        const switchToEditorBtn = libraryGrid.querySelector('.switch-to-editor');
        if (switchToEditorBtn) {
          switchToEditorBtn.addEventListener('click', () => {
            const event = new CustomEvent('viewChanged', { detail: { view: 'editor' } });
            document.dispatchEvent(event);
            
            // Mettre à jour les boutons de navigation
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
              btn.classList.toggle('active', btn.dataset.view === 'editor');
            });
            
            // Afficher la vue de l'éditeur
            document.getElementById('editor-view').classList.remove('hidden');
            document.getElementById('library-view').classList.add('hidden');
          });
        }
      }
    };
  };
  
  // Attendre que la vue de la bibliothèque soit visible
  document.addEventListener('viewChanged', (event) => {
    if (event.detail.view === 'library') {
      initLibrary();
      window.updateLibrary();
    }
  });
});
