
/**
 * Module de bibliothèque pour le Studio
 * Gère l'affichage et l'interaction avec les overlays sauvegardés
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Module bibliothèque chargé');
  
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
      if (!libraryGrid) {
        console.error("Conteneur de la grille non trouvé");
        return;
      }
      
      // Si aucun overlay sauvegardé, afficher un message
      if (savedOverlays.length === 0) {
        console.log("Aucun overlay trouvé, affichage du message vide");
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
            console.log("Passage à l'éditeur depuis la bibliothèque vide");
            const event = new CustomEvent('viewChanged', { detail: { view: 'editor' } });
            document.dispatchEvent(event);
          });
        }
      } else {
        // Afficher les overlays sauvegardés
        console.log(`Affichage de ${savedOverlays.length} overlays dans la bibliothèque`);
        let overlaysHTML = '';
        
        savedOverlays.forEach(overlay => {
          const date = new Date(overlay.metadata?.createdAt || Date.now());
          const formattedDate = date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          });
          
          // Image de prévisualisation
          let thumbnailImage = '';
          if (overlay.thumbnail) {
            thumbnailImage = `<img src="${overlay.thumbnail}" alt="Aperçu" class="overlay-thumbnail-img">`;
          } else {
            thumbnailImage = `<div class="overlay-placeholder">Aperçu</div>`;
          }
          
          overlaysHTML += `
            <div class="overlay-card" data-id="${overlay.id}">
              <div class="overlay-preview">
                <div class="overlay-thumbnail" style="background-color: ${overlay.background || '#000'}">
                  ${thumbnailImage}
                </div>
                <div class="overlay-actions">
                  <button class="edit-overlay" data-id="${overlay.id}">Éditer</button>
                  <button class="copy-overlay-url" data-id="${overlay.id}">Copier URL</button>
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
        console.log("Contenu HTML de la bibliothèque généré");
        
        // Ajouter les événements aux boutons
        libraryGrid.querySelectorAll('.edit-overlay').forEach(btn => {
          btn.addEventListener('click', function() {
            const overlayId = this.dataset.id;
            console.log(`Demande d'édition de l'overlay: ${overlayId}`);
            editOverlay(overlayId);
          });
        });
        
        libraryGrid.querySelectorAll('.copy-overlay-url').forEach(btn => {
          btn.addEventListener('click', function() {
            const overlayId = this.dataset.id;
            console.log(`Copie de l'URL de l'overlay: ${overlayId}`);
            copyOverlayUrl(overlayId);
          });
        });
        
        libraryGrid.querySelectorAll('.delete-overlay').forEach(btn => {
          btn.addEventListener('click', function() {
            const overlayId = this.dataset.id;
            console.log(`Demande de suppression de l'overlay: ${overlayId}`);
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
    const editOverlay = (overlayId) => {
      // Charger les données de l'overlay
      const overlay = savedOverlays.find(o => o.id === overlayId);
      if (!overlay) {
        console.error(`Overlay avec l'ID ${overlayId} non trouvé`);
        return;
      }
      
      console.log(`Chargement de l'overlay pour édition: ${overlayId}`);
      
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
      
      // Charger les éléments de l'overlay dans l'éditeur
      if (window.loadOverlay) {
        console.log("Appel de la fonction loadOverlay");
        window.loadOverlay(overlayId);
      } else {
        console.error("La fonction loadOverlay n'est pas disponible");
      }
    };
    
    // Fonction pour copier l'URL d'un overlay
    const copyOverlayUrl = (overlayId) => {
      // Récupérer l'overlay
      const overlay = savedOverlays.find(o => o.id === overlayId);
      if (!overlay) {
        console.error(`Overlay avec l'ID ${overlayId} non trouvé pour la copie d'URL`);
        return;
      }
      
      // Générer l'URL pour OBS
      const baseUrl = window.location.origin;
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      const userId = userData.id || 'anonymous';
      
      // Créer un token encodé pour l'URL
      const token = btoa(`${userId}-${overlayId}`);
      const url = `${baseUrl}/overlay.html?token=${token}`;
      
      console.log(`URL générée pour OBS: ${url}`);
      
      // Copier l'URL dans le presse-papier
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      // Afficher une notification
      showNotification('URL copiée dans le presse-papier', 'success');
    };
    
    // Fonction pour supprimer un overlay
    const deleteOverlay = (overlayId) => {
      console.log(`Suppression de l'overlay: ${overlayId}`);
      
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
          console.log(`Recherche: ${searchInput.value}`);
          filterOverlays(searchInput.value, sortSelect ? sortSelect.value : 'recent');
        });
      }
      
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          console.log(`Tri: ${sortSelect.value}`);
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
      
      // Sauvegarder les overlays filtrés temporairement
      const tempOverlays = savedOverlays;
      savedOverlays = filteredOverlays;
      
      // Mettre à jour l'affichage
      window.updateLibrary();
      
      // Restaurer tous les overlays
      savedOverlays = tempOverlays;
    };
    
    // Afficher une notification
    function showNotification(message, type = 'info') {
      // Créer l'élément de notification s'il n'existe pas
      let notification = document.querySelector('.studio-notification');
      if (!notification) {
        notification = document.createElement('div');
        notification.className = 'studio-notification';
        document.body.appendChild(notification);
      }
      
      // Définir le type et le message
      notification.className = `studio-notification ${type}`;
      notification.textContent = message;
      
      // Afficher la notification
      notification.style.display = 'block';
      setTimeout(() => {
        notification.classList.add('visible');
      }, 10);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
          notification.style.display = 'none';
        }, 300);
      }, 3000);
    }
    
    // Initialiser la recherche
    initSearch();
    
    // Mettre à jour l'affichage
    window.updateLibrary();
    console.log("Bibliothèque initialisée et mise à jour");
  };
  
  // Attendre que la vue de la bibliothèque soit visible
  document.addEventListener('viewChanged', (event) => {
    if (event.detail.view === 'library') {
      console.log("Vue bibliothèque activée, initialisation");
      initLibrary();
    }
  });
  
  // Initialiser la bibliothèque si nous sommes directement sur la vue bibliothèque (via hash)
  if (window.location.hash === '#library') {
    console.log("Bibliothèque demandée via hash, initialisation immédiate");
    setTimeout(initLibrary, 500); // Petit délai pour s'assurer que le DOM est prêt
  }
});
