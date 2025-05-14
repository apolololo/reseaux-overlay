import { createClient } from '@supabase/supabase-js';

export async function initTwitchAuth() {
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = window.location.origin + '/auth/callback';

  // Créer le bouton de connexion Twitch
  const loginButton = document.createElement('button');
  loginButton.className = 'twitch-login-btn';
  loginButton.innerHTML = `
    <img src="/src/images/twitch.png" alt="Twitch">
    <span>Se connecter avec Twitch</span>
  `;

  // Créer la section d'informations utilisateur
  const userInfoSection = document.createElement('div');
  userInfoSection.className = 'user-info-section';
  userInfoSection.style.display = 'none';

  // Ajouter les éléments en haut de la liste des overlays
  const overlayList = document.querySelector('.overlay-list');
  if (overlayList) {
    overlayList.insertBefore(userInfoSection, overlayList.firstChild);
    overlayList.insertBefore(loginButton, overlayList.firstChild);
  }

  // Vérifier si un token existe déjà
  const token = localStorage.getItem('twitch_token');
  if (token) {
    await fetchAndDisplayUserInfo(token);
  }

  // Gérer la connexion
  loginButton.addEventListener('click', () => {
    const scopes = ['channel:read:subscriptions', 'moderator:read:followers', 'user:read:email'];
    const scope = scopes.join(' ');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&force_verify=true`;
    window.location.href = authUrl;
  });

  // Vérifier si on est sur la page de callback
  if (window.location.pathname === '/auth/callback') {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const error_description = urlParams.get('error_description');

    if (error) {
      console.error('Erreur Twitch:', error, error_description);
      window.location.href = '/?auth_error=' + encodeURIComponent(error_description);
      return;
    }

    if (code) {
      try {
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );

        const { data, error } = await supabase.functions.invoke('twitch-auth', {
          body: JSON.stringify({ code, redirectUri })
        });

        if (error) throw error;

        if (data && data.access_token) {
          localStorage.setItem('twitch_token', data.access_token);
          await fetchAndDisplayUserInfo(data.access_token);
          window.location.href = '/';
        } else {
          throw new Error('Token non reçu');
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        localStorage.removeItem('twitch_token');
        window.location.href = '/?auth_error=' + encodeURIComponent(error.message);
      }
    } else {
      window.location.href = '/?auth_error=Code d\'autorisation manquant';
    }
  }

  // Gérer les erreurs d'authentification dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const authError = urlParams.get('auth_error');
  if (authError) {
    console.error('Erreur d\'authentification:', authError);
    localStorage.removeItem('twitch_token');
    userInfoSection.style.display = 'none';
    loginButton.style.display = 'flex';
    alert('Erreur de connexion: ' + authError);
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname);
  }
}

async function fetchAndDisplayUserInfo(token) {
  try {
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': import.meta.env.VITE_TWITCH_CLIENT_ID
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des informations utilisateur');
    }

    const data = await response.json();
    const user = data.data[0];

    if (user) {
      const userInfoSection = document.querySelector('.user-info-section');
      const loginButton = document.querySelector('.twitch-login-btn');

      userInfoSection.innerHTML = `
        <div class="user-info">
          <img src="${user.profile_image_url}" alt="Avatar" class="user-avatar">
          <div class="user-details">
            <div class="user-name">${user.display_name}</div>
            <div class="user-login">@${user.login}</div>
          </div>
          <button class="logout-btn">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>

        <!-- Options de personnalisation des followers -->
        <div class="follower-options">
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
            <button id="update-follower-goal" class="update-btn">Mettre à jour</button>
          </div>
        </div>
      `;

      userInfoSection.style.display = 'block';
      loginButton.style.display = 'none';

      // Gérer la mise à jour de l'overlay des followers
      document.getElementById('update-follower-goal').addEventListener('click', () => {
        const label = document.getElementById('follower-label').value;
        const target = document.getElementById('follower-target').value;
        const previewFrame = document.getElementById('overlay-preview');
        
        if (previewFrame && previewFrame.src.includes('followers-goal')) {
          const url = new URL(previewFrame.src);
          url.searchParams.set('label', label);
          url.searchParams.set('target', target);
          previewFrame.src = url.toString();
        }
      });

      // Gérer la déconnexion
      const logoutBtn = userInfoSection.querySelector('.logout-btn');
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('twitch_token');
        userInfoSection.style.display = 'none';
        loginButton.style.display = 'flex';
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    localStorage.removeItem('twitch_token');
    document.querySelector('.user-info-section').style.display = 'none';
    document.querySelector('.twitch-login-btn').style.display = 'flex';
  }
}