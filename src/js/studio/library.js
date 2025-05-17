/**
 * Script de la bibliothèque d'overlays
 * Gère l'affichage et la gestion des overlays sauvegardés
 */

document.addEventListener('DOMContentLoaded', () => {
  // Éléments du DOM
  const libraryView = document.getElementById('library-view');
  const overlaysGrid = libraryView.querySelector('.overlays-grid');
  const emptyMessage = libraryView.querySelector('.empty-library-message');
  const searchInput = document.getElementById('search-overlays');
  const sortSelect = document.getElementById('sort-overlays');
  
  // Variables globales
  let userOverlays = [];
  
  // Charger les overlays de l'utilisateur
  const loadUserOverlays = () => {
    // Récupérer les overlays depuis le localStorage
    userOverlays = JSON.parse(localStorage.getItem('user_overlays') || '[]');
    
    // Afficher les overlays
    displayOverlays();
  };
  
  // Afficher les overlays dans la grille
  const displayOverlays = (filter = '') => {
    // Vider la grille
    while (overlaysGrid.firstChild) {
      if (overlaysGrid.firstChild === emptyMessage) {
        break;
      }
      overlaysGrid.removeChild(overlaysGrid.firstChild);
    }
    
    // Filtrer les overlays
    let filteredOverlays = userOverlays;
    
    if (filter) {
      const searchTerm = filter.toLowerCase();
      filteredOverlays = userOverlays.filter(overlay => 
        overlay.name.toLowerCase().includes(searchTerm) ||
        (overlay.metadata && overlay.metadata.description && overlay.metadata.description.toLowerCase().includes(searchTerm)) ||
        (overlay.metadata && overlay.metadata.category && overlay.metadata.category.toLowerCase().includes(searchTerm))
      );
    }
    
    // Trier les overlays
    const sortBy = sortSelect.value;
    
    switch (sortBy) {
      case 'recent':
        filteredOverlays.sort((a, b) => {
          const dateA = a.metadata && a.metadata.updatedAt ? new Date(a.metadata.updatedAt) : new Date(0);
          const dateB = b.metadata && b.metadata.updatedAt ? new Date(b.metadata.updatedAt) : new Date(0);
          return dateB - dateA;
        });
        break;
        
      case 'name':
        filteredOverlays.sort((a, b) => a.name.localeCompare(b.name));
        break;
        
      case 'type':
        filteredOverlays.sort((a, b) => {
          const categoryA = a.metadata && a.metadata.category ? a.metadata.category : '';
          const categoryB = b.metadata && b.metadata.category ? b.metadata.category : '';
          return categoryA.localeCompare(categoryB);
        });
        break;
    }
    
    // Afficher le message si la bibliothèque est vide
    if (filteredOverlays.length === 0) {
      if (filter) {
        // Message de recherche sans résultats
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'empty-library-message';
        noResultsMessage.innerHTML = `
          <div class="empty-icon">🔍</div>
          <h2>Aucun résultat trouvé</h2>
          <p>Aucun overlay ne correspond à votre recherche "${filter}"</p>
          <button class="action-btn" id="clear-search">Effacer la recherche</button>
        `;
        overlaysGrid.appendChild(noResultsMessage);
        
        // Gestionnaire pour effacer la recherche
        document.getElementById('clear-search').addEventListener('click', () => {
          searchInput.value = '';
          displayOverlays();
        });
      } else {
        // Message de bibliothèque vide
        emptyMessage.style.display = 'flex';
      }
      return;
    }
    
    // Masquer le message si la bibliothèque n'est pas vide
    emptyMessage.style.display = 'none';
    
    // Créer les cartes d'overlay
    filteredOverlays.forEach(overlay => {
      const card = createOverlayCard(overlay);
      overlaysGrid.appendChild(card);
    });
  };
  
  // Créer une carte d'overlay
  const createOverlayCard = (overlay) => {
    const card = document.createElement('div');
    card.className = 'overlay-card';
    card.dataset.id = overlay.id;
    
    // Déterminer la catégorie et l'icône
    let categoryIcon = '🎮';
    let categoryName = 'Autre';
    
    if (overlay.metadata && overlay.metadata.category) {
      switch (overlay.metadata.category) {
        case 'starting':
          categoryIcon = '🚀';
          categoryName = 'Starting Soon';
          break;
          
        case 'brb':
          categoryIcon = '⏱️';
          categoryName = 'Be Right Back';
          break;
          
        case 'ending':
          categoryIcon = '👋';
          categoryName = 'Stream Ending';
          break;
          
        case 'social':
          categoryIcon = '📱';
          categoryName = 'Réseaux sociaux';
          break;
          
        case 'gaming':
          categoryIcon = '🎮';
          categoryName = 'Gaming';
          break;
      }
    }
    
    // Formater la date
    const updatedAt = overlay.metadata && overlay.metadata.updatedAt 
      ? new Date(overlay.metadata.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Date inconnue';
    
    // Créer la prévisualisation
    const previewHtml = window.generatePreviewHtml({
      elements: overlay.elements,
      canvas: overlay.canvas
    });
    
    // Créer le blob pour l'iframe
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const previewUrl = URL.createObjectURL(blob);
    
    // Construire la carte
    card.innerHTML = `
      <div class="overlay-preview">
        <iframe src="${previewUrl}" frameborder="0"></iframe>
        <div class="overlay-actions">
          <button class="edit-overlay-btn" title="Modifier">✏️</button>
          <button class="copy-overlay-url-btn" title="Copier l'URL">📋</button>
          <button class="delete-overlay-btn" title="Supprimer">🗑️</button>
        </div>
      </div>
      <div class="overlay-info">
        <h3>${overlay.name}</h3>
        <div class="overlay-meta">
          <span class="overlay-category">${categoryIcon} ${categoryName}</span>
          <span class="overlay-date">Modifié le ${updatedAt}</span>
        </div>
        ${overlay.metadata && overlay.metadata.description ? `<p class="overlay-description">${overlay.metadata.description}</p>` : ''}
      </div>
    `;
    
    // Ajouter les gestionnaires d'événements
    card.querySelector('.edit-overlay-btn').addEventListener('click', () => {
      // Charger l'overlay dans l'éditeur
      window.loadOverlay(overlay);
      
      // Changer de vue
      document.querySelector('.nav-btn[data-view="editor"]').click();
    });
    
    card.querySelector('.copy-overlay-url-btn').addEventListener('click', () => {
      // Générer l'URL pour OBS
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      const userId = userData.id || 'anonymous';
      
      const obsUrl = new URL('/overlay.html', window.location.origin);
      const token = btoa(`${userId}-${overlay.id}`);
      obsUrl.searchParams.set('token', token);
      
      // Afficher l'URL dans la modale
      const obsUrlInput = document.getElementById('obs-url');
      if (obsUrlInput) {
        obsUrlInput.value = obsUrl.toString();
      }
      
      // Ouvrir la modale
      window.openModal('url-modal');
    });
    
    card.querySelector('.delete-overlay-btn').addEventListener('click', () => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'overlay "${overlay.name}" ?`)) {
        // Supprimer l'overlay
        deleteOverlay(overlay.id);
      }
    });
    
    return card;
  };
  
  // Supprimer un overlay
  const deleteOverlay = (overlayId) => {
    // Filtrer les overlays
    userOverlays = userOverlays.filter(overlay => overlay.id !== overlayId);
    
    // Mettre à jour le localStorage
    localStorage.setItem('user_overlays', JSON.stringify(userOverlays));
    
    // Mettre à jour l'affichage
    displayOverlays(searchInput.value);
  };
  
  // Mettre à jour la bibliothèque
  window.updateLibrary = () => {
    loadUserOverlays();
  };
  
  // Initialiser les gestionnaires d'événements
  const initEventListeners = () => {
    // Recherche
    searchInput.addEventListener('input', (e) => {
      displayOverlays(e.target.value);
    });
    
    // Tri
    sortSelect.addEventListener('change', () => {
      displayOverlays(searchInput.value);
    });
    
    // Changement de vue
    document.addEventListener('viewChanged', (e) => {
      if (e.detail.view === 'library') {
        loadUserOverlays();
      }
    });
  };
  
  // Initialiser la bibliothèque
  loadUserOverlays();
  initEventListeners();
});