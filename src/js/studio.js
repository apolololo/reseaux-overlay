
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

        // Gestion du drag & drop des éléments
        const elements = document.querySelectorAll('.element-item');
        const canvas = document.getElementById('editor-canvas');

        if (elements && canvas) {
            elements.forEach(element => {
                element.addEventListener('dragstart', (e) => {
                    console.log('Dragstart event triggered', element.dataset.type);
                    e.dataTransfer.setData('text/plain', element.dataset.type);
                });
            });

            canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
                console.log('Dragover event triggered');
            });

            canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                console.log('Drop event triggered');
                const type = e.dataTransfer.getData('text/plain');
                console.log('Element type:', type);
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Création de l'élément
                createCanvasElement(type, x, y);
            });
        }

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
        console.log('Création d\'élément:', type, 'à', x, y);
        const element = document.createElement('div');
        element.className = `editor-element ${type}-element`;
        element.style.position = 'absolute';
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.minWidth = '100px';
        element.style.minHeight = '30px';
        element.style.cursor = 'move';
        element.dataset.type = type;

        switch (type) {
            case 'text':
                element.innerHTML = 'Double-cliquez pour éditer';
                element.contentEditable = true;
                break;
            case 'image':
                element.innerHTML = '<div class="placeholder">Cliquez pour ajouter une image</div>';
                element.style.width = '200px';
                element.style.height = '150px';
                element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                element.style.display = 'flex';
                element.style.justifyContent = 'center';
                element.style.alignItems = 'center';
                break;
            case 'shape':
                element.style.width = '100px';
                element.style.height = '100px';
                element.style.backgroundColor = '#ffffff';
                element.style.border = '2px solid #000000';
                break;
            case 'social':
                element.innerHTML = `
                    <div class="social-element">
                        <img src="../images/twitch.png" alt="Twitch" style="width: 24px; height: 24px; margin-right: 8px;">
                        <span>@votre_pseudo</span>
                    </div>
                `;
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.padding = '8px';
                element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                element.style.color = '#ffffff';
                break;
            case 'timer':
                element.innerHTML = '00:00';
                element.style.fontFamily = 'monospace';
                element.style.fontSize = '24px';
                element.style.padding = '8px';
                element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                element.style.color = '#ffffff';
                break;
            case 'creator-code':
                element.innerHTML = `
                    <div class="creator-code-element">
                        <span>CODE : APO21</span>
                        <span class="tag" style="background-color: red; padding: 2px 5px; margin-left: 5px; border-radius: 3px;">#AD</span>
                    </div>
                `;
                element.style.fontFamily = 'Arial, sans-serif';
                element.style.fontWeight = 'bold';
                element.style.padding = '8px';
                element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                element.style.color = '#ffffff';
                element.style.display = 'inline-block';
                break;
        }

        // Rendre l'élément déplaçable
        makeElementDraggable(element);

        // Ajouter l'élément au canvas
        canvas.appendChild(element);
        
        // Sélectionner l'élément nouvellement créé
        selectElement(element);
        
        console.log('Élément ajouté au canvas');
        return element;
    };

    // Rendre un élément déplaçable
    const makeElementDraggable = (element) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            if (e.target !== element && e.target.contentEditable === 'true') {
                return; // Permet l'édition du contenu sans déplacer
            }
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
            
            // Sélectionner l'élément au clic
            selectElement(element);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = `${element.offsetTop - pos2}px`;
            element.style.left = `${element.offsetLeft - pos1}px`;
            
            // Mettre à jour les valeurs des champs de position
            if (document.getElementById('position-x') && document.getElementById('position-y')) {
                document.getElementById('position-x').value = Math.round(element.offsetLeft);
                document.getElementById('position-y').value = Math.round(element.offsetTop);
            }
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }
    };

    // Sélection d'un élément
    const selectElement = (element) => {
        // Désélectionner tous les éléments
        const elements = document.querySelectorAll('.editor-element');
        elements.forEach(el => el.classList.remove('selected'));
        
        // Sélectionner l'élément actuel
        element.classList.add('selected');
        
        // Ajouter une bordure visible pour indiquer la sélection
        elements.forEach(el => {
            el.style.outline = 'none';
        });
        element.style.outline = '2px solid #0066ff';
        
        // Afficher les propriétés correspondantes
        showElementProperties(element);
    };

    // Afficher les propriétés d'un élément
    const showElementProperties = (element) => {
        const propertiesGroups = document.querySelectorAll('.properties-group');
        const noSelection = document.querySelector('.no-selection-message');

        propertiesGroups.forEach(group => group.style.display = 'none');
        if (noSelection) noSelection.style.display = 'none';

        if (element.classList.contains('text-element')) {
            const textProperties = document.querySelector('.text-properties');
            if (textProperties) textProperties.style.display = 'block';
            
            // Mettre à jour le contenu du texte
            const textContent = document.getElementById('text-content');
            if (textContent) textContent.value = element.innerText;
        } else if (element.classList.contains('image-element')) {
            const imageProperties = document.querySelector('.image-properties');
            if (imageProperties) imageProperties.style.display = 'block';
        }

        // Mettre à jour les propriétés communes
        const commonProperties = document.querySelector('.common-properties');
        if (commonProperties) {
            commonProperties.style.display = 'block';
            
            // Mettre à jour les valeurs des champs de position et taille
            if (document.getElementById('position-x')) {
                document.getElementById('position-x').value = Math.round(element.offsetLeft);
            }
            if (document.getElementById('position-y')) {
                document.getElementById('position-y').value = Math.round(element.offsetTop);
            }
            if (document.getElementById('element-width')) {
                document.getElementById('element-width').value = Math.round(element.offsetWidth);
            }
            if (document.getElementById('element-height')) {
                document.getElementById('element-height').value = Math.round(element.offsetHeight);
            }
        }
        
        // Ajouter des événements aux champs de propriétés
        setupPropertyEvents(element);
    };
    
    // Configurer les événements pour les champs de propriétés
    const setupPropertyEvents = (element) => {
        // Position X
        const posX = document.getElementById('position-x');
        if (posX) {
            posX.onchange = () => {
                element.style.left = `${posX.value}px`;
            };
        }
        
        // Position Y
        const posY = document.getElementById('position-y');
        if (posY) {
            posY.onchange = () => {
                element.style.top = `${posY.value}px`;
            };
        }
        
        // Largeur
        const width = document.getElementById('element-width');
        if (width) {
            width.onchange = () => {
                element.style.width = `${width.value}px`;
            };
        }
        
        // Hauteur
        const height = document.getElementById('element-height');
        if (height) {
            height.onchange = () => {
                element.style.height = `${height.value}px`;
            };
        }
        
        // Contentu du texte
        const textContent = document.getElementById('text-content');
        if (textContent && element.classList.contains('text-element')) {
            textContent.onchange = () => {
                element.innerText = textContent.value;
            };
        }
        
        // Suppression d'élément
        const deleteBtn = document.getElementById('delete-element');
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                element.remove();
                
                // Réinitialiser le panneau des propriétés
                const propertiesGroups = document.querySelectorAll('.properties-group');
                propertiesGroups.forEach(group => group.style.display = 'none');
                
                const noSelection = document.querySelector('.no-selection-message');
                if (noSelection) noSelection.style.display = 'block';
            };
        }
    };

    // Démarrer l'application
    if (checkAuth()) {
        initStudio();
        
        // Détecter les clics sur le canvas pour désélectionner les éléments
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                if (e.target === canvas) {
                    // Désélectionner tous les éléments
                    const elements = document.querySelectorAll('.editor-element');
                    elements.forEach(el => {
                        el.classList.remove('selected');
                        el.style.outline = 'none';
                    });
                    
                    // Afficher le message "aucune sélection"
                    const propertiesGroups = document.querySelectorAll('.properties-group');
                    propertiesGroups.forEach(group => group.style.display = 'none');
                    
                    const noSelection = document.querySelector('.no-selection-message');
                    if (noSelection) noSelection.style.display = 'block';
                }
            });
        }
    }
});
