// Gestion de la navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Mise à jour des boutons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Affichage de la vue correspondante
    const viewType = btn.dataset.view;
    document.getElementById('grid-view').classList.toggle('hidden', viewType !== 'grid');
    document.getElementById('folder-view').classList.toggle('hidden', viewType !== 'folders');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // L'URL de production sera automatiquement détectée
  const PRODUCTION_URL = window.location.origin;
  const previewContainer = document.querySelector('.preview-background');
  const previewFrame = document.getElementById('overlay-preview');
  const bgColor = document.getElementById('bg-color');
  const bgTransparent = document.getElementById('bg-transparent');
  const bgImageBtn = document.getElementById('bg-image-btn');
  const bgImageInput = document.getElementById('bg-image');
  const copyButton = document.getElementById('copy-url');
  const sizeInfo = document.querySelector('.size-info');
  const previewContainerWrapper = document.querySelector('.preview-container');

  // Initialiser l'authentification Twitch
  import('./auth.js').then(module => {
    module.initTwitchAuth();
  });

  // Gestion des overlays avec support des tailles
  document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', () => {      
      document.querySelectorAll('.overlay-item').forEach(i => i.classList.remove('active'));      
      item.classList.add('active');
      
      // Construire l'URL complète pour la preview
      const localPath = item.dataset.url;
      const fullPath = new URL(localPath, window.location.origin).pathname;
      
      // Préserver les paramètres d'URL existants lors du changement d'overlay
      const currentParams = new URLSearchParams(previewFrame.src.split('?')[1] || '');
      const newUrl = new URL(fullPath, window.location.origin);
      currentParams.forEach((value, key) => {
        newUrl.searchParams.set(key, value);
      });
      
      previewFrame.src = newUrl.toString();
      
      // Mise à jour de la taille recommandée
      const size = item.dataset.size;
      if (size) {
        sizeInfo.textContent = `Taille recommandée : ${size}`;
        
        // Ajuster le ratio de la preview
        const [width, height] = size.split('x').map(Number);
        const ratio = width / height;
        previewContainerWrapper.style.aspectRatio = ratio;
      }
      updatePreviewSize();
    });
  });

  // Gestion du fond de couleur avec transition
  bgColor.addEventListener('input', (e) => {
    previewContainer.style.transition = 'background-color 0.3s ease';
    previewContainer.style.backgroundColor = e.target.value;
    previewContainer.style.backgroundImage = '';
    updateActiveBackgroundButton('color');
  });

  // Motif de fond transparent amélioré
  bgTransparent.addEventListener('click', () => {
    previewContainer.style.transition = 'background 0.3s ease';
    previewContainer.style.backgroundColor = 'transparent';
    previewContainer.style.backgroundImage = `
      linear-gradient(45deg, rgba(128, 128, 128, 0.2) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(128, 128, 128, 0.2) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.2) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.2) 75%)
    `;
    previewContainer.style.backgroundSize = '20px 20px';
    previewContainer.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
    updateActiveBackgroundButton('transparent');
  });

  // Gestion améliorée du fond image
  bgImageBtn.addEventListener('click', () => bgImageInput.click());
  
  bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewContainer.style.transition = 'background 0.3s ease';
        previewContainer.style.backgroundImage = `url(${e.target.result})`;
        previewContainer.style.backgroundColor = 'transparent';
        previewContainer.style.backgroundSize = 'cover';
        previewContainer.style.backgroundPosition = 'center';
        updateActiveBackgroundButton('image');
      };
      reader.readAsDataURL(file);
    }
  });

  // Gestion de la copie d'URL avec feedback amélioré
  copyButton.addEventListener('click', async () => {
    const activeOverlay = document.querySelector('.overlay-item.active');
    if (!activeOverlay) return;

    const localPath = activeOverlay.dataset.url;
    // Construire l'URL complète pour la production en incluant les paramètres actuels
    const previewUrl = new URL(previewFrame.src);
    const fullPath = new URL(localPath, PRODUCTION_URL);
    
    // Copier tous les paramètres de la preview vers l'URL finale
    previewUrl.searchParams.forEach((value, key) => {
      fullPath.searchParams.set(key, value);
    });
    
    // Ajouter le token Twitch pour les overlays qui en ont besoin
    const token = localStorage.getItem('twitch_token');
    if (token && (localPath.includes('followers-goal') || localPath.includes('chat-overlay'))) {
      fullPath.searchParams.set('token', token);
    }
    
    try {
      await navigator.clipboard.writeText(fullPath.toString());
      copyButton.style.transition = 'transform 0.2s ease';
      copyButton.style.transform = 'scale(1.05)';
      copyButton.textContent = 'URL Copiée !';
      
      setTimeout(() => {
        copyButton.style.transform = 'scale(1)';
        setTimeout(() => {
          copyButton.textContent = 'Copier l\'URL pour OBS';
        }, 200);
      }, 1000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  });

  // Gestion des états des boutons de fond
  function updateActiveBackgroundButton(type = null) {
    const buttons = [bgTransparent, bgImageBtn];
    buttons.forEach(btn => {
      btn.classList.remove('active');
      btn.style.transition = 'background 0.3s ease';
    });
    
    if (type === 'transparent') bgTransparent.classList.add('active');
    if (type === 'image') bgImageBtn.classList.add('active');
  }

  // Fonction pour mettre à jour la taille de la preview
  function updatePreviewSize() {
    const activeOverlay = document.querySelector('.overlay-item.active');
    if (!activeOverlay || !activeOverlay.dataset.size) return;

    const [targetWidth, targetHeight] = activeOverlay.dataset.size.split('x').map(Number);
    const container = document.querySelector('.preview-container');
    const previewBackground = document.querySelector('.preview-background');
    const iframe = document.getElementById('overlay-preview');

    // Déterminer si c'est un overlay plein écran
    const isFullScreen = targetWidth >= 1920;
    container.setAttribute('data-full-screen', isFullScreen);

    // Définir le ratio exact de l'overlay
    const targetRatio = targetWidth / targetHeight;
    
    // Ajuster le conteneur principal pour qu'il ait exactement le même ratio que l'overlay
    // Mais seulement si ce n'est pas un petit overlay comme "Réseaux & Code"
    if (targetWidth > 800) {
      container.style.aspectRatio = targetRatio;
    } else {
      // Pour les petits overlays, on utilise une taille minimale
      container.style.aspectRatio = "auto";
      container.style.minWidth = "600px";
      container.style.minHeight = "200px";
    }

    // Calculer les dimensions du conteneur
    const containerRect = container.getBoundingClientRect();
    
    // Calculer l'échelle optimale pour l'iframe
    const scale = Math.min(
      containerRect.width / targetWidth,
      containerRect.height / targetHeight
    ) * 0.95; // 95% pour laisser une petite marge

    // Appliquer la transformation à l'iframe
    iframe.style.width = `${targetWidth}px`;
    iframe.style.height = `${targetHeight}px`;
    iframe.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    // IMPORTANT: Ajuster le fond de prévisualisation pour qu'il corresponde exactement à l'overlay
    // C'est cette partie qui résout le problème du fond trop grand
    const scaledWidth = targetWidth * scale;
    const scaledHeight = targetHeight * scale;
    
    previewBackground.style.width = `${scaledWidth}px`;
    previewBackground.style.height = `${scaledHeight}px`;
    previewBackground.style.top = '50%';
    previewBackground.style.left = '50%';
    previewBackground.style.transform = 'translate(-50%, -50%)';
  }

  // Mettre à jour la taille lors du chargement de l'iframe
  document.getElementById('overlay-preview').addEventListener('load', updatePreviewSize);

  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', updatePreviewSize);

  // Initialisation de l'état
  const activeOverlay = document.querySelector('.overlay-item.active');
  if (activeOverlay) {
    const size = activeOverlay.dataset.size;
    if (size) {
      sizeInfo.textContent = `Taille recommandée : ${size}`;
    }
  }
  // Activer le fond transparent par défaut au lieu de la couleur
  bgTransparent.click();
  // Appliquer la mise à jour de taille
  updatePreviewSize();

  // Gestion des dossiers d'overlays
  document.querySelectorAll('.folder-header').forEach(header => {
    header.addEventListener('click', () => {
      const folderItem = header.closest('.folder-item');
      folderItem.classList.toggle('open');
    });
  });

  // Mise à jour de la gestion des overlays pour prendre en compte les dossiers
  document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', (event) => {
      // Empêcher la propagation vers le dossier parent
      event.stopPropagation();
      
      document.querySelectorAll('.overlay-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Construire l'URL complète pour la preview en préservant les paramètres
      const localPath = item.dataset.url;
      const currentParams = new URLSearchParams(previewFrame.src.split('?')[1] || '');
      const newUrl = new URL(localPath, window.location.origin);
      
      // Copier les paramètres existants sauf le token (qui sera ajouté si nécessaire)
      currentParams.forEach((value, key) => {
        if (key !== 'token') {
          newUrl.searchParams.set(key, value);
        }
      });
      
      // Ajouter le token Twitch pour les overlays qui en ont besoin
      const token = localStorage.getItem('twitch_token');
      if (token && (localPath.includes('followers-goal') || localPath.includes('chat-overlay'))) {
        newUrl.searchParams.set('token', token);
      }
      
      previewFrame.src = newUrl.toString();
      
      // Mise à jour de la taille recommandée
      const size = item.dataset.size;
      if (size) {
        sizeInfo.textContent = `Taille recommandée : ${size}`;
        
        // Ajuster le ratio de la preview
        const [width, height] = size.split('x').map(Number);
        const ratio = width / height;
        previewContainerWrapper.style.aspectRatio = ratio;
      }
      updatePreviewSize();
    });
  });
});

