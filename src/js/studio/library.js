
/**
 * Module de bibliothèque pour le Studio
 * Gère l'affichage et l'interaction avec les overlays sauvegardés
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Bibliothèque chargée');
  
  // Overlays sauvegardés (simulation de base de données)
  let savedOverlays = JSON.parse(localStorage.getItem('saved_overlays') || '[]');
  
  // Initialiser la bibliothèque
  const initLibrary = () => {
    console.log('Initialisation de la bibliothèque');
    
    // Fonction pour mettre à jour la bibliothèque
    window.updateLibrary = () => {
      console.log('Mise à jour de la bibliothèque');
      
      // Récupérer les overlays sauvegardés
      savedOverlays = JSON.parse(localStorage.getItem('saved_overlays') || '[]');
      
      // Référence au conteneur de la grille
      const libraryGrid = document.querySelector('.overlays-grid');
      if (!libraryGrid) return;
      
      // Si aucun overlay sauvegardé, afficher un message
      if (savedOverlays.length === 0) {
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
          });
        }
      } else {
        // Afficher les overlays sauvegardés
        let overlaysHTML = '';
        
        savedOverlays.forEach(overlay => {
          const date = new Date(overlay.metadata?.createdAt || Date.now());
          const formattedDate = date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          });
          
          // Générer une miniature de prévisualisation
          let previewImage = '';
          if (overlay.elements && overlay.elements.length > 0) {
            // Si l'overlay a des éléments, on pourrait générer une miniature
            previewImage = '<div class="overlay-preview-image">Aperçu généré</div>';
          }
          
          overlaysHTML += `
            <div class="overlay-card" data-id="${overlay.id}">
              <div class="overlay-preview">
                <div class="overlay-thumbnail" style="background-color: ${overlay.background || '#000'}">
                  ${previewImage || '<span class="overlay-placeholder">Aperçu</span>'}
                </div>
                <div class="overlay-actions">
                  <button class="edit-overlay" data-id="${overlay.id}">Éditer</button>
                  <button class="delete-overlay" data-id="${overlay.id}">Supprimer</button>
                  <button class="copy-obs-url" data-id="${overlay.id}" title="Copier l'URL pour OBS">
                    <span class="icon">🔗</span>
                  </button>
                </div>
              </div>
              <div class="overlay-info">
                <h3>${overlay.metadata?.name || "Overlay sans nom"}</h3>
                <p class="overlay-description">${overlay.metadata?.description || "Aucune description"}</p>
                <div class="overlay-meta">
                  <span class="overlay-category">${getCategoryLabel(overlay.metadata?.category)}</span>
                  <span class="overlay-date">Créé le ${formattedDate}</span>
                </div>
              </div>
            </div>
          `;
        });
        
        libraryGrid.innerHTML = overlaysHTML;
        
        // Ajouter les événements aux boutons
        libraryGrid.querySelectorAll('.edit-overlay').forEach(btn => {
          btn.addEventListener('click', function() {
            const overlayId = this.dataset.id;
            editOverlay(overlayId);
          });
        });
        
        libraryGrid.querySelectorAll('.delete-overlay').forEach(btn => {
          btn.addEventListener('click', function() {
            const overlayId = this.dataset.id;
            if (confirm('Voulez-vous vraiment supprimer cet overlay ?')) {
              deleteOverlay(overlayId);
            }
          });
        });
        
        // Ajouter l'événement pour copier l'URL OBS
        libraryGrid.querySelectorAll('.copy-obs-url').forEach(btn => {
          btn.addEventListener('click', function() {
            const overlayId = this.dataset.id;
            copyOverlayUrl(overlayId);
          });
        });
      }
    };
    
    // Fonction pour obtenir le label d'une catégorie
    const getCategoryLabel = (category) => {
      const categories = {
        'starting': 'Starting Soon',
        'brb': 'Be Right Back',
        'ending': 'Stream Ending',
        'social': 'Réseaux sociaux',
        'gaming': 'Gaming',
        'other': 'Autre'
      };
      
      return categories[category] || 'Non classé';
    };
    
    // Fonction pour éditer un overlay
    const editOverlay = (overlayId) => {
      // Charger les données de l'overlay
      const overlay = savedOverlays.find(o => o.id === overlayId);
      if (!overlay) return;
      
      // Enregistrer l'ID de l'overlay courant
      window.currentOverlayId = overlayId;
      
      // Passer à la vue éditeur
      const event = new CustomEvent('viewChanged', { detail: { view: 'editor' } });
      document.dispatchEvent(event);
      
      // Mettre à jour le nom de l'overlay
      const nameInput = document.getElementById('overlay-name');
      if (nameInput && overlay.metadata?.name) {
        nameInput.value = overlay.metadata.name;
      }
      
      // TODO: Charger les éléments de l'overlay dans l'éditeur
      console.log('Chargement de l\'overlay', overlayId);
    };
    
    // Fonction pour supprimer un overlay
    const deleteOverlay = (overlayId) => {
      // Supprimer l'overlay de la liste
      savedOverlays = savedOverlays.filter(o => o.id !== overlayId);
      
      // Mettre à jour le stockage
      localStorage.setItem('saved_overlays', JSON.stringify(savedOverlays));
      
      // Mettre à jour l'affichage
      window.updateLibrary();
      
      // Afficher un message
      alert('Overlay supprimé avec succès');
    };
    
    // Fonction pour copier l'URL de l'overlay pour OBS
    const copyOverlayUrl = (overlayId) => {
      try {
        // Récupérer l'ID utilisateur Twitch
        const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
        const userId = userData?.id || 'anonymous';
        
        // Créer un jeton simple qui contient l'ID utilisateur et l'ID de l'overlay
        const tokenData = `${userId}-${overlayId}`;
        console.log("Données du token avant encodage:", tokenData);
        
        // Vérifier que le tokenData contient bien le séparateur
        if (!tokenData.includes('-')) {
          console.error("Erreur: TokenData ne contient pas de séparateur:", tokenData);
          alert("Erreur lors de la génération du token. UserId ou OverlayId manquant.");
          return;
        }
        
        // Encoder en base64 pour plus de lisibilité
        const token = btoa(tokenData);
        
        // Générer l'URL avec le token
        const baseUrl = window.location.origin;
        const overlayUrl = `${baseUrl}/overlay.html?token=${token}`;
        
        // Copier l'URL dans le presse-papiers
        const tempInput = document.createElement('input');
        tempInput.value = overlayUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        // Afficher un message de confirmation
        alert('URL copiée dans le presse-papiers. Vous pouvez maintenant l\'utiliser dans OBS comme source de navigateur.');
        
        // Afficher l'URL pour le débogage
        console.log("URL de l'overlay copiée:", overlayUrl);
        console.log("Token:", token);
        console.log("Données du token:", tokenData);
      } catch (error) {
        console.error('Erreur lors de la génération de l\'URL:', error);
        alert('Une erreur est survenue lors de la génération de l\'URL. Veuillez réessayer.');
      }
    };
    
    // Initialiser la recherche et le tri
    const initSearch = () => {
      const searchInput = document.getElementById('search-overlays');
      const sortSelect = document.getElementById('sort-overlays');
      
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          filterOverlays(searchInput.value, sortSelect ? sortSelect.value : 'recent');
        });
      }
      
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          filterOverlays(searchInput ? searchInput.value : '', sortSelect.value);
        });
      }
    };
    
    // Fonction pour filtrer les overlays
    const filterOverlays = (search, sort) => {
      let filteredOverlays = [...savedOverlays];
      
      // Filtrer par recherche
      if (search) {
        const searchLower = search.toLowerCase();
        filteredOverlays = filteredOverlays.filter(overlay => {
          const name = (overlay.metadata?.name || '').toLowerCase();
          const desc = (overlay.metadata?.description || '').toLowerCase();
          return name.includes(searchLower) || desc.includes(searchLower);
        });
      }
      
      // Tri des résultats
      switch (sort) {
        case 'recent':
          filteredOverlays.sort((a, b) => {
            const dateA = new Date(a.metadata?.createdAt || 0);
            const dateB = new Date(b.metadata?.createdAt || 0);
            return dateB - dateA;
          });
          break;
        case 'name':
          filteredOverlays.sort((a, b) => {
            const nameA = (a.metadata?.name || '').toLowerCase();
            const nameB = (b.metadata?.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
          break;
        case 'type':
          filteredOverlays.sort((a, b) => {
            const typeA = a.metadata?.category || '';
            const typeB = b.metadata?.category || '';
            return typeA.localeCompare(typeB);
          });
          break;
      }
      
      // TODO: Mettre à jour l'affichage avec les overlays filtrés
      // Pour l'instant on réinitialise simplement l'affichage
      window.updateLibrary();
    };
    
    // Initialiser la recherche
    initSearch();
    
    // Mettre à jour l'affichage
    window.updateLibrary();
  };
  
  // Attendre que la vue de la bibliothèque soit visible
  document.addEventListener('viewChanged', (event) => {
    if (event.detail.view === 'library') {
      initLibrary();
    }
  });
});
