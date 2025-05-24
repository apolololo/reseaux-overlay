// Configuration de base pour l'overlay
const config = {
    // Ajoutez vos variables de configuration ici
    title: "Mon Overlay",
    position: { x: 20, y: 20 }
};

// Fonction d'initialisation
function initOverlay() {
    // Code d'initialisation ici
    console.log("Overlay initialisé");
}

// Fonction pour mettre à jour l'overlay
function updateOverlay() {
    // Code de mise à jour ici
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', initOverlay);

// Exemple de fonction pour ajouter des éléments dynamiques
function addElement(type, content) {
    const element = document.createElement(type);
    element.textContent = content;
    document.getElementById('overlay-container').appendChild(element);
} 