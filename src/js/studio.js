
// Importation des fonctions d'authentification partagées
import { checkAuthAndRedirect, displayUserInfo } from './auth.js';

// Gestion de l'authentification et du chargement initial
document.addEventListener('DOMContentLoaded', () => {
    console.log("Studio.js chargé");
    const app = document.getElementById('app');
    const loadingScreen = document.querySelector('.loading-screen');
    const username = document.querySelector('.username');

    // Initialisation du studio
    const initStudio = () => {
        console.log("Initialisation du studio");
        // Gestion de la navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        const views = document.querySelectorAll('.view-section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const viewName = btn.dataset.view;
                console.log("Navigation vers:", viewName);
                
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

        // Gestion du drag & drop des éléments
        const elements = document.querySelectorAll('.element-item');
        const canvas = document.getElementById('editor-canvas');

        // Gestion de la déconnexion
        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                console.log("Déconnexion utilisateur");
                localStorage.removeItem('twitch_token');
                localStorage.removeItem('twitch_expires_at');
                localStorage.removeItem('twitch_user');
                window.location.href = './auth.html';
            });
        }

        // Afficher l'interface du studio et cacher l'écran de chargement
        console.log("Affichage de l'interface du studio");
        loadingScreen.style.display = 'none';
        app.style.display = 'block';
        
        // Vérifier le hash pour déterminer la vue initiale
        const hash = window.location.hash.substring(1);
        console.log("Hash actuel:", hash);
        if (hash) {
            // Trouver le bouton correspondant au hash et simuler un clic
            const hashButton = document.querySelector(`.nav-btn[data-view="${hash}"]`);
            if (hashButton) {
                console.log("Navigation automatique vers:", hash);
                hashButton.click();
            }
        }
    };

    // Démarrer l'application avec un timeout de sécurité
    // Utiliser la fonction partagée pour vérifier l'authentification et rediriger si nécessaire
    if (checkAuthAndRedirect('./auth.html')) {
        console.log("Authentification réussie, initialisation du studio");
        // Afficher les informations utilisateur en utilisant la fonction partagée
        displayUserInfo('.username');
        initStudio();
        
        // S'assurer que l'interface est bien affichée même si un problème survient
        setTimeout(() => {
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                console.log("Fallback: affichage forcé de l'interface après délai");
                loadingScreen.style.display = 'none';
                app.style.display = 'block';
            }
        }, 1500);
    }
});
