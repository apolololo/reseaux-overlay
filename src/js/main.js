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
  // Vérification de l'authentification Twitch
  const checkAuth = () => {
    const authProvider = localStorage.getItem('auth_provider');
    if (authProvider !== 'twitch') {
      window.location.replace('./src/auth.html');
      return false;
    }

    const token = localStorage.getItem('twitch_token');
    const expiresAt = localStorage.getItem('twitch_expires_at');
    
    if (!token || !expiresAt || new Date().getTime() > parseInt(expiresAt)) {
      window.location.replace('./src/auth.html');
      return false;
    }
    return true;
  };
  
  // Vérifier l'authentification au chargement
  if (!checkAuth()) return;

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

  // Génération d'un jeton enrichi pour les overlays avec données Twitch
  function generateOverlayToken(overlayPath) {
    // Récupérer l'ID utilisateur Twitch et le token
    const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
    const twitchToken = localStorage.getItem('twitch_token');
    const userId = userData?.id || 'anonymous';
    
    // Créer un jeton qui contient toutes les données nécessaires
    const tokenData = {
      userId: userId,
      overlayPath: overlayPath,
      twitchData: {
        token: twitchToken,
        user: userData
      },
      timestamp: Date.now()
    };
    
    // Encoder en base64 pour plus de sécurité et lisibilité
    const token = btoa(JSON.stringify(tokenData));
    
    return token;
  }

  // Gestion des overlays avec support des tailles et jetons
  document.querySelectorAll('.overlay-item').forEach(item => {
    item.addEventListener('click', () => {
      // Retirer la classe active de tous les items
      document.querySelectorAll('.overlay-item').forEach(i => i.classList.remove('active'));
      
      // Ajouter la classe active à l'item cliqué
      item.classList.add('active');
      
      // Mettre à jour l'iframe de prévisualisation
      const iframe = document.getElementById('overlay-preview');
      const url = item.dataset.url;
      const size = item.dataset.size;
      
      // Générer le token et l'URL avec la configuration
      const token = generateOverlayToken(url);
      const previewUrl = new URL(url, PRODUCTION_URL);
      previewUrl.searchParams.set('token', token);
      
      // Ajouter les paramètres de configuration spécifiques à l'utilisateur
      const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
      const configKey = `followers_goal_config_${userData.id || 'anonymous'}`;
      const config = localStorage.getItem(configKey);
      if (config) {
        const configParams = JSON.parse(config);
        Object.entries(configParams).forEach(([key, value]) => {
          previewUrl.searchParams.set(key, value);
        });
      }
      
      // Mettre à jour l'iframe avec l'URL complète
      iframe.src = previewUrl.toString();
      
      // Mettre à jour l'info de taille
      if (sizeInfo) {
        sizeInfo.textContent = `Taille recommandée : ${size}`;
      }

      // Mettre à jour le bouton de configuration
      updateConfigButton(item);
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

  // Gestion de la copie d'URL avec jetons enrichis et feedback amélioré
  copyButton.addEventListener('click', async () => {
    const activeOverlay = document.querySelector('.overlay-item.active');
    if (!activeOverlay) return;

    const localPath = activeOverlay.dataset.url;
    
    // Construire l'URL avec les paramètres de configuration
    const overlayUrl = new URL(localPath, PRODUCTION_URL);
    
    // Générer un token avec les données d'authentification
    const token = generateOverlayToken(localPath);
    overlayUrl.searchParams.set('token', token);
    
    // Ajouter les paramètres de configuration spécifiques à l'utilisateur
    const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
    const configKey = `followers_goal_config_${userData.id || 'anonymous'}`;
    const config = localStorage.getItem(configKey);
    if (config) {
      const configParams = JSON.parse(config);
      Object.entries(configParams).forEach(([key, value]) => {
        overlayUrl.searchParams.set(key, value);
      });
    }
    
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
    // Initialiser le bouton de configuration pour l'overlay actif
    updateConfigButton(activeOverlay);
  }
  
  // Activer le fond transparent par défaut
  bgTransparent.click();
  
  // Fonction pour gérer le bouton de configuration
  function updateConfigButton(overlayItem) {
    const copyInfo = document.querySelector('.copy-info');
    let configButton = document.getElementById('config-button');
    
    // Supprimer le bouton existant s'il y en a un
    if (configButton) {
      configButton.remove();
    }
    
    // Vérifier si l'overlay a une page de configuration
    const configUrl = overlayItem.dataset.config;
    if (configUrl) {
      // Créer le bouton de configuration
      configButton = document.createElement('button');
      configButton.id = 'config-button';
      configButton.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
        Configurer
      `;
      
      // Ajouter les styles
      configButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #9146FF 0%, #00D4AA 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 10px;
      `;
      
      // Ajouter l'événement click
      configButton.addEventListener('click', () => {
        // Construire l'URL absolue pour éviter les problèmes de chemin relatif
        const absoluteConfigUrl = new URL(configUrl, window.location.origin).href;
        window.open(absoluteConfigUrl, '_blank', 'width=600,height=800,scrollbars=yes,resizable=yes');
      });
      
      // Ajouter le bouton avant le bouton de copie
      const copyButton = document.getElementById('copy-url');
      copyInfo.insertBefore(configButton, copyButton);
    }
  }

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
