export async function initTwitchAuth() {
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = 'https://apo-overlay.netlify.app/auth/callback';

  // Créer le bouton de connexion Twitch
  const loginButton = document.createElement('button');
  loginButton.className = 'twitch-login-btn';
  loginButton.innerHTML = `
    <img src="/src/images/twitch.png" alt="Twitch">
    <span>Se connecter avec Twitch</span>
  `;

  // Ajouter le bouton en haut de la liste des overlays
  const overlayList = document.querySelector('.overlay-list');
  overlayList.insertBefore(loginButton, overlayList.firstChild);

  // Gérer la connexion
  loginButton.addEventListener('click', () => {
    const scope = 'user:read:follows channel:read:subscriptions';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  });

  // Vérifier si on est sur la page de callback
  if (window.location.pathname === '/auth/callback') {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try {
        const response = await fetch('/api/auth/twitch', {
          method: 'POST',
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('twitch_token', data.access_token);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
      }
    }
  }
}