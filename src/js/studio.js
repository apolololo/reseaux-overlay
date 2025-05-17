// Importation des fonctions d'authentification
import { checkAuthAndRedirect, displayUserInfo } from './auth.js';

// Fonction d'initialisation du studio
document.addEventListener('DOMContentLoaded', () => {
    console.log("Studio.js chargé");

    const app = document.getElementById('app');
    const loadingScreen = document.querySelector('.loading-screen');
    const usernameSpan = document.querySelector('.username');
    const logoutBtn = document.querySelector('.logout-btn');

    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-section');

    // Vérifie l'authentification de l'utilisateur
    checkAuthAndRedirect().then(user => {
        if (user) {
            displayUserInfo(user);
            usernameSpan.textContent = user.username || "Utilisateur";

            // Une fois l'utilisateur authentifié, on affiche le studio
            loadingScreen.style.display = 'none';
            app.style.display = 'block';

            // Initialise les événements principaux
            initNavigation();
            initLogout();
        }
    }).catch(err => {
        console.error("Erreur d'authentification:", err);
        window.location.href = '/login.html';
    });

    function initNavigation() {
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Activer l'onglet sélectionné
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Afficher la vue sélectionnée
                const targetView = btn.dataset.view;
                views.forEach(view => {
                    if (view.id === `${targetView}-view`) {
                        view.classList.remove('hidden');
                        view.style.display = 'block';
                    } else {
                        view.classList.add('hidden');
                        view.style.display = 'none';
                    }
                });
            });
        });
    }

    function initLogout() {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        });
    }
});
