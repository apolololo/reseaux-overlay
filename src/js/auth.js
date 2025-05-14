export async function initTwitchAuth() {
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;

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
    const scopes = ['channel:read:subscriptions', 'moderator:read:followers', 'user:read:email'];
    const scope = scopes.join(' ');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  });

  // Vérifier si on est sur la page de callback
  if (window.location.pathname === '/auth/callback') {
    const code = new URLSearchParams(window.location.search).get('code');
    const error = new URLSearchParams(window.location.search).get('error');
    const error_description = new URLSearchParams(window.location.search).get('error_description');

    if (error) {
      console.error('Erreur Twitch:', error, error_description);
      window.location.href = '/?auth_error=' + encodeURIComponent(error_description);
      return;
    }

    if (code) {
      try {
        const response = await fetch('/api/auth/twitch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code }),
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('twitch_token', data.access_token);
          window.location.href = '/';
        } else {
          throw new Error('Token non reçu');
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        window.location.href = '/?auth_error=' + encodeURIComponent(error.message);
      }
    } else {
      window.location.href = '/?auth_error=Code d\'autorisation manquant';
    }
  }
}