/**
 * Script principal du Studio
 * Gère la navigation entre les différentes vues et les fonctionnalités communes
 */

document.addEventListener('DOMContentLoaded', () => {
  // Gestion de la navigation
  const navButtons = document.querySelectorAll('.nav-btn');
  const views = {
    editor: document.getElementById('editor-view'),
    library: document.getElementById('library-view'),
    templates: document.getElementById('templates-view')
  };
  
  // Fonction pour changer de vue
  const switchView = (viewName) => {
    // Mettre à jour les boutons de navigation
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Afficher la vue correspondante
    Object.entries(views).forEach(([name, element]) => {
      element.classList.toggle('hidden', name !== viewName);
    });
    
    // Déclencher un événement pour informer les modules spécifiques
    const event = new CustomEvent('viewChanged', { detail: { view: viewName } });
    document.dispatchEvent(event);
  };
  
  // Attacher les gestionnaires d'événements aux boutons de navigation
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewName = btn.dataset.view;
      switchView(viewName);
    });
  });
  
  // Gestion des modales
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal, #close-preview, #cancel-save, #close-url-modal');
  
  // Fonction pour ouvrir une modale
  window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Fonction pour fermer une modale
  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };
  
  // Fermer toutes les modales
  window.closeAllModals = () => {
    modals.forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  };
  
  // Attacher les gestionnaires d'événements aux boutons de fermeture
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Fermer la modale en cliquant en dehors du contenu
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Bouton pour passer à l'éditeur depuis la bibliothèque vide
  const switchToEditorBtn = document.querySelector('.switch-to-editor');
  if (switchToEditorBtn) {
    switchToEditorBtn.addEventListener('click', () => {
      switchView('editor');
    });
  }
  
  // Bouton de prévisualisation
  const previewBtn = document.getElementById('preview-overlay');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      // Générer une prévisualisation de l'overlay actuel
      const previewData = window.generatePreviewData();
      
      // Afficher la prévisualisation dans l'iframe
      const previewFrame = document.getElementById('preview-frame');
      if (previewFrame) {
        // Créer une URL de données pour la prévisualisation
        const previewHtml = window.generatePreviewHtml(previewData);
        const blob = new Blob([previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        previewFrame.src = url;
        
        // Ouvrir la modale de prévisualisation
        window.openModal('preview-modal');
      }
    });
  }
  
  // Bouton de sauvegarde
  const saveBtn = document.getElementById('save-overlay');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Récupérer le nom actuel de l'overlay
      const overlayName = document.getElementById('overlay-name').value;
      document.getElementById('save-overlay-name').value = overlayName;
      
      // Ouvrir la modale de sauvegarde
      window.openModal('save-modal');
    });
  }
  
  // Bouton de confirmation de sauvegarde
  const confirmSaveBtn = document.getElementById('confirm-save');
  if (confirmSaveBtn) {
    confirmSaveBtn.addEventListener('click', async () => {
      // Récupérer les données du formulaire
      const name = document.getElementById('save-overlay-name').value;
      const description = document.getElementById('overlay-description').value;
      const category = document.getElementById('overlay-category').value;
      const isPublic = document.getElementById('overlay-public').checked;
      
      // Récupérer les données de l'overlay
      const overlayData = window.generateOverlayData();
      
      // Ajouter les métadonnées
      overlayData.metadata = {
        name,
        description,
        category,
        isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        // Sauvegarder l'overlay
        const savedOverlay = await window.saveOverlay(overlayData);
        
        // Fermer la modale
        window.closeModal('save-modal');
        
        // Activer le bouton de copie d'URL
        const copyUrlBtn = document.getElementById('copy-url');
        if (copyUrlBtn) {
          copyUrlBtn.disabled = false;
        }
        
        // Afficher un message de succès
        alert('Overlay sauvegardé avec succès !');
        
        // Mettre à jour la bibliothèque
        if (window.updateLibrary) {
          window.updateLibrary();
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'overlay:', error);
        alert('Erreur lors de la sauvegarde de l\'overlay. Veuillez réessayer.');
      }
    });
  }
  
  // Bouton de copie d'URL
  const copyUrlBtn = document.getElementById('copy-url');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      // Récupérer l'ID de l'overlay actuel
      const overlayId = window.currentOverlayId;
      
      if (!overlayId) {
        alert('Veuillez d\'abord sauvegarder l\'overlay pour obtenir une URL.');
        return;
      }
      
      // Générer l'URL pour OBS
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      const userId = userData.id || 'anonymous';
      
      const obsUrl = new URL('/overlay.html', window.location.origin);
      const token = btoa(`${userId}-${overlayId}`);
      obsUrl.searchParams.set('token', token);
      
      // Afficher l'URL dans la modale
      const obsUrlInput = document.getElementById('obs-url');
      if (obsUrlInput) {
        obsUrlInput.value = obsUrl.toString();
      }
      
      // Ouvrir la modale
      window.openModal('url-modal');
    });
  }
  
  // Bouton de copie d'URL dans la modale
  const copyObsUrlBtn = document.getElementById('copy-obs-url');
  if (copyObsUrlBtn) {
    copyObsUrlBtn.addEventListener('click', () => {
      const obsUrlInput = document.getElementById('obs-url');
      if (obsUrlInput) {
        obsUrlInput.select();
        document.execCommand('copy');
        
        // Feedback visuel
        copyObsUrlBtn.textContent = 'Copié !';
        setTimeout(() => {
          copyObsUrlBtn.textContent = 'Copier';
        }, 2000);
      }
    });
  }
  
  // Initialisation : afficher la vue par défaut (éditeur)
  switchView('editor');
});