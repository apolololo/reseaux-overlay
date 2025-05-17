/**
 * Script de l'éditeur d'overlays
 * Gère la création et la modification des overlays
 */

document.addEventListener('DOMContentLoaded', () => {
  // Éléments du DOM
  const canvas = document.getElementById('editor-canvas');
  const canvasContainer = document.querySelector('.canvas-container');
  const canvasPreset = document.getElementById('canvas-preset');
  const canvasWidth = document.getElementById('canvas-width');
  const canvasHeight = document.getElementById('canvas-height');
  const customSizeContainer = document.querySelector('.custom-size');
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');
  const clearCanvasBtn = document.getElementById('clear-canvas');
  
  // Variables globales
  let currentScale = 1;
  let selectedElement = null;
  let elements = [];
  let history = [];
  let historyIndex = -1;
  window.currentOverlayId = null;
  
  // Initialisation du canvas
  const initCanvas = () => {
    // Définir la taille du canvas
    updateCanvasSize();
    
    // Ajouter les gestionnaires d'événements
    canvas.addEventListener('click', handleCanvasClick);
    
    // Gérer le zoom du canvas
    canvasContainer.addEventListener('wheel', handleCanvasZoom);
    
    // Initialiser l'historique
    saveToHistory();
  };
  
  // Mise à jour de la taille du canvas
  const updateCanvasSize = () => {
    const preset = canvasPreset.value;
    
    if (preset === 'custom') {
      customSizeContainer.style.display = 'flex';
      canvas.style.width = `${canvasWidth.value}px`;
      canvas.style.height = `${canvasHeight.value}px`;
    } else {
      customSizeContainer.style.display = 'none';
      const [width, height] = preset.split('x');
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvasWidth.value = width;
      canvasHeight.value = height;
    }
    
    // Ajuster l'échelle pour que le canvas soit visible en entier
    adjustCanvasScale();
  };
  
  // Ajuster l'échelle du canvas
  const adjustCanvasScale = () => {
    const containerWidth = canvasContainer.clientWidth - 40; // Marge
    const containerHeight = canvasContainer.clientHeight - 40; // Marge
    const canvasWidth = parseInt(canvas.style.width);
    const canvasHeight = parseInt(canvas.style.height);
    
    // Calculer l'échelle pour que le canvas tienne dans le conteneur
    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    currentScale = Math.min(scaleX, scaleY, 1); // Ne pas agrandir au-delà de 100%
    
    // Appliquer l'échelle
    canvas.style.transform = `scale(${currentScale})`;
    
    // Ajuster la taille du conteneur de fond
    const background = document.querySelector('.canvas-background');
    background.style.width = `${canvasWidth * currentScale}px`;
    background.style.height = `${canvasHeight * currentScale}px`;
  };
  
  // Gérer le zoom du canvas
  const handleCanvasZoom = (e) => {
    e.preventDefault();
    
    // Ajuster l'échelle en fonction de la direction du défilement
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.1, Math.min(2, currentScale + delta));
    
    // Appliquer la nouvelle échelle
    currentScale = newScale;
    canvas.style.transform = `scale(${currentScale})`;
    
    // Ajuster la taille du conteneur de fond
    const background = document.querySelector('.canvas-background');
    background.style.width = `${parseInt(canvas.style.width) * currentScale}px`;
    background.style.height = `${parseInt(canvas.style.height) * currentScale}px`;
  };
  
  // Gérer le clic sur le canvas
  const handleCanvasClick = (e) => {
    // Désélectionner l'élément actuel
    if (selectedElement) {
      selectedElement.classList.remove('selected');
      hideAllPropertyPanels();
    }
    
    // Si on a cliqué sur un élément, le sélectionner
    if (e.target !== canvas) {
      const element = e.target.closest('.canvas-element');
      if (element) {
        selectedElement = element;
        element.classList.add('selected');
        showPropertyPanel(element.dataset.type);
        updatePropertyValues(element);
      } else {
        selectedElement = null;
        showNoSelectionMessage();
      }
    } else {
      selectedElement = null;
      showNoSelectionMessage();
    }
  };
  
  // Ajouter un élément au canvas
  const addElement = (type, properties = {}) => {
    // Créer l'élément
    const element = document.createElement('div');
    element.className = `canvas-element ${type}-element`;
    element.dataset.type = type;
    element.dataset.id = `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Positionner l'élément au centre du canvas
    const canvasRect = canvas.getBoundingClientRect();
    const elementWidth = properties.width || 200;
    const elementHeight = properties.height || 100;
    
    const left = properties.left || (parseInt(canvas.style.width) / 2 - elementWidth / 2);
    const top = properties.top || (parseInt(canvas.style.height) / 2 - elementHeight / 2);
    
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.width = `${elementWidth}px`;
    element.style.height = `${elementHeight}px`;
    
    // Ajouter le contenu en fonction du type
    switch (type) {
      case 'text':
        element.innerHTML = properties.text || 'Texte';
        element.style.color = properties.color || '#ffffff';
        element.style.fontFamily = properties.fontFamily || 'Montserrat';
        element.style.fontSize = properties.fontSize || '16px';
        element.style.fontWeight = properties.fontWeight || 'normal';
        element.style.fontStyle = properties.fontStyle || 'normal';
        element.style.textAlign = properties.textAlign || 'center';
        break;
        
      case 'image':
        const img = document.createElement('img');
        img.src = properties.src || 'https://via.placeholder.com/200x100';
        img.alt = properties.alt || 'Image';
        img.style.borderRadius = properties.borderRadius || '0';
        img.style.opacity = properties.opacity || '1';
        img.style.border = properties.border || 'none';
        element.appendChild(img);
        break;
        
      case 'shape':
        element.style.backgroundColor = properties.backgroundColor || 'rgba(255, 255, 255, 0.2)';
        element.style.borderRadius = properties.borderRadius || '4px';
        element.style.border = properties.border || 'none';
        break;
        
      case 'social':
        element.innerHTML = `
          <img src="${properties.icon || 'https://via.placeholder.com/24'}" alt="Social">
          <span>${properties.username || '@username'}</span>
        `;
        element.style.color = properties.color || '#ffffff';
        element.style.fontFamily = properties.fontFamily || 'Montserrat';
        element.style.fontSize = properties.fontSize || '16px';
        break;
        
      case 'timer':
        element.innerHTML = properties.time || '00:00';
        element.style.color = properties.color || '#ffffff';
        element.style.fontFamily = properties.fontFamily || 'Montserrat';
        element.style.fontSize = properties.fontSize || '32px';
        element.style.fontWeight = properties.fontWeight || 'bold';
        break;
        
      case 'creator-code':
        element.innerHTML = `
          <span class="creator-label">CODE CRÉATEUR</span>
          <span class="creator-code">${properties.code || 'CODE'}</span>
          <span class="ad-tag">#AD</span>
        `;
        element.style.color = properties.color || '#ffffff';
        element.style.fontFamily = properties.fontFamily || 'Montserrat';
        element.style.fontSize = properties.fontSize || '14px';
        break;
    }
    
    // Ajouter les gestionnaires d'événements pour le déplacement
    makeElementDraggable(element);
    
    // Ajouter l'élément au canvas
    canvas.appendChild(element);
    
    // Ajouter l'élément à la liste
    elements.push({
      id: element.dataset.id,
      type,
      properties: { ...properties, left, top, width: elementWidth, height: elementHeight }
    });
    
    // Sauvegarder l'état dans l'historique
    saveToHistory();
    
    // Sélectionner l'élément
    handleCanvasClick({ target: element });
    
    return element;
  };
  
  // Rendre un élément déplaçable
  const makeElementDraggable = (element) => {
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;
    
    element.addEventListener('mousedown', (e) => {
      // Sélectionner l'élément
      handleCanvasClick({ target: element });
      
      // Commencer le déplacement
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(element.style.left);
      startTop = parseInt(element.style.top);
      
      // Empêcher la sélection de texte pendant le déplacement
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Calculer le déplacement
      const dx = (e.clientX - startX) / currentScale;
      const dy = (e.clientY - startY) / currentScale;
      
      // Appliquer le déplacement
      element.style.left = `${startLeft + dx}px`;
      element.style.top = `${startTop + dy}px`;
      
      // Mettre à jour les valeurs dans le panneau de propriétés
      if (selectedElement === element) {
        document.getElementById('position-x').value = Math.round(startLeft + dx);
        document.getElementById('position-y').value = Math.round(startTop + dy);
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      
      // Terminer le déplacement
      isDragging = false;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === element.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.left = parseInt(element.style.left);
        elements[elementIndex].properties.top = parseInt(element.style.top);
      }
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
    });
  };
  
  // Afficher le panneau de propriétés correspondant au type d'élément
  const showPropertyPanel = (type) => {
    // Masquer tous les panneaux
    hideAllPropertyPanels();
    
    // Afficher le panneau correspondant
    const panel = document.querySelector(`.${type}-properties`);
    if (panel) {
      panel.style.display = 'block';
    }
    
    // Afficher les propriétés communes
    const commonPanel = document.querySelector('.common-properties');
    if (commonPanel) {
      commonPanel.style.display = 'block';
    }
  };
  
  // Masquer tous les panneaux de propriétés
  const hideAllPropertyPanels = () => {
    const panels = document.querySelectorAll('.properties-group');
    panels.forEach(panel => {
      panel.style.display = 'none';
    });
  };
  
  // Afficher le message "Aucune sélection"
  const showNoSelectionMessage = () => {
    hideAllPropertyPanels();
    document.querySelector('.no-selection-message').style.display = 'block';
  };
  
  // Mettre à jour les valeurs dans le panneau de propriétés
  const updatePropertyValues = (element) => {
    // Propriétés communes
    document.getElementById('position-x').value = parseInt(element.style.left);
    document.getElementById('position-y').value = parseInt(element.style.top);
    document.getElementById('element-width').value = parseInt(element.style.width);
    document.getElementById('element-height').value = parseInt(element.style.height);
    document.getElementById('element-rotation').value = getRotationDegrees(element);
    document.querySelector('#element-rotation + .range-value').textContent = `${getRotationDegrees(element)}°`;
    
    // Propriétés spécifiques
    const type = element.dataset.type;
    
    switch (type) {
      case 'text':
        document.getElementById('text-content').value = element.textContent;
        document.getElementById('font-family').value = element.style.fontFamily.replace(/['"]/g, '') || 'Montserrat';
        document.getElementById('font-size').value = parseInt(element.style.fontSize) || 16;
        document.querySelector('#font-size + .range-value').textContent = `${parseInt(element.style.fontSize) || 16}px`;
        document.getElementById('text-color').value = rgbToHex(element.style.color) || '#ffffff';
        document.getElementById('text-bold').classList.toggle('active', element.style.fontWeight === 'bold');
        document.getElementById('text-italic').classList.toggle('active', element.style.fontStyle === 'italic');
        document.getElementById('text-align-left').classList.toggle('active', element.style.textAlign === 'left');
        document.getElementById('text-align-center').classList.toggle('active', element.style.textAlign === 'center');
        document.getElementById('text-align-right').classList.toggle('active', element.style.textAlign === 'right');
        break;
        
      case 'image':
        const img = element.querySelector('img');
        if (img) {
          document.getElementById('image-opacity').value = parseFloat(img.style.opacity) * 100 || 100;
          document.querySelector('#image-opacity + .range-value').textContent = `${Math.round(parseFloat(img.style.opacity) * 100 || 100)}%`;
          document.getElementById('image-radius').value = parseInt(img.style.borderRadius) || 0;
          document.querySelector('#image-radius + .range-value').textContent = `${parseInt(img.style.borderRadius) || 0}px`;
          
          const borderWidth = img.style.borderWidth ? parseInt(img.style.borderWidth) : 0;
          document.getElementById('image-border').value = borderWidth;
          document.querySelector('#image-border + .range-value').textContent = `${borderWidth}px`;
          
          const borderColor = img.style.borderColor ? rgbToHex(img.style.borderColor) : '#ffffff';
          document.getElementById('border-color').value = borderColor;
        }
        break;
    }
  };
  
  // Obtenir l'angle de rotation d'un élément
  const getRotationDegrees = (element) => {
    const transform = element.style.transform;
    if (!transform || transform === 'none') return 0;
    
    const match = transform.match(/rotate\(([0-9.]+)deg\)/);
    return match ? parseInt(match[1]) : 0;
  };
  
  // Convertir une couleur RGB en hexadécimal
  const rgbToHex = (rgb) => {
    if (!rgb || rgb === '') return '#ffffff';
    
    // Si c'est déjà un code hexadécimal
    if (rgb.startsWith('#')) return rgb;
    
    // Extraire les valeurs RGB
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return '#ffffff';
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  // Sauvegarder l'état actuel dans l'historique
  const saveToHistory = () => {
    // Supprimer les états futurs si on a fait des modifications après un undo
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }
    
    // Ajouter l'état actuel à l'historique
    history.push(JSON.parse(JSON.stringify(elements)));
    historyIndex = history.length - 1;
    
    // Mettre à jour les boutons d'annulation/rétablissement
    updateUndoRedoButtons();
  };
  
  // Annuler la dernière action
  const undo = () => {
    if (historyIndex <= 0) return;
    
    historyIndex--;
    loadFromHistory();
    updateUndoRedoButtons();
  };
  
  // Rétablir la dernière action annulée
  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    
    historyIndex++;
    loadFromHistory();
    updateUndoRedoButtons();
  };
  
  // Charger un état depuis l'historique
  const loadFromHistory = () => {
    // Vider le canvas
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
    
    // Réinitialiser la liste des éléments
    elements = JSON.parse(JSON.stringify(history[historyIndex]));
    
    // Recréer les éléments
    elements.forEach(element => {
      const { id, type, properties } = element;
      
      const domElement = document.createElement('div');
      domElement.className = `canvas-element ${type}-element`;
      domElement.dataset.type = type;
      domElement.dataset.id = id;
      
      domElement.style.left = `${properties.left}px`;
      domElement.style.top = `${properties.top}px`;
      domElement.style.width = `${properties.width}px`;
      domElement.style.height = `${properties.height}px`;
      
      // Ajouter le contenu en fonction du type
      switch (type) {
        case 'text':
          domElement.innerHTML = properties.text || 'Texte';
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '16px';
          domElement.style.fontWeight = properties.fontWeight || 'normal';
          domElement.style.fontStyle = properties.fontStyle || 'normal';
          domElement.style.textAlign = properties.textAlign || 'center';
          break;
          
        case 'image':
          const img = document.createElement('img');
          img.src = properties.src || 'https://via.placeholder.com/200x100';
          img.alt = properties.alt || 'Image';
          img.style.borderRadius = properties.borderRadius || '0';
          img.style.opacity = properties.opacity || '1';
          img.style.border = properties.border || 'none';
          domElement.appendChild(img);
          break;
          
        case 'shape':
          domElement.style.backgroundColor = properties.backgroundColor || 'rgba(255, 255, 255, 0.2)';
          domElement.style.borderRadius = properties.borderRadius || '4px';
          domElement.style.border = properties.border || 'none';
          break;
          
        case 'social':
          domElement.innerHTML = `
            <img src="${properties.icon || 'https://via.placeholder.com/24'}" alt="Social">
            <span>${properties.username || '@username'}</span>
          `;
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '16px';
          break;
          
        case 'timer':
          domElement.innerHTML = properties.time || '00:00';
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '32px';
          domElement.style.fontWeight = properties.fontWeight || 'bold';
          break;
          
        case 'creator-code':
          domElement.innerHTML = `
            <span class="creator-label">CODE CRÉATEUR</span>
            <span class="creator-code">${properties.code || 'CODE'}</span>
            <span class="ad-tag">#AD</span>
          `;
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '14px';
          break;
      }
      
      // Ajouter les gestionnaires d'événements pour le déplacement
      makeElementDraggable(domElement);
      
      // Ajouter l'élément au canvas
      canvas.appendChild(domElement);
    });
    
    // Désélectionner l'élément actuel
    selectedElement = null;
    showNoSelectionMessage();
  };
  
  // Mettre à jour les boutons d'annulation/rétablissement
  const updateUndoRedoButtons = () => {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
  };
  
  // Effacer le canvas
  const clearCanvas = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer tous les éléments ?')) {
      // Vider le canvas
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
      
      // Réinitialiser la liste des éléments
      elements = [];
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
      
      // Désélectionner l'élément actuel
      selectedElement = null;
      showNoSelectionMessage();
    }
  };
  
  // Générer les données de l'overlay pour la sauvegarde
  window.generateOverlayData = () => {
    return {
      id: window.currentOverlayId,
      name: document.getElementById('overlay-name').value,
      elements,
      canvas: {
        width: parseInt(canvas.style.width),
        height: parseInt(canvas.style.height)
      }
    };
  };
  
  // Générer les données pour la prévisualisation
  window.generatePreviewData = () => {
    return {
      elements,
      canvas: {
        width: parseInt(canvas.style.width),
        height: parseInt(canvas.style.height)
      }
    };
  };
  
  // Générer le HTML pour la prévisualisation
  window.generatePreviewHtml = (data) => {
    const { elements, canvas } = data;
    
    // Créer le HTML de base
    let html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prévisualisation</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: transparent;
          }
          
          .overlay-container {
            position: relative;
            width: ${canvas.width}px;
            height: ${canvas.height}px;
          }
          
          .element {
            position: absolute;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div class="overlay-container">
    `;
    
    // Ajouter les éléments
    elements.forEach(element => {
      const { id, type, properties } = element;
      
      html += `<div class="element ${type}-element" style="left: ${properties.left}px; top: ${properties.top}px; width: ${properties.width}px; height: ${properties.height}px;`;
      
      // Ajouter les styles spécifiques
      switch (type) {
        case 'text':
          html += `color: ${properties.color || '#ffffff'}; font-family: ${properties.fontFamily || 'Montserrat'}; font-size: ${properties.fontSize || '16px'}; font-weight: ${properties.fontWeight || 'normal'}; font-style: ${properties.fontStyle || 'normal'}; text-align: ${properties.textAlign || 'center'};`;
          html += `">${properties.text || 'Texte'}</div>`;
          break;
          
        case 'image':
          html += `">\n<img src="${properties.src || 'https://via.placeholder.com/200x100'}" alt="${properties.alt || 'Image'}" style="width: 100%; height: 100%; object-fit: contain; border-radius: ${properties.borderRadius || '0'}; opacity: ${properties.opacity || '1'}; border: ${properties.border || 'none'};">\n</div>`;
          break;
          
        case 'shape':
          html += `background-color: ${properties.backgroundColor || 'rgba(255, 255, 255, 0.2)'}; border-radius: ${properties.borderRadius || '4px'}; border: ${properties.border || 'none'};"></div>`;
          break;
          
        case 'social':
          html += `color: ${properties.color || '#ffffff'}; font-family: ${properties.fontFamily || 'Montserrat'}; font-size: ${properties.fontSize || '16px'};">\n<img src="${properties.icon || 'https://via.placeholder.com/24'}" alt="Social" style="width: 24px; height: 24px;">\n<span>${properties.username || '@username'}</span>\n</div>`;
          break;
          
        case 'timer':
          html += `color: ${properties.color || '#ffffff'}; font-family: ${properties.fontFamily || 'Montserrat'}; font-size: ${properties.fontSize || '32px'}; font-weight: ${properties.fontWeight || 'bold'}; display: flex; justify-content: center; align-items: center;">${properties.time || '00:00'}</div>`;
          break;
          
        case 'creator-code':
          html += `color: ${properties.color || '#ffffff'}; font-family: ${properties.fontFamily || 'Montserrat'}; font-size: ${properties.fontSize || '14px'}; display: flex; align-items: center; gap: 10px; background-color: rgba(0, 0, 0, 0.5); padding: 8px 15px; border-radius: 4px;">\n<span class="creator-label">CODE CRÉATEUR</span>\n<span class="creator-code">${properties.code || 'CODE'}</span>\n<span class="ad-tag">#AD</span>\n</div>`;
          break;
      }
    });
    
    // Fermer le HTML
    html += `
        </div>
      </body>
      </html>
    `;
    
    return html;
  };
  
  // Sauvegarder l'overlay
  window.saveOverlay = async (overlayData) => {
    // Simuler une sauvegarde (à remplacer par un appel API réel)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Générer un ID si c'est un nouvel overlay
        if (!overlayData.id) {
          overlayData.id = `overlay-${Date.now()}`;
          window.currentOverlayId = overlayData.id;
        }
        
        // Sauvegarder dans le localStorage
        const userOverlays = JSON.parse(localStorage.getItem('user_overlays') || '[]');
        const existingIndex = userOverlays.findIndex(o => o.id === overlayData.id);
        
        if (existingIndex !== -1) {
          // Mettre à jour l'overlay existant
          userOverlays[existingIndex] = overlayData;
        } else {
          // Ajouter le nouvel overlay
          userOverlays.push(overlayData);
        }
        
        localStorage.setItem('user_overlays', JSON.stringify(userOverlays));
        
        resolve(overlayData);
      }, 500);
    });
  };
  
  // Charger un overlay
  window.loadOverlay = (overlayData) => {
    // Vider le canvas
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
    
    // Mettre à jour l'ID de l'overlay actuel
    window.currentOverlayId = overlayData.id;
    
    // Mettre à jour le nom de l'overlay
    document.getElementById('overlay-name').value = overlayData.name;
    
    // Mettre à jour la taille du canvas
    canvas.style.width = `${overlayData.canvas.width}px`;
    canvas.style.height = `${overlayData.canvas.height}px`;
    
    // Mettre à jour le preset de taille
    const preset = `${overlayData.canvas.width}x${overlayData.canvas.height}`;
    if (canvasPreset.querySelector(`option[value="${preset}"]`)) {
      canvasPreset.value = preset;
      customSizeContainer.style.display = 'none';
    } else {
      canvasPreset.value = 'custom';
      customSizeContainer.style.display = 'flex';
      canvasWidth.value = overlayData.canvas.width;
      canvasHeight.value = overlayData.canvas.height;
    }
    
    // Ajuster l'échelle du canvas
    adjustCanvasScale();
    
    // Réinitialiser la liste des éléments
    elements = JSON.parse(JSON.stringify(overlayData.elements));
    
    // Recréer les éléments
    elements.forEach(element => {
      const { id, type, properties } = element;
      
      const domElement = document.createElement('div');
      domElement.className = `canvas-element ${type}-element`;
      domElement.dataset.type = type;
      domElement.dataset.id = id;
      
      domElement.style.left = `${properties.left}px`;
      domElement.style.top = `${properties.top}px`;
      domElement.style.width = `${properties.width}px`;
      domElement.style.height = `${properties.height}px`;
      
      // Ajouter le contenu en fonction du type
      switch (type) {
        case 'text':
          domElement.innerHTML = properties.text || 'Texte';
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '16px';
          domElement.style.fontWeight = properties.fontWeight || 'normal';
          domElement.style.fontStyle = properties.fontStyle || 'normal';
          domElement.style.textAlign = properties.textAlign || 'center';
          break;
          
        case 'image':
          const img = document.createElement('img');
          img.src = properties.src || 'https://via.placeholder.com/200x100';
          img.alt = properties.alt || 'Image';
          img.style.borderRadius = properties.borderRadius || '0';
          img.style.opacity = properties.opacity || '1';
          img.style.border = properties.border || 'none';
          domElement.appendChild(img);
          break;
          
        case 'shape':
          domElement.style.backgroundColor = properties.backgroundColor || 'rgba(255, 255, 255, 0.2)';
          domElement.style.borderRadius = properties.borderRadius || '4px';
          domElement.style.border = properties.border || 'none';
          break;
          
        case 'social':
          domElement.innerHTML = `
            <img src="${properties.icon || 'https://via.placeholder.com/24'}" alt="Social">
            <span>${properties.username || '@username'}</span>
          `;
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '16px';
          break;
          
        case 'timer':
          domElement.innerHTML = properties.time || '00:00';
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '32px';
          domElement.style.fontWeight = properties.fontWeight || 'bold';
          break;
          
        case 'creator-code':
          domElement.innerHTML = `
            <span class="creator-label">CODE CRÉATEUR</span>
            <span class="creator-code">${properties.code || 'CODE'}</span>
            <span class="ad-tag">#AD</span>
          `;
          domElement.style.color = properties.color || '#ffffff';
          domElement.style.fontFamily = properties.fontFamily || 'Montserrat';
          domElement.style.fontSize = properties.fontSize || '14px';
          break;
      }
      
      // Ajouter les gestionnaires d'événements pour le déplacement
      makeElementDraggable(domElement);
      
      // Ajouter l'élément au canvas
      canvas.appendChild(domElement);
    });
    
    // Réinitialiser l'historique
    history = [JSON.parse(JSON.stringify(elements))];
    historyIndex = 0;
    updateUndoRedoButtons();
    
    // Désélectionner l'élément actuel
    selectedElement = null;
    showNoSelectionMessage();
    
    // Activer le bouton de copie d'URL
    document.getElementById('copy-url').disabled = false;
  };
  
  // Initialiser les gestionnaires d'événements
  const initEventListeners = () => {
    // Changement de taille du canvas
    canvasPreset.addEventListener('change', updateCanvasSize);
    canvasWidth.addEventListener('change', updateCanvasSize);
    canvasHeight.addEventListener('change', updateCanvasSize);
    
    // Boutons d'annulation/rétablissement
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
    // Bouton d'effacement du canvas
    clearCanvasBtn.addEventListener('click', clearCanvas);
    
    // Éléments glissables
    document.querySelectorAll('.element-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.type);
      });
    });
    
    // Zone de dépôt
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      
      const type = e.dataTransfer.getData('text/plain');
      if (!type) return;
      
      // Calculer la position de dépôt
      const canvasRect = canvas.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / currentScale;
      const y = (e.clientY - canvasRect.top) / currentScale;
      
      // Ajouter l'élément à la position de dépôt
      addElement(type, { left: x, top: y });
    });
    
    // Propriétés de texte
    document.getElementById('text-content').addEventListener('input', (e) => {
      if (!selectedElement || selectedElement.dataset.type !== 'text') return;
      
      selectedElement.textContent = e.target.value;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.text = e.target.value;
      }
    });
    
    document.getElementById('font-family').addEventListener('change', (e) => {
      if (!selectedElement) return;
      
      selectedElement.style.fontFamily = e.target.value;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.fontFamily = e.target.value;
      }
    });
    
    document.getElementById('font-size').addEventListener('input', (e) => {
      if (!selectedElement) return;
      
      const fontSize = `${e.target.value}px`;
      selectedElement.style.fontSize = fontSize;
      document.querySelector('#font-size + .range-value').textContent = fontSize;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.fontSize = fontSize;
      }
    });
    
    document.getElementById('text-color').addEventListener('input', (e) => {
      if (!selectedElement) return;
      
      selectedElement.style.color = e.target.value;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.color = e.target.value;
      }
    });
    
    document.getElementById('text-bold').addEventListener('click', () => {
      if (!selectedElement) return;
      
      const isBold = selectedElement.style.fontWeight === 'bold';
      selectedElement.style.fontWeight = isBold ? 'normal' : 'bold';
      document.getElementById('text-bold').classList.toggle('active', !isBold);
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.fontWeight = isBold ? 'normal' : 'bold';
      }
    });
    
    document.getElementById('text-italic').addEventListener('click', () => {
      if (!selectedElement) return;
      
      const isItalic = selectedElement.style.fontStyle === 'italic';
      selectedElement.style.fontStyle = isItalic ? 'normal' : 'italic';
      document.getElementById('text-italic').classList.toggle('active', !isItalic);
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.fontStyle = isItalic ? 'normal' : 'italic';
      }
    });
    
    document.getElementById('text-align-left').addEventListener('click', () => {
      if (!selectedElement) return;
      
      selectedElement.style.textAlign = 'left';
      document.getElementById('text-align-left').classList.add('active');
      document.getElementById('text-align-center').classList.remove('active');
      document.getElementById('text-align-right').classList.remove('active');
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.textAlign = 'left';
      }
    });
    
    document.getElementById('text-align-center').addEventListener('click', () => {
      if (!selectedElement) return;
      
      selectedElement.style.textAlign = 'center';
      document.getElementById('text-align-left').classList.remove('active');
      document.getElementById('text-align-center').classList.add('active');
      document.getElementById('text-align-right').classList.remove('active');
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.textAlign = 'center';
      }
    });
    
    document.getElementById('text-align-right').addEventListener('click', () => {
      if (!selectedElement) return;
      
      selectedElement.style.textAlign = 'right';
      document.getElementById('text-align-left').classList.remove('active');
      document.getElementById('text-align-center').classList.remove('active');
      document.getElementById('text-align-right').classList.add('active');
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.textAlign = 'right';
      }
    });
    
    // Propriétés d'image
    document.getElementById('change-image').addEventListener('click', () => {
      if (!selectedElement || selectedElement.dataset.type !== 'image') return;
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = selectedElement.querySelector('img');
          if (img) {
            img.src = event.target.result;
            
            // Mettre à jour les propriétés de l'élément
            const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
            if (elementIndex !== -1) {
              elements[elementIndex].properties.src = event.target.result;
            }
            
            // Sauvegarder l'état dans l'historique
            saveToHistory();
          }
        };
        
        reader.readAsDataURL(file);
      });
      
      input.click();
    });
    
    document.getElementById('image-opacity').addEventListener('input', (e) => {
      if (!selectedElement || selectedElement.dataset.type !== 'image') return;
      
      const opacity = e.target.value / 100;
      const img = selectedElement.querySelector('img');
      if (img) {
        img.style.opacity = opacity;
        document.querySelector('#image-opacity + .range-value').textContent = `${e.target.value}%`;
        
        // Mettre à jour les propriétés de l'élément
        const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
        if (elementIndex !== -1) {
          elements[elementIndex].properties.opacity = opacity;
        }
      }
    });
    
    document.getElementById('image-radius').addEventListener('input', (e) => {
      if (!selectedElement || selectedElement.dataset.type !== 'image') return;
      
      const radius = `${e.target.value}px`;
      const img = selectedElement.querySelector('img');
      if (img) {
        img.style.borderRadius = radius;
        document.querySelector('#image-radius + .range-value').textContent = radius;
        
        // Mettre à jour les propriétés de l'élément
        const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
        if (elementIndex !== -1) {
          elements[elementIndex].properties.borderRadius = radius;
        }
      }
    });
    
    document.getElementById('image-border').addEventListener('input', (e) => {
      if (!selectedElement || selectedElement.dataset.type !== 'image') return;
      
      const borderWidth = e.target.value;
      const borderColor = document.getElementById('border-color').value;
      const img = selectedElement.querySelector('img');
      if (img) {
        img.style.border = borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none';
        document.querySelector('#image-border + .range-value').textContent = `${borderWidth}px`;
        
        // Mettre à jour les propriétés de l'élément
        const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
        if (elementIndex !== -1) {
          elements[elementIndex].properties.border = borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none';
          elements[elementIndex].properties.borderWidth = borderWidth;
        }
      }
    });
    
    document.getElementById('border-color').addEventListener('input', (e) => {
      if (!selectedElement || selectedElement.dataset.type !== 'image') return;
      
      const borderWidth = document.getElementById('image-border').value;
      const borderColor = e.target.value;
      const img = selectedElement.querySelector('img');
      if (img && borderWidth > 0) {
        img.style.border = `${borderWidth}px solid ${borderColor}`;
        
        // Mettre à jour les propriétés de l'élément
        const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
        if (elementIndex !== -1) {
          elements[elementIndex].properties.border = `${borderWidth}px solid ${borderColor}`;
          elements[elementIndex].properties.borderColor = borderColor;
        }
      }
    });
    
    // Propriétés communes
    document.getElementById('position-x').addEventListener('change', (e) => {
      if (!selectedElement) return;
      
      selectedElement.style.left = `${e.target.value}px`;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.left = parseInt(e.target.value);
      }
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
    });
    
    document.getElementById('position-y').addEventListener('change', (e) => {
      if (!selectedElement) return;
      
      selectedElement.style.top = `${e.target.value}px`;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.top = parseInt(e.target.value);
      }
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
    });
    
    document.getElementById('element-width').addEventListener('change', (e) => {
      if (!selectedElement) return;
      
      selectedElement.style.width = `${e.target.value}px`;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.width = parseInt(e.target.value);
      }
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
    });
    
    document.getElementById('element-height').addEventListener('change', (e) => {
      if (!selectedElement) return;
      
      selectedElement.style.height = `${e.target.value}px`;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.height = parseInt(e.target.value);
      }
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
    });
    
    document.getElementById('element-rotation').addEventListener('input', (e) => {
      if (!selectedElement) return;
      
      const rotation = e.target.value;
      selectedElement.style.transform = `rotate(${rotation}deg)`;
      document.querySelector('#element-rotation + .range-value').textContent = `${rotation}°`;
      
      // Mettre à jour les propriétés de l'élément
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements[elementIndex].properties.rotation = rotation;
      }
    });
    
    document.getElementById('bring-forward').addEventListener('click', () => {
      if (!selectedElement) return;
      
      // Trouver l'élément suivant
      const nextElement = selectedElement.nextElementSibling;
      if (nextElement) {
        canvas.insertBefore(nextElement, selectedElement);
        
        // Mettre à jour l'ordre des éléments
        const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
        if (elementIndex !== -1 && elementIndex < elements.length - 1) {
          const temp = elements[elementIndex];
          elements[elementIndex] = elements[elementIndex + 1];
          elements[elementIndex + 1] = temp;
        }
        
        // Sauvegarder l'état dans l'historique
        saveToHistory();
      }
    });
    
    document.getElementById('send-backward').addEventListener('click', () => {
      if (!selectedElement) return;
      
      // Trouver l'élément précédent
      const prevElement = selectedElement.previousElementSibling;
      if (prevElement) {
        canvas.insertBefore(selectedElement, prevElement);
        
        // Mettre à jour l'ordre des éléments
        const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
        if (elementIndex > 0) {
          const temp = elements[elementIndex];
          elements[elementIndex] = elements[elementIndex - 1];
          elements[elementIndex - 1] = temp;
        }
        
        // Sauvegarder l'état dans l'historique
        saveToHistory();
      }
    });
    
    document.getElementById('delete-element').addEventListener('click', () => {
      if (!selectedElement) return;
      
      // Supprimer l'élément du DOM
      canvas.removeChild(selectedElement);
      
      // Supprimer l'élément de la liste
      const elementIndex = elements.findIndex(el => el.id === selectedElement.dataset.id);
      if (elementIndex !== -1) {
        elements.splice(elementIndex, 1);
      }
      
      // Désélectionner l'élément
      selectedElement = null;
      showNoSelectionMessage();
      
      // Sauvegarder l'état dans l'historique
      saveToHistory();
    });
    
    // Redimensionnement de la fenêtre
    window.addEventListener('resize', adjustCanvasScale);
  };
  
  // Initialiser l'éditeur
  initCanvas();
  initEventListeners();
  
  // Exposer les fonctions nécessaires
  window.addElement = addElement;
});