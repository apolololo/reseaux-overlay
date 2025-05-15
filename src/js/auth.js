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

  // Ajouter l'indicateur de connexion
  const connectionStatus = document.createElement('div');
  connectionStatus.className = 'connection-status';
  connectionStatus.style.display = 'none';
  overlayList.insertBefore(connectionStatus, loginButton.nextSibling);

  // Vérifier si déjà connecté
  const token = localStorage.getItem('twitch_token');
  if (token) {
    loginButton.style.display = 'none';
    connectionStatus.style.display = 'block';
    connectionStatus.innerHTML = `
      <div class="status-connected">
        <span>✓ Connecté à Twitch</span>
        <button class="logout-btn">Déconnexion</button>
      </div>
    `;
    
    // Gérer la déconnexion
    connectionStatus.querySelector('.logout-btn').addEventListener('click', () => {
      localStorage.removeItem('twitch_token');
      localStorage.removeItem('twitch_user_id');
      window.location.reload();
    });
  }

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
          
          // Récupérer l'ID de l'utilisateur
          const userResponse = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
              'Client-Id': clientId
            }
          });
          
          const userData = await userResponse.json();
          if (userData.data && userData.data[0]) {
            localStorage.setItem('twitch_user_id', userData.data[0].id);
          }
          
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
      }
    }
  }
}