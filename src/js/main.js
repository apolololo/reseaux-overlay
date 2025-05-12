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
  const PRODUCTION_URL = 'https://apo-overlay.netlify.app';
  const previewContainer = document.querySelector('.preview-background');
  const previewFrame = document.getElementById('overlay-preview');
  const bgColor = document.getElementById('bg-color');
  const bgTransparent = document.getElementById('bg-transparent');
  const bgImageBtn = document.getElementById('bg-image-btn');
  const bgImageInput = document.getElementById('bg-image');
  const copyButton = document.getElementById('copy-url');
  const sizeInfo = document.querySelector('.size-info');
  const previewContainerWrapper = document.querySelector('.preview-container');

  // Gestion des overlays avec support des tailles
  document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', () => {      document.querySelectorAll('.overlay-item').forEach(i => i.classList.remove('active'));      item.classList.add('active');
      
      // Set the URL directly
      previewFrame.src = item.dataset.url;
      
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
    const productionUrl = `${PRODUCTION_URL}${localPath}`;
    
    try {
      await navigator.clipboard.writeText(productionUrl);
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
    const iframe = document.getElementById('overlay-preview');

    // Déterminer si c'est un overlay plein écran
    const isFullScreen = targetWidth >= 1920;
    container.setAttribute('data-full-screen', isFullScreen);

    // Calculer les dimensions du conteneur
    const containerRect = container.getBoundingClientRect();
    const targetRatio = targetWidth / targetHeight;

    // Ajuster le conteneur
    container.style.aspectRatio = targetRatio;

    // Calculer l'échelle optimale
    const scale = Math.min(
      containerRect.width / targetWidth,
      containerRect.height / targetHeight
    ) * 0.95; // 95% pour laisser une petite marge

    // Appliquer la transformation
    iframe.style.width = `${targetWidth}px`;
    iframe.style.height = `${targetHeight}px`;
    iframe.style.transform = `translate(-50%, -50%) scale(${scale})`;
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
      const [width, height] = size.split('x').map(Number);
      previewContainerWrapper.style.aspectRatio = width / height;
    }
  }
  // Activer le fond transparent par défaut au lieu de la couleur
  bgTransparent.click();
  updatePreviewSize();
});

// Mouse movement optimization using requestAnimationFrame
let mouseX = 0;
let mouseY = 0;
let rafId = null;

function updateMousePosition(e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
    
    if (!rafId) {
        rafId = requestAnimationFrame(updateBackground);
    }
}

function updateBackground() {
    rafId = null;
    const fluid = document.querySelector('.fluid-background');
    if (fluid) {
        fluid.style.setProperty('--mouse-x', mouseX.toString());
        fluid.style.setProperty('--mouse-y', mouseY.toString());
    }
}

// Throttle resize events
let resizeTimeout;
function handleResize() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
        // Update any size-dependent calculations here
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateBackground);
        }
    }, 250);
}

// Initialize event listeners
function initializeEventListeners() {
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
}

// Cleanup event listeners
function cleanup() {
    document.removeEventListener('mousemove', updateMousePosition);
    window.removeEventListener('resize', handleResize);
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeEventListeners);
// Cleanup when page unloads
window.addEventListener('unload', cleanup);

// Gestion de la sélection dans la vue dossiers
document.querySelectorAll('.overlay-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.overlay-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const previewFrame = document.getElementById('folder-preview-frame');
    // À implémenter: chargement de l'overlay correspondant
  });
});
