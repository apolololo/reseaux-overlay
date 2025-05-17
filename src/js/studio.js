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
                        view.style.display = 'block';
                    } else {
                        view.style.display = 'none';
                    }
                });
            });
        });

        // Gestion du drag & drop des éléments
        const elements = document.querySelectorAll('.element-item');
        const canvas = document.getElementById('editor-canvas');

        elements.forEach(element => {
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.dataset.type);
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Création de l'élément
            createCanvasElement(type, x, y);
        });

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

    // Création d'éléments sur le canvas
    const createCanvasElement = (type, x, y) => {
        const element = document.createElement('div');
        element.className = `canvas-element ${type}-element`;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        switch (type) {
            case 'text':
                element.innerHTML = 'Double-cliquez pour éditer';
                element.contentEditable = true;
                break;
            case 'image':
                element.innerHTML = '<div class="placeholder">Cliquez pour ajouter une image</div>';
                break;
            case 'shape':
                element.style.width = '100px';
                element.style.height = '100px';
                element.style.backgroundColor = '#ffffff';
                break;
            case 'social':
                element.innerHTML = `
                    <div class="social-element">
                        <img src="../images/twitch.png" alt="Twitch">
                        <span>@votre_pseudo</span>
                    </div>
                `;
                break;
            case 'timer':
                element.innerHTML = '00:00';
                break;
            case 'creator-code':
                element.innerHTML = `
                    <div class="creator-code-element">
                        <span>CODE : APO21</span>
                        <span class="tag">#AD</span>
                    </div>
                `;
                break;
        }

        // Rendre l'élément déplaçable
        makeElementDraggable(element);

        canvas.appendChild(element);
        selectElement(element);
    };

    // Rendre un élément déplaçable
    const makeElementDraggable = (element) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = `${element.offsetTop - pos2}px`;
            element.style.left = `${element.offsetLeft - pos1}px`;
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }
    };

    // Sélection d'un élément
    const selectElement = (element) => {
        const elements = document.querySelectorAll('.canvas-element');
        elements.forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');

        // Afficher les propriétés correspondantes
        showElementProperties(element);
    };

    // Afficher les propriétés d'un élément
    const showElementProperties = (element) => {
        const propertiesGroups = document.querySelectorAll('.properties-group');
        const noSelection = document.querySelector('.no-selection-message');

        propertiesGroups.forEach(group => group.style.display = 'none');
        noSelection.style.display = 'none';

        if (element.classList.contains('text-element')) {
            document.querySelector('.text-properties').style.display = 'block';
        } else if (element.classList.contains('image-element')) {
            document.querySelector('.image-properties').style.display = 'block';
        }

        document.querySelector('.common-properties').style.display = 'block';
    };

    // Démarrer l'application
    if (checkAuth()) {
        initStudio();
    }
});