function updatePreview(item) {
  const url = item.dataset.url;
  const size = item.dataset.size;
  const [width, height] = size.split('x').map(Number);
  const previewFrame = document.getElementById('overlay-preview');
  const sizeInfo = document.querySelector('.size-info');
  const previewContainer = document.querySelector('.preview-container');

  // Construire l'URL finale
  const finalUrl = new URL(url, window.location.origin);
  
  // Ajouter le token Twitch pour tous les overlays qui en ont besoin
  const token = localStorage.getItem('twitch_token');
  if (token && (url.includes('followers-goal') || url.includes('chat-overlay'))) {
    finalUrl.searchParams.set('token', token);
  }

  // Préserver les autres paramètres existants
  const currentParams = new URLSearchParams(previewFrame.src.split('?')[1] || '');
  currentParams.forEach((value, key) => {
    if (key !== 'token') { // Ne pas copier l'ancien token
      finalUrl.searchParams.set(key, value);
    }
  });

  previewFrame.src = finalUrl.toString();
  sizeInfo.textContent = `Taille recommandée : ${size}`;
  
  // Ajuster la taille du conteneur
  const isFullScreen = width >= 1920;
  previewContainer.setAttribute('data-full-screen', isFullScreen);

  // Ajuster l'échelle de l'iframe
  const scale = isFullScreen ? 0.5 : 1;
  previewFrame.style.width = `${width}px`;
  previewFrame.style.height = `${height}px`;
  previewFrame.style.transform = `translate(-50%, -50%) scale(${scale})`;
}