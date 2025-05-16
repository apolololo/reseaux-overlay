// Importation du middleware de sécurité
import { isAuthenticated, redirectToAuth } from './securityMiddleware.js';

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
  // Vérification de l'authentification
  if (!isAuthenticated()) {
    redirectToAuth();
    return;
  }

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

  // Génération d'un jeton simple pour les overlays (compatible partout)
  function generateOverlayToken(overlayPath) {
    // Récupérer l'ID utilisateur Twitch
    const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
    const userId = userData?.id || 'anonymous';
    
    // Créer un jeton simple qui contient l'ID utilisateur et le chemin de l'overlay
    const tokenData = userId + '-' + overlayPath;
    
    // Encoder en base64 pour plus de lisibilité
    const token = btoa(tokenData);
    
    return token;
  }

  function generateOverlayUrl(overlayPath) {
    const userId = localStorage.getItem('twitch_user_id');
    if (!userId) {
      console.error('User ID not found');
      return null;
    }

    // Créer un token avec l'ID utilisateur et un timestamp
    const token = btoa(`${userId}-${Date.now()}`);
    
    // Nettoyer le chemin de l'overlay
    let cleanPath = overlayPath;
    if (cleanPath.startsWith('/src/')) {
      cleanPath = cleanPath.substring(5);
    }
    
    // Construire l'URL de l'overlay
    const url = new URL('/overlay.html', window.location.origin);
    url.searchParams.set('token', token);
    url.searchParams.set('path', cleanPath);
    
    return url.toString();
  }

  // Gestion des overlays avec support des tailles et jetons
  document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', () => {
      const overlayPath = item.dataset.url;
      const overlayUrl = generateOverlayUrl(overlayPath);
      
      if (overlayUrl) {
        // Mettre à jour l'iframe de prévisualisation
        const previewFrame = document.getElementById('overlay-preview');
        if (previewFrame) {
          previewFrame.src = overlayUrl;
        }
        
        // Mettre à jour le bouton de copie
        const copyButton = document.getElementById('copy-url');
        if (copyButton) {
          copyButton.onclick = () => {
            navigator.clipboard.writeText(overlayUrl).then(() => {
              copyButton.textContent = 'URL copiée !';
              setTimeout(() => {
                copyButton.textContent = 'Copier l\'URL pour OBS';
              }, 2000);
            });
          };
        }
      }
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

  // Gestion de la copie d'URL avec jetons et feedback amélioré
  copyButton.addEventListener('click', async () => {
    const activeOverlay = document.querySelector('.overlay-item.active');
    if (!activeOverlay) return;

    const localPath = activeOverlay.dataset.url;
    
    // Générer un nouveau jeton pour cet overlay (format simple)
    const token = generateOverlayToken(localPath);
    
    // Construire l'URL avec le jeton
    const overlayUrl = new URL('/overlay.html', PRODUCTION_URL);
    overlayUrl.searchParams.set('token', token);
    
    // Copier tous les paramètres pertinents de la preview
    const previewUrl = new URL(previewFrame.src);
    previewUrl.searchParams.forEach((value, key) => {
      if (key !== 'token' && key !== 'access_token') { // Ne pas copier l'ancien token s'il existe
        overlayUrl.searchParams.set(key, value);
      }
    });
    
    try {
      await navigator.clipboard.writeText(overlayUrl.toString());
      copyButton.style.transition = 'transform 0.2s ease';
      copyButton.style.transform = 'scale(1.05)';
      copyButton.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        URL Copiée !
      `;
      
      setTimeout(() => {
        copyButton.style.transform = 'scale(1)';
        setTimeout(() => {
          copyButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copier l'URL pour OBS
          `;
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
    
    // Calculer la taille maximale disponible en respectant les marges
    const containerWidth = container.clientWidth - 40; // Marge horizontale
    const containerHeight = container.clientHeight - 40; // Marge verticale

    // Calculer le ratio original
    const ratio = targetWidth / targetHeight;
    
    // Calculer la taille maximale possible en préservant le ratio
    let width, height;
    
    if (containerWidth / ratio <= containerHeight) {
      // Limité par la largeur
      width = containerWidth;
      height = width / ratio;
    } else {
      // Limité par la hauteur
      height = containerHeight;
      width = height * ratio;
    }
    
    // Appliquer la taille à l'iframe directement sans scaling
    previewFrame.style.width = `${targetWidth}px`;
    previewFrame.style.height = `${targetHeight}px`;
    
    // Calculer le scale en fonction de la taille voulue versus la taille disponible
    const scale = Math.min(width / targetWidth, height / targetHeight);
    
    // Appliquer la transformation pour centrer et scaler
    previewFrame.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    // Ajuster la taille du conteneur de background
    const previewBackground = document.querySelector('.preview-background');
    previewBackground.style.width = `${width}px`;
    previewBackground.style.height = `${height}px`;
  }

  // Mettre à jour la taille lors du chargement de l'iframe
  previewFrame.addEventListener('load', updatePreviewSize);

  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', updatePreviewSize);

  // Initialisation de l'état
  const activeOverlay = document.querySelector('.overlay-item.active');
  if (activeOverlay) {
    const size = activeOverlay.dataset.size;
    if (size) {
      sizeInfo.textContent = `Taille recommandée : ${size}`;
    }
    
    // Déclencher un clic sur l'overlay actif pour charger la prévisualisation avec le token
    activeOverlay.click();
  }
  
  // Activer le fond transparent par défaut
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

  // Afficher l'interface une fois tout initialisé
  document.getElementById('app').style.display = 'flex';
  document.querySelector('.loading-screen').style.display = 'none';
});
