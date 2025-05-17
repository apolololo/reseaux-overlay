
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
    
    // Fonction pour générer les données de prévisualisation
    window.generatePreviewData = () => {
      const canvas = document.getElementById('editor-canvas');
      if (!canvas) {
        return {
          elements: [],
          background: '#000000',
          size: { width: 1920, height: 1080 }
        };
      }
      
      // Récupérer les éléments du canvas
      const elements = [];
      const canvasElements = canvas.querySelectorAll('.editor-element');
      
      canvasElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        elements.push({
          type: element.dataset.type,
          content: element.innerHTML,
          style: {
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height,
            backgroundColor: element.style.backgroundColor,
            color: element.style.color,
            fontFamily: element.style.fontFamily,
            fontSize: element.style.fontSize,
            fontWeight: element.style.fontWeight,
            padding: element.style.padding,
            border: element.style.border,
            borderRadius: element.style.borderRadius,
            boxShadow: element.style.boxShadow,
            opacity: element.style.opacity,
            transform: element.style.transform
          }
        });
      });
      
      // Récupérer la taille du canvas
      const canvasPreset = document.getElementById('canvas-preset');
      const presetValue = canvasPreset ? canvasPreset.value : '1920x1080';
      
      let width = 1920;
      let height = 1080;
      
      if (presetValue !== 'custom') {
        const [w, h] = presetValue.split('x');
        width = parseInt(w);
        height = parseInt(h);
      } else {
        const canvasWidth = document.getElementById('canvas-width');
        const canvasHeight = document.getElementById('canvas-height');
        width = canvasWidth ? parseInt(canvasWidth.value) : 1920;
        height = canvasHeight ? parseInt(canvasHeight.value) : 1080;
      }
      
      return {
        elements: elements,
        background: '#000000', // Pour l'instant, fond noir fixe
        size: { width, height }
      };
    };
    
    // Fonction pour générer le HTML de prévisualisation
    window.generatePreviewHtml = (data) => {
      let elementsHtml = '';
      
      data.elements.forEach(element => {
        const style = Object.entries(element.style)
          .filter(([key, value]) => value) // Ne garder que les propriétés avec une valeur
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
        
        elementsHtml += `
          <div class="preview-element ${element.type}-element" style="${style}">
            ${element.content}
          </div>
        `;
      });
      
      return `<!DOCTYPE html>
      <html>
      <head>
        <title>Prévisualisation</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background: ${data.background}; 
            width: ${data.size.width}px; 
            height: ${data.size.height}px; 
            overflow: hidden;
            font-family: Arial, sans-serif;
          }
          .preview-element {
            position: absolute;
          }
        </style>
      </head>
      <body>
        ${elementsHtml || '<h1 style="color: white; font-family: Arial; text-align: center; padding-top: 40vh;">Prévisualisation d\'overlay</h1>'}
      </body>
      </html>`;
    };
    
    // Fonction pour générer les données complètes de l'overlay
    window.generateOverlayData = () => {
      const previewData = window.generatePreviewData();
      
      // Ajouter une propriété id si l'overlay est déjà sauvegardé
      if (window.currentOverlayId) {
        previewData.id = window.currentOverlayId;
      } else {
        previewData.id = 'overlay-' + Date.now();
      }
      
      return previewData;
    };
    
    // Fonction pour sauvegarder un overlay
    window.saveOverlay = async (data) => {
      console.log('Sauvegarde de l\'overlay', data);
      
      // Récupérer les overlays déjà sauvegardés
      const savedOverlays = JSON.parse(localStorage.getItem('saved_overlays') || '[]');
      
      // Vérifier si l'overlay existe déjà
      const existingIndex = savedOverlays.findIndex(o => o.id === data.id);
      
      if (existingIndex >= 0) {
        // Mettre à jour l'overlay existant
        savedOverlays[existingIndex] = data;
      } else {
        // Ajouter le nouvel overlay
        savedOverlays.push(data);
      }
      
      // Enregistrer les modifications
      localStorage.setItem('saved_overlays', JSON.stringify(savedOverlays));
      
      // Retourner l'ID de l'overlay
      window.currentOverlayId = data.id;
      return { id: data.id };
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
