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
          
          // Générer la prévisualisation
          const previewHtml = window.generatePreviewHtml(overlay);
          const previewBlob = new Blob([previewHtml], { type: 'text/html' });
          const previewUrl = URL.createObjectURL(previewBlob);
          
          // Générer l'URL pour OBS
          const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
          const userId = userData.id || 'anonymous';
          const token = btoa(`${userId}-${overlay.id}`);
          const obsUrl = new URL('/overlay.html', window.location.origin);
          obsUrl.searchParams.set('token', token);
          
          overlaysHTML += `
            <div class="overlay-card" data-id="${overlay.id}">
              <div class="overlay-preview">
                <iframe src="${previewUrl}" frameborder="0"></iframe>
                <div class="overlay-actions">
                  <button class="edit-overlay" data-id="${overlay.id}">Éditer</button>
                  <button class="copy-obs-url" data-url="${obsUrl.toString()}">Copier l'URL OBS</button>
                  <button class="delete-overlay" data-id="${overlay.id}">Supprimer</button>
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
        
        libraryGrid.querySelectorAll('.copy-obs-url').forEach(btn => {
          btn.addEventListener('click', function() {
            const url = this.dataset.url;
            navigator.clipboard.writeText(url).then(() => {
              showNotification('URL copiée dans le presse-papier !', 'success');
              
              // Changer temporairement le texte du bouton
              const originalText = this.textContent;
              this.textContent = 'URL Copiée !';
              setTimeout(() => {
                this.textContent = originalText;
              }, 2000);
            });
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
    const editOverlay = (overlay) => {
      // Charger les données de l'overlay
      const overlayData = savedOverlays.find(o => o.id === overlayId);
      if (!overlayData) return;
      
      // Enregistrer l'ID de l'overlay courant
      window.currentOverlayId = overlayId;
      
      // Passer à la vue éditeur
      const event = new CustomEvent('viewChanged', { detail: { view: 'editor' } });
      document.dispatchEvent(event);
      
      // Mettre à jour le nom de l'overlay
      const nameInput = document.getElementById('overlay-name');
      if (nameInput && overlayData.metadata?.name) {
        nameInput.value = overlayData.metadata.name;
      }
      
      // Charger les éléments de l'overlay dans l'éditeur
      const canvas = document.getElementById('editor-canvas');
      if (canvas) {
        // Vider le canvas
        canvas.innerHTML = '';
        
        // Recréer chaque élément
        overlayData.elements.forEach(element => {
          const newElement = document.createElement('div');
          newElement.className = `editor-element ${element.type}-element`;
          newElement.innerHTML = element.content;
          
          // Appliquer les styles
          Object.entries(element.style).forEach(([key, value]) => {
            if (value) newElement.style[key] = value;
          });
          
          // Rendre l'élément interactif
          makeElementDraggable(newElement);
          makeElementResizable(newElement);
          
          canvas.appendChild(newElement);
        });
      }
    };
    
    // Fonction pour supprimer un overlay
    const deleteOverlay = (overlayId) => {
      // Supprimer l'overlay de la liste
      savedOverlays = savedOverlays.filter(o => o.id !== overlayId);
      
      // Mettre à jour le stockage
      localStorage.setItem('saved_overlays', JSON.stringify(savedOverlays));
      
      // Mettre à jour l'affichage
      window.updateLibrary();
      
      // Afficher une notification
      showNotification('Overlay supprimé avec succès', 'success');
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
      
      // Mettre à jour l'affichage
      const libraryGrid = document.querySelector('.overlays-grid');
      if (libraryGrid) {
        libraryGrid.innerHTML = '';
        
        if (filteredOverlays.length === 0) {
          libraryGrid.innerHTML = `
            <div class="empty-library-message">
              <div class="empty-icon">🔍</div>
              <h2>Aucun résultat</h2>
              <p>Aucun overlay ne correspond à votre recherche</p>
            </div>
          `;
        } else {
          filteredOverlays.forEach(overlay => {
            // ... (même code que dans updateLibrary pour afficher les overlays)
          });
        }
      }
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