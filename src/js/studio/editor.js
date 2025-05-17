
/**
 * Module d'édition pour le Studio
 * Gère les fonctionnalités de l'éditeur visuel d'overlays
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Éditeur chargé');
  
  // Initialiser le canvas d'édition
  const initEditor = () => {
    const canvas = document.getElementById('editor-canvas');
    if (!canvas) return;
    
    // Configuration du canvas d'édition
    console.log('Canvas d\'édition initialisé');
    
    // Implémentation temporaire pour la génération de prévisualisations
    window.generatePreviewData = () => {
      // Cette fonction sera implémentée plus tard pour générer les données de prévisualisation
      return {
        elements: [],
        background: '#000000',
        size: { width: 1920, height: 1080 }
      };
    };
    
    window.generatePreviewHtml = (data) => {
      // Cette fonction sera implémentée plus tard pour générer le HTML de prévisualisation
      return `<!DOCTYPE html>
      <html>
      <head>
        <title>Prévisualisation</title>
        <style>
          body { margin: 0; padding: 0; background: ${data.background}; }
        </style>
      </head>
      <body>
        <h1 style="color: white; font-family: Arial; text-align: center; padding-top: 40vh;">
          Prévisualisation d'overlay
        </h1>
      </body>
      </html>`;
    };
    
    // Fonction temporaire pour sauvegarder un overlay
    window.generateOverlayData = () => {
      return {
        elements: [],
        background: '#000000',
        size: { width: 1920, height: 1080 }
      };
    };
    
    window.saveOverlay = async (data) => {
      console.log('Sauvegarde de l\'overlay', data);
      window.currentOverlayId = 'temp-' + Date.now();
      return { id: window.currentOverlayId };
    };
  };
  
  // Attendre que la vue de l'éditeur soit visible
  document.addEventListener('viewChanged', (event) => {
    if (event.detail.view === 'editor') {
      initEditor();
    }
  });
  
  // Initialiser l'éditeur si c'est la vue par défaut
  if (document.getElementById('editor-view') && !document.getElementById('editor-view').classList.contains('hidden')) {
    initEditor();
  }
});
