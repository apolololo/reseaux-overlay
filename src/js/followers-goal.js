// Gestion du widget Followers Goal
export function initFollowersGoal(token) {
  // Vérifier si le token est présent
  if (!token) {
    console.error('Token Twitch manquant');
    return;
  }

  const container = document.createElement('div');
  container.className = 'follower-options';
  container.innerHTML = `
    <div class="follower-settings">
      <h3>Personnalisation de l'objectif</h3>
      <div class="setting-group">
        <label for="follower-label">Titre :</label>
        <input type="text" id="follower-label" value="Objectif Followers">
      </div>
      <div class="setting-group">
        <label for="follower-target">Objectif :</label>
        <input type="number" id="follower-target" min="1" value="500">
      </div>
      <div class="setting-group">
        <label for="follower-theme">Thème :</label>
        <select id="follower-theme">
          <option value="default">Par défaut</option>
          <option value="dark">Sombre</option>
          <option value="light">Clair</option>
        </select>
      </div>
      <div class="setting-group">
        <label for="follower-animation">Animation :</label>
        <select id="follower-animation">
          <option value="slide">Slide</option>
          <option value="fade">Fade</option>
          <option value="bounce">Bounce</option>
        </select>
      </div>
      <button id="update-follower-goal" class="update-btn">Mettre à jour</button>
      <button id="copy-follower-url" class="copy-btn">Copier l'URL pour OBS</button>
    </div>
  `;

  // Ajouter à la section utilisateur
  const userInfoSection = document.querySelector('.user-info-section');
  if (userInfoSection) {
    userInfoSection.appendChild(container);
  }

  // Charger les paramètres sauvegardés
  const savedSettings = localStorage.getItem('follower-goal-settings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      document.getElementById('follower-label').value = settings.label || 'Objectif Followers';
      document.getElementById('follower-target').value = settings.target || 500;
      document.getElementById('follower-theme').value = settings.theme || 'default';
      document.getElementById('follower-animation').value = settings.animation || 'slide';
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  }

  // Initialiser l'aperçu avec le token
  const previewFrame = document.getElementById('overlay-preview');
  if (previewFrame && previewFrame.src.includes('followers-goal')) {
    const url = new URL(previewFrame.src);
    url.searchParams.set('token', token);
    previewFrame.src = url.toString();
  }

  function updateOverlay() {
    const label = document.getElementById('follower-label').value;
    const target = document.getElementById('follower-target').value;
    const theme = document.getElementById('follower-theme').value;
    const animation = document.getElementById('follower-animation').value;

    // Sauvegarder les paramètres
    const settings = { label, target, theme, animation };
    localStorage.setItem('follower-goal-settings', JSON.stringify(settings));

    // Mettre à jour l'aperçu si visible
    const previewFrame = document.getElementById('overlay-preview');
    if (previewFrame && previewFrame.src.includes('followers-goal')) {
      // S'assurer que l'iframe est chargée avant d'envoyer le message
      const updateIframe = () => {
        // Mettre à jour l'URL avec les nouveaux paramètres
        const url = new URL(previewFrame.src);
        url.searchParams.set('label', label);
        url.searchParams.set('target', target);
        url.searchParams.set('theme', theme);
        url.searchParams.set('animation', animation);
        
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('twitch_token');
        if (token) {
          url.searchParams.set('token', token);
        }
        
        previewFrame.src = url.toString();

        // Attendre que l'iframe soit chargée avant d'envoyer le message
        previewFrame.onload = () => {
          try {
            previewFrame.contentWindow.postMessage({
              type: 'update-settings',
              settings: { label, target, theme, animation }
            }, '*');
          } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres:', error);
          }
        };
      };

      // Si l'iframe est déjà chargée, mettre à jour immédiatement
      if (previewFrame.contentWindow) {
        updateIframe();
      } else {
        // Sinon, attendre le chargement
        previewFrame.addEventListener('load', updateIframe, { once: true });
      }
    }
  }

  // Gérer la mise à jour
  const updateBtn = document.getElementById('update-follower-goal');
  updateBtn.addEventListener('click', updateOverlay);

  // Gérer la copie de l'URL
  const copyBtn = document.getElementById('copy-follower-url');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const label = document.getElementById('follower-label').value;
      const target = document.getElementById('follower-target').value;
      const theme = document.getElementById('follower-theme').value;
      const animation = document.getElementById('follower-animation').value;
      const token = localStorage.getItem('twitch_token');

      if (!token) {
        alert('Veuillez vous connecter avec Twitch d\'abord');
        return;
      }

      const url = new URL(window.location.origin + '/src/overlays/followers-goal/overlay.html');
      url.searchParams.set('label', label);
      url.searchParams.set('target', target);
      url.searchParams.set('theme', theme);
      url.searchParams.set('animation', animation);
      url.searchParams.set('token', token);

      navigator.clipboard.writeText(url.toString())
        .then(() => alert('URL copiée avec succès !'))
        .catch(() => alert('Erreur lors de la copie de l\'URL'));
    });
  }

  // Mettre à jour en temps réel lors des changements
  const inputs = document.querySelectorAll('#follower-label, #follower-target, #follower-theme, #follower-animation');
  inputs.forEach(input => {
    input.addEventListener('change', updateOverlay);
  });

  // Faire la mise à jour initiale
  updateOverlay();
}