
// Configuration de base pour l'overlay
const config = {
    title: "Mon Overlay",
    position: { x: 50, y: 50 },
    colors: {
        primary: "#667eea",
        secondary: "#764ba2",
        text: "#ffffff"
    }
};

// Fonction d'initialisation
function initOverlay() {
    console.log("Overlay initialisé avec succès");
    
    // Ajouter une animation d'entrée
    const overlayElement = document.querySelector('.overlay-element');
    if (overlayElement) {
        overlayElement.style.animation = 'fadeIn 1s ease-in';
    }
    
    // Exemple d'interaction
    setupInteractions();
}

// Configuration des interactions
function setupInteractions() {
    const titleElement = document.querySelector('.overlay-element h1');
    if (titleElement) {
        titleElement.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Fonction pour mettre à jour l'overlay
function updateOverlay(newData) {
    if (newData.title) {
        const titleElement = document.querySelector('.overlay-element h1');
        if (titleElement) {
            titleElement.textContent = newData.title;
        }
    }
}

// Fonction pour ajouter des éléments dynamiques
function addElement(type, content, className = '') {
    const element = document.createElement(type);
    element.textContent = content;
    if (className) {
        element.className = className;
    }
    
    const container = document.getElementById('overlay-container');
    if (container) {
        container.appendChild(element);
    }
    
    return element;
}

// Fonction pour créer un badge
function createBadge(text, position = { x: 100, y: 100 }) {
    const badge = addElement('div', text, 'overlay-badge');
    badge.style.position = 'absolute';
    badge.style.left = position.x + 'px';
    badge.style.top = position.y + 'px';
    return badge;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', initOverlay);

// Export pour utilisation dans l'éditeur
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        config,
        initOverlay,
        updateOverlay,
        addElement,
        createBadge
    };
}
