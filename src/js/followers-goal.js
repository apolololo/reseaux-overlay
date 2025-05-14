// Gestion du widget Followers Goal
export function initFollowersGoal(token) {
  // Initialiser les contrôles
  const updateBtn = document.getElementById('update-follower-goal');
  const copyBtn = document.getElementById('copy-follower-url');
  const previewFrame = document.getElementById('overlay-preview');

  if (!updateBtn || !copyBtn || !previewFrame) {
    console.error('Éléments de contrôle non trouvés');
    return;
  }

  // Charger les valeurs sauvegardées
  const savedSettings = localStorage.getItem('follower-goal-settings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    document.getElementById('follower-label').value = settings.label || 'Objectif Followers';
    document.getElementById('follower-target').value = settings.target || 500;
    document.getElementById('follower-theme').value = settings.theme || 'default';
    document.getElementById('follower-animation').value = settings.animation || 'slide';
    
    // Mettre à jour l'aperçu avec les paramètres sauvegardés
    updatePreview();
  }

  // Fonction de mise à jour de l'aperçu
  function updatePreview() {
    const label = document.getElementById('follower-label').value;
    const target = document.getElementById('follower-target').value;
    const theme = document.getElementById('follower-theme').value;
    const animation = document.getElementById('follower-animation').value;

    // Sauvegarder les paramètres
    localStorage.setItem('follower-goal-settings', JSON.stringify({
      label, target, theme, animation
    }));

    // Mettre à jour l'URL de l'iframe
    const url = new URL(previewFrame.src);
    url.searchParams.set('label', label);
    url.searchParams.set('target', target);
    url.searchParams.set('theme', theme);
    url.searchParams.set('animation', animation);
    url.searchParams.set('token', token);
    previewFrame.src = url.toString();
  }

  // Gérer la mise à jour
  updateBtn.addEventListener('click', updatePreview);

  // Gérer la copie de l'URL
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

  // Mettre à jour en temps réel lors des changements
  const inputs = document.querySelectorAll('#follower-label, #follower-target, #follower-theme, #follower-animation');
  inputs.forEach(input => {
    input.addEventListener('change', updatePreview);
  });
}