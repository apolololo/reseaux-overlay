console.log('auth.js chargé');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded déclenché');
  
  const loginButton = document.getElementById('login-button');
  console.log('Bouton trouvé dans auth.js:', loginButton);
  
  const loading = document.getElementById('loading');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  
  // Vérifier si l'utilisateur est déjà connecté
  const checkAuthentication = () => {
    console.log('Vérification de l\'authentification');
    const token = localStorage.getItem('twitch_token');
    const expiresAt = localStorage.getItem('twitch_expires_at');
    
    if (token && expiresAt && new Date().getTime() < parseInt(expiresAt)) {
      console.log('Token valide trouvé, redirection vers index.html');
      window.location.href = '/index.html';
    }

    // Vérifier s'il y a une erreur dans les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
      console.log('Erreur trouvée dans l\'URL');
      errorContainer.style.display = 'block';
      errorMessage.textContent = `Erreur: ${urlParams.get('error')} - ${urlParams.get('error_description') || 'Veuillez réessayer'}`;
    }
  };
  
  // Vérifier l'authentification au chargement
  checkAuthentication();
  
  // Gérer le clic sur le bouton de connexion
  if (loginButton) {
    console.log('Ajout de l\'écouteur d\'événement sur le bouton');
    loginButton.addEventListener('click', () => {
      console.log('Bouton cliqué dans auth.js');
      try {
        // Afficher le chargement
        loading.classList.add('active');
        errorContainer.style.display = 'none';
        
        // ID client Twitch
        const clientId = "z8q1w4g12yrql6cyb5zzwmhe1pnxyn";
        
        // URL de redirection
        const redirectUri = "https://apo-overlay.netlify.app/auth/callback.html";
        
        // Générer un état aléatoire pour la sécurité
        const state = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('twitch_auth_state', state);
        
        // Construire l'URL d'authentification Twitch
        const scope = 'user:read:email channel:read:subscriptions moderator:read:followers';
        const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&force_verify=true`;
        
        console.log('Redirection vers:', authUrl);
        
        // Rediriger vers l'authentification Twitch
        window.location.href = authUrl;
      } catch (error) {
        console.error("Erreur lors de la redirection:", error);
        loading.classList.remove('active');
        errorContainer.style.display = 'block';
        errorMessage.textContent = "Une erreur s'est produite lors de la tentative de connexion. Veuillez réessayer.";
      }
    });
  } else {
    console.error('Le bouton de connexion n\'a pas été trouvé');
  }
}); 