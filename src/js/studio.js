
// Gestion de l'authentification et du chargement initial
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const loadingScreen = document.querySelector('.loading-screen');
    const username = document.querySelector('.username');

    // Vérification de l'authentification
    const checkAuth = () => {
        const token = localStorage.getItem('twitch_token');
        const expiresAt = localStorage.getItem('twitch_expires_at');
        const userData = localStorage.getItem('twitch_user');

        if (!token || !expiresAt || new Date().getTime() > parseInt(expiresAt)) {
            window.location.href = './auth.html';
            return false;
        }

        // Afficher les informations utilisateur
        if (userData) {
            try {
                const user = JSON.parse(userData);
                username.textContent = user.display_name || 'Utilisateur Twitch';
            } catch (e) {
                console.error("Erreur lors de l'affichage des infos utilisateur", e);
            }
        }

        return true;
    };

    // Initialisation du studio
    const initStudio = () => {
        // Gestion de la navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        const views = document.querySelectorAll('.view-section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const viewName = btn.dataset.view;
                
                // Mise à jour des boutons actifs
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Affichage de la vue correspondante
                views.forEach(view => {
                    if (view.id === `${viewName}-view`) {
                        view.classList.remove('hidden');
                        view.style.display = 'block';
                    } else {
                        view.classList.add('hidden');
                        view.style.display = 'none';
                    }
                });

                // Déclencher un événement pour informer les modules spécifiques
                const event = new CustomEvent('viewChanged', { detail: { view: viewName } });
                document.dispatchEvent(event);
            });
        });

        // Gestion du drag & drop des éléments (contourné car géré par editor.js)
        const elements = document.querySelectorAll('.element-item');
        const canvas = document.getElementById('editor-canvas');

        // Gestion de la déconnexion
        const logoutButton = document.querySelector('.logout-btn');
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('twitch_token');
            localStorage.removeItem('twitch_expires_at');
            localStorage.removeItem('twitch_user');
            window.location.href = './auth.html';
        });

        // Afficher l'interface du studio
        loadingScreen.style.display = 'none';
        app.style.display = 'block';
    };

    // Démarrer l'application
    if (checkAuth()) {
        initStudio();
    }
});
