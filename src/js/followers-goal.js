// Gestion du widget Followers Goal
export function initFollowersGoal(token) {
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

  // Gérer la mise à jour et la génération d'URL
  const updateBtn = document.getElementById('update-follower-goal');
  const copyBtn = document.getElementById('copy-follower-url');

  updateBtn.addEventListener('click', () => {
    const label = document.getElementById('follower-label').value;
    const target = document.getElementById('follower-target').value;
    const theme = document.getElementById('follower-theme').value;
    const animation = document.getElementById('follower-animation').value;

    const previewFrame = document.getElementById('overlay-preview');
    if (previewFrame && previewFrame.src.includes('followers-goal')) {
      const url = new URL(previewFrame.src);
      url.searchParams.set('label', label);
      url.searchParams.set('target', target);
      url.searchParams.set('theme', theme);
      url.searchParams.set('animation', animation);
      url.searchParams.set('token', token);
      previewFrame.src = url.toString();
    }
  });

  copyBtn.addEventListener('click', () => {
    const label = document.getElementById('follower-label').value;
    const target = document.getElementById('follower-target').value;
    const theme = document.getElementById('follower-theme').value;
    const animation = document.getElementById('follower-animation').value;

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