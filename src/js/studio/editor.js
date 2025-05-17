
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
    
    // Implémentation du drag & drop des éléments
    setupDragAndDrop(canvas);
    
    // Configuration du redimensionnement du canvas
    setupCanvasSize();
    
    // Configuration des boutons d'action
    setupActionButtons();
    
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
            transform: element.style.transform,
            zIndex: element.style.zIndex || '0'
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
      
      // Récupérer la couleur de fond du canvas
      const canvasBackground = document.getElementById('canvas-background');
      const backgroundColor = canvasBackground ? canvasBackground.value : '#000000';
      
      return {
        elements: elements,
        background: backgroundColor,
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
      const nameInput = document.getElementById('overlay-name');
      
      // Ajouter une propriété id si l'overlay est déjà sauvegardé
      if (window.currentOverlayId) {
        previewData.id = window.currentOverlayId;
      } else {
        previewData.id = 'overlay-' + Date.now();
      }
      
      // Ajouter le nom de l'overlay
      previewData.name = nameInput ? nameInput.value : "Overlay sans titre";
      
      return previewData;
    };
    
    // Fonction pour sauvegarder un overlay
    window.saveOverlay = async (data) => {
      console.log('Sauvegarde de l\'overlay', data);
      
      // Générer une capture d'écran du canvas
      try {
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
          // Créer une capture d'écran du canvas
          const screenshot = await html2canvas(canvas, {
            backgroundColor: '#000000',
            scale: 0.3, // Échelle réduite pour la vignette
            logging: false
          });
          
          // Convertir le canvas en base64
          data.thumbnail = screenshot.toDataURL('image/jpeg', 0.7);
        }
      } catch (e) {
        console.error('Impossible de créer la vignette:', e);
      }
      
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
      
      // Afficher une notification de succès
      showNotification('Overlay sauvegardé avec succès!', 'success');
      
      return { id: data.id };
    };
    
    // Fonction pour charger un overlay existant
    window.loadOverlay = (overlayId) => {
      // Récupérer les overlays sauvegardés
      const savedOverlays = JSON.parse(localStorage.getItem('saved_overlays') || '[]');
      const overlay = savedOverlays.find(o => o.id === overlayId);
      
      if (!overlay) return false;
      
      // Nettoyer le canvas
      const canvas = document.getElementById('editor-canvas');
      if (!canvas) return false;
      
      // Supprimer tous les éléments existants
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
      
      // Restaurer la taille du canvas
      if (overlay.size) {
        canvas.style.width = `${overlay.size.width}px`;
        canvas.style.height = `${overlay.size.height}px`;
        
        // Mettre à jour les inputs correspondants
        const canvasPreset = document.getElementById('canvas-preset');
        if (canvasPreset) {
          const presetValue = `${overlay.size.width}x${overlay.size.height}`;
          const presetExists = Array.from(canvasPreset.options).some(option => option.value === presetValue);
          
          if (presetExists) {
            canvasPreset.value = presetValue;
          } else {
            canvasPreset.value = 'custom';
            
            const canvasWidth = document.getElementById('canvas-width');
            const canvasHeight = document.getElementById('canvas-height');
            const customSizeDiv = document.querySelector('.custom-size');
            
            if (customSizeDiv) customSizeDiv.style.display = 'flex';
            if (canvasWidth) canvasWidth.value = overlay.size.width;
            if (canvasHeight) canvasHeight.value = overlay.size.height;
          }
        }
      }
      
      // Restaurer la couleur de fond
      const canvasBackground = document.getElementById('canvas-background');
      if (canvasBackground && overlay.background) {
        canvasBackground.value = overlay.background;
        canvas.style.backgroundColor = overlay.background;
      }
      
      // Restaurer le nom de l'overlay
      const nameInput = document.getElementById('overlay-name');
      if (nameInput && overlay.metadata && overlay.metadata.name) {
        nameInput.value = overlay.metadata.name;
      }
      
      // Restaurer les éléments
      if (overlay.elements && Array.isArray(overlay.elements)) {
        overlay.elements.forEach(element => {
          // Créer l'élément sur le canvas
          createElementFromData(element, canvas);
        });
      }
      
      // Enregistrer l'ID de l'overlay courant
      window.currentOverlayId = overlayId;
      
      return true;
    };
  };
  
  // Créer un élément à partir des données sauvegardées
  function createElementFromData(data, canvas) {
    if (!data || !data.type || !canvas) return null;
    
    const element = document.createElement('div');
    element.className = `editor-element ${data.type}-element`;
    element.dataset.type = data.type;
    element.innerHTML = data.content || '';
    
    // Appliquer les styles
    if (data.style) {
      Object.entries(data.style).forEach(([key, value]) => {
        if (value) element.style[key] = value;
      });
    }
    
    // S'assurer que l'élément est positionné correctement
    element.style.position = 'absolute';
    
    // Rendre l'élément déplaçable
    makeElementDraggable(element);
    
    // Ajouter les gestionnaires spécifiques selon le type
    if (data.type === 'text') {
      element.contentEditable = true;
    }
    
    // Ajouter l'élément au canvas
    canvas.appendChild(element);
    
    return element;
  }
  
  // Configuration du drag & drop
  function setupDragAndDrop(canvas) {
    const elements = document.querySelectorAll('.element-item');
    
    if (elements && canvas) {
      elements.forEach(element => {
        element.addEventListener('dragstart', (e) => {
          console.log('Dragstart event triggered', element.dataset.type);
          e.dataTransfer.setData('text/plain', element.dataset.type);
        });
      });

      canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.classList.add('dragover');
      });
      
      canvas.addEventListener('dragleave', (e) => {
        canvas.classList.remove('dragover');
      });

      canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('dragover');
        const type = e.dataTransfer.getData('text/plain');
        console.log('Drop event triggered with element type:', type);
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Création de l'élément
        createCanvasElement(type, x, y);
      });
    }
  }
  
  // Création d'éléments sur le canvas
  function createCanvasElement(type, x, y) {
    console.log('Création d\'élément:', type, 'à', x, y);
    const canvas = document.getElementById('editor-canvas');
    if (!canvas) return;
    
    const element = document.createElement('div');
    element.className = `editor-element ${type}-element`;
    element.dataset.type = type;
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.cursor = 'move';
    element.style.zIndex = '1'; // Valeur par défaut

    switch (type) {
      case 'text':
        element.innerHTML = 'Double-cliquez pour éditer';
        element.contentEditable = true;
        element.style.color = '#ffffff';
        element.style.fontFamily = 'Montserrat, sans-serif';
        element.style.fontSize = '24px';
        element.style.minWidth = '200px';
        element.style.minHeight = '30px';
        element.style.padding = '10px';
        break;
      case 'image':
        element.innerHTML = '<div class="placeholder">Cliquez pour ajouter une image</div>';
        element.style.width = '200px';
        element.style.height = '150px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.color = '#ffffff';
        
        // Ajouter un gestionnaire d'événement pour sélectionner une image
        element.addEventListener('click', function(e) {
          if (e.target !== this && !e.target.classList.contains('placeholder')) return;
          
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          
          fileInput.onchange = function() {
            if (this.files && this.files[0]) {
              const file = this.files[0];
              const reader = new FileReader();
              
              reader.onload = function(e) {
                // Créer une image pour obtenir les dimensions réelles
                const img = new Image();
                img.onload = function() {
                  // Ajuster la taille de l'élément aux dimensions réelles de l'image
                  element.style.width = `${img.width}px`;
                  element.style.height = `${img.height}px`;
                  
                  // Mettre à jour les champs de propriétés si l'élément est sélectionné
                  if (element.classList.contains('selected')) {
                    const widthInput = document.getElementById('element-width');
                    const heightInput = document.getElementById('element-height');
                    if (widthInput) widthInput.value = img.width;
                    if (heightInput) heightInput.value = img.height;
                  }
                };
                
                img.src = e.target.result;
                
                // Mettre à jour l'élément avec l'image
                element.innerHTML = '';
                element.style.backgroundImage = `url(${e.target.result})`;
                element.style.backgroundSize = 'contain';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
              };
              
              reader.readAsDataURL(file);
            }
          };
          
          fileInput.click();
        });
        
        // Ajout des poignées de redimensionnement
        addResizeHandles(element);
        break;
      case 'shape':
        // Nouveau format pour les formes avec plus d'options
        element.style.width = '100px';
        element.style.height = '100px';
        element.style.backgroundColor = '#ffffff';
        element.style.border = '2px solid #000000';
        element.style.borderRadius = '0'; // Rectangle par défaut
        
        // Ajout des poignées de redimensionnement
        addResizeHandles(element);
        break;
      case 'timer':
        element.innerHTML = '00:10:00';
        element.dataset.format = 'hh:mm:ss';
        element.dataset.duration = '600'; // 10 minutes par défaut
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '24px';
        element.style.padding = '8px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        element.style.color = '#ffffff';
        element.style.borderRadius = '4px';
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
  }

  // Ajouter les poignées de redimensionnement à un élément
  function addResizeHandles(element) {
    const positions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    const handles = {};
    
    positions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `resize-handle ${pos}`;
      handle.style.position = 'absolute';
      handle.style.width = '10px';
      handle.style.height = '10px';
      handle.style.backgroundColor = '#0066ff';
      handle.style.zIndex = '1000';
      handle.style.borderRadius = '50%';
      
      switch(pos) {
        case 'nw': 
          handle.style.top = '-5px'; 
          handle.style.left = '-5px'; 
          handle.style.cursor = 'nwse-resize';
          break;
        case 'n': 
          handle.style.top = '-5px'; 
          handle.style.left = 'calc(50% - 5px)'; 
          handle.style.cursor = 'ns-resize';
          break;
        case 'ne': 
          handle.style.top = '-5px'; 
          handle.style.right = '-5px'; 
          handle.style.cursor = 'nesw-resize';
          break;
        case 'e': 
          handle.style.top = 'calc(50% - 5px)'; 
          handle.style.right = '-5px'; 
          handle.style.cursor = 'ew-resize';
          break;
        case 'se': 
          handle.style.bottom = '-5px'; 
          handle.style.right = '-5px'; 
          handle.style.cursor = 'nwse-resize';
          break;
        case 's': 
          handle.style.bottom = '-5px'; 
          handle.style.left = 'calc(50% - 5px)'; 
          handle.style.cursor = 'ns-resize';
          break;
        case 'sw': 
          handle.style.bottom = '-5px'; 
          handle.style.left = '-5px'; 
          handle.style.cursor = 'nesw-resize';
          break;
        case 'w': 
          handle.style.top = 'calc(50% - 5px)'; 
          handle.style.left = '-5px'; 
          handle.style.cursor = 'ew-resize';
          break;
      }
      
      handles[pos] = handle;
      element.appendChild(handle);
      
      handle.addEventListener('mousedown', startResize);
    });
    
    // Stocker les poignées sur l'élément pour un accès facile
    element.resizeHandles = handles;
    
    function startResize(e) {
      e.stopPropagation();
      e.preventDefault();
      
      const handle = e.target;
      const direction = handle.className.split(' ')[1];
      
      const startX = e.clientX;
      const startY = e.clientY;
      
      const startWidth = parseInt(element.style.width);
      const startHeight = parseInt(element.style.height);
      const startLeft = parseInt(element.style.left);
      const startTop = parseInt(element.style.top);
      
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      
      function resize(e) {
        e.preventDefault();
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        if (direction.includes('e')) {
          newWidth = startWidth + deltaX;
        }
        if (direction.includes('w')) {
          newWidth = startWidth - deltaX;
          newLeft = startLeft + deltaX;
        }
        if (direction.includes('s')) {
          newHeight = startHeight + deltaY;
        }
        if (direction.includes('n')) {
          newHeight = startHeight - deltaY;
          newTop = startTop + deltaY;
        }
        
        // Appliquer les nouvelles dimensions et position
        if (newWidth > 20) {
          element.style.width = `${newWidth}px`;
          if (direction.includes('w')) {
            element.style.left = `${newLeft}px`;
          }
        }
        
        if (newHeight > 20) {
          element.style.height = `${newHeight}px`;
          if (direction.includes('n')) {
            element.style.top = `${newTop}px`;
          }
        }
        
        // Mettre à jour les champs de propriétés si l'élément est sélectionné
        if (element.classList.contains('selected')) {
          const widthInput = document.getElementById('element-width');
          const heightInput = document.getElementById('element-height');
          const leftInput = document.getElementById('position-x');
          const topInput = document.getElementById('position-y');
          
          if (widthInput) widthInput.value = Math.round(newWidth);
          if (heightInput) heightInput.value = Math.round(newHeight);
          if (leftInput) leftInput.value = Math.round(newLeft);
          if (topInput) topInput.value = Math.round(newTop);
        }
      }
      
      function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
      }
    }
  }

  // Rendre un élément déplaçable
  function makeElementDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
      // Ne pas déclencher le déplacement si on clique sur une poignée de redimensionnement
      if (e.target.classList.contains('resize-handle')) {
        return;
      }
      
      if (e.target !== element && e.target.contentEditable === 'true') {
        return; // Permet l'édition du contenu sans déplacer
      }
      e.preventDefault();
      e.stopPropagation(); // Empêche la propagation au canvas
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
  }

  // Sélection d'un élément
  function selectElement(element) {
    // Désélectionner tous les éléments
    const elements = document.querySelectorAll('.editor-element');
    elements.forEach(el => el.classList.remove('selected'));
    
    // Sélectionner l'élément actuel
    element.classList.add('selected');
    
    // Ajouter une bordure visible pour indiquer la sélection
    elements.forEach(el => {
      el.style.outline = 'none';
      // Masquer les poignées de redimensionnement
      if (el.resizeHandles) {
        Object.values(el.resizeHandles).forEach(handle => {
          handle.style.display = 'none';
        });
      }
    });
    
    element.style.outline = '2px solid #0066ff';
    
    // Afficher les poignées de redimensionnement
    if (element.resizeHandles) {
      Object.values(element.resizeHandles).forEach(handle => {
        handle.style.display = 'block';
      });
    }
    
    // Afficher les propriétés correspondantes
    showElementProperties(element);
  }

  // Afficher les propriétés d'un élément
  function showElementProperties(element) {
    const propertiesGroups = document.querySelectorAll('.properties-group');
    const noSelection = document.querySelector('.no-selection-message');

    propertiesGroups.forEach(group => group.style.display = 'none');
    if (noSelection) noSelection.style.display = 'none';

    // Afficher les propriétés spécifiques en fonction du type d'élément
    if (element.classList.contains('text-element')) {
      const textProperties = document.querySelector('.text-properties');
      if (textProperties) textProperties.style.display = 'block';
      
      // Mettre à jour les champs de propriétés
      const textContent = document.getElementById('text-content');
      if (textContent) textContent.value = element.innerText;
      
      // Police
      const fontFamily = document.getElementById('font-family');
      if (fontFamily) fontFamily.value = element.style.fontFamily.split(',')[0].replace(/['"]/g, '');
      
      // Taille de police
      const fontSize = document.getElementById('font-size');
      if (fontSize) {
        const size = parseInt(element.style.fontSize);
        fontSize.value = size || 16;
        const sizeValue = fontSize.nextElementSibling;
        if (sizeValue) sizeValue.textContent = `${size || 16}px`;
      }
      
      // Couleur du texte
      const textColor = document.getElementById('text-color');
      if (textColor) textColor.value = element.style.color || '#ffffff';
      
      // Couleur de fond
      const bgColor = document.getElementById('text-bg-color');
      if (bgColor) bgColor.value = element.style.backgroundColor || 'transparent';
    } else if (element.classList.contains('image-element')) {
      const imageProperties = document.querySelector('.image-properties');
      if (imageProperties) imageProperties.style.display = 'block';
      
      // Opacité
      const imageOpacity = document.getElementById('image-opacity');
      if (imageOpacity) {
        const opacity = parseFloat(element.style.opacity) * 100 || 100;
        imageOpacity.value = opacity;
        const opacityValue = imageOpacity.nextElementSibling;
        if (opacityValue) opacityValue.textContent = `${opacity}%`;
      }
      
      // Arrondi
      const imageRadius = document.getElementById('image-radius');
      if (imageRadius) {
        const radius = parseInt(element.style.borderRadius) || 0;
        imageRadius.value = radius;
        const radiusValue = imageRadius.nextElementSibling;
        if (radiusValue) radiusValue.textContent = `${radius}px`;
      }
    } else if (element.classList.contains('shape-element')) {
      const shapeProperties = document.querySelector('.shape-properties');
      if (shapeProperties) shapeProperties.style.display = 'block';
      
      // Couleur de fond
      const shapeBgColor = document.getElementById('shape-bg-color');
      if (shapeBgColor) shapeBgColor.value = element.style.backgroundColor || '#ffffff';
      
      // Couleur de bordure
      const shapeBorderColor = document.getElementById('shape-border-color');
      if (shapeBorderColor) {
        const borderColor = element.style.borderColor || '#000000';
        shapeBorderColor.value = borderColor;
      }
      
      // Épaisseur de bordure
      const shapeBorderWidth = document.getElementById('shape-border-width');
      if (shapeBorderWidth) {
        const width = parseInt(element.style.borderWidth) || 2;
        shapeBorderWidth.value = width;
        const widthValue = shapeBorderWidth.nextElementSibling;
        if (widthValue) widthValue.textContent = `${width}px`;
      }
      
      // Arrondi
      const shapeRadius = document.getElementById('shape-radius');
      if (shapeRadius) {
        const radius = parseInt(element.style.borderRadius) || 0;
        shapeRadius.value = radius;
        const radiusValue = shapeRadius.nextElementSibling;
        if (radiusValue) radiusValue.textContent = `${radius}px`;
      }
      
      // Type de forme
      const shapeType = document.getElementById('shape-type');
      if (shapeType) {
        // Déterminer le type de forme à partir du borderRadius
        const radius = parseInt(element.style.borderRadius) || 0;
        const width = parseInt(element.style.width);
        const height = parseInt(element.style.height);
        
        if (radius >= 50) {
          shapeType.value = 'circle';
        } else if (radius > 0) {
          shapeType.value = 'rounded';
        } else {
          shapeType.value = 'rectangle';
        }
      }
    } else if (element.classList.contains('timer-element')) {
      const timerProperties = document.querySelector('.timer-properties');
      if (timerProperties) timerProperties.style.display = 'block';
      
      // Format
      const timerFormat = document.getElementById('timer-format');
      if (timerFormat) timerFormat.value = element.dataset.format || 'hh:mm:ss';
      
      // Durée
      const timerDuration = document.getElementById('timer-duration');
      if (timerDuration) timerDuration.value = element.dataset.duration || '600';
      
      // Couleur du texte
      const timerColor = document.getElementById('timer-color');
      if (timerColor) timerColor.value = element.style.color || '#ffffff';
      
      // Couleur de fond
      const timerBgColor = document.getElementById('timer-bg-color');
      if (timerBgColor) timerBgColor.value = element.style.backgroundColor || 'rgba(0, 0, 0, 0.7)';
      
      // Taille de police
      const timerFontSize = document.getElementById('timer-font-size');
      if (timerFontSize) {
        const size = parseInt(element.style.fontSize);
        timerFontSize.value = size || 24;
        const sizeValue = timerFontSize.nextElementSibling;
        if (sizeValue) sizeValue.textContent = `${size || 24}px`;
      }
    }

    // Mettre à jour les propriétés communes
    const commonProperties = document.querySelector('.common-properties');
    if (commonProperties) {
      commonProperties.style.display = 'block';
      
      // Position X
      if (document.getElementById('position-x')) {
        document.getElementById('position-x').value = Math.round(element.offsetLeft);
      }
      
      // Position Y
      if (document.getElementById('position-y')) {
        document.getElementById('position-y').value = Math.round(element.offsetTop);
      }
      
      // Largeur
      if (document.getElementById('element-width')) {
        document.getElementById('element-width').value = Math.round(element.offsetWidth);
      }
      
      // Hauteur
      if (document.getElementById('element-height')) {
        document.getElementById('element-height').value = Math.round(element.offsetHeight);
      }
      
      // Rotation
      const rotation = document.getElementById('element-rotation');
      if (rotation) {
        // Extraire l'angle de rotation de la propriété transform
        let angle = 0;
        if (element.style.transform) {
          const match = element.style.transform.match(/rotate\((\d+)deg\)/);
          if (match) angle = parseInt(match[1]);
        }
        rotation.value = angle;
        const rotationValue = rotation.nextElementSibling;
        if (rotationValue) rotationValue.textContent = `${angle}°`;
      }
    }
    
    // Configurer les événements pour les propriétés
    setupPropertyEvents(element);
  }
  
  // Configurer les événements pour les champs de propriétés
  function setupPropertyEvents(element) {
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
    
    // Rotation
    const rotation = document.getElementById('element-rotation');
    if (rotation) {
      rotation.oninput = () => {
        element.style.transform = `rotate(${rotation.value}deg)`;
        const rotationValue = rotation.nextElementSibling;
        if (rotationValue) rotationValue.textContent = `${rotation.value}°`;
      };
    }
    
    // Propriétés spécifiques au texte
    if (element.classList.contains('text-element')) {
      // Contenu du texte
      const textContent = document.getElementById('text-content');
      if (textContent) {
        textContent.onchange = () => {
          element.innerText = textContent.value;
        };
      }
      
      // Police
      const fontFamily = document.getElementById('font-family');
      if (fontFamily) {
        fontFamily.onchange = () => {
          element.style.fontFamily = fontFamily.value;
        };
      }
      
      // Taille de police
      const fontSize = document.getElementById('font-size');
      if (fontSize) {
        fontSize.oninput = () => {
          element.style.fontSize = `${fontSize.value}px`;
          const sizeValue = fontSize.nextElementSibling;
          if (sizeValue) sizeValue.textContent = `${fontSize.value}px`;
        };
      }
      
      // Couleur du texte
      const textColor = document.getElementById('text-color');
      if (textColor) {
        textColor.oninput = () => {
          element.style.color = textColor.value;
        };
      }
      
      // Couleur de fond
      const bgColor = document.getElementById('text-bg-color');
      if (bgColor) {
        bgColor.oninput = () => {
          element.style.backgroundColor = bgColor.value;
        };
      }
      
      // Gras
      const textBold = document.getElementById('text-bold');
      if (textBold) {
        textBold.onclick = () => {
          if (element.style.fontWeight === 'bold') {
            element.style.fontWeight = 'normal';
            textBold.classList.remove('active');
          } else {
            element.style.fontWeight = 'bold';
            textBold.classList.add('active');
          }
        };
      }
      
      // Italique
      const textItalic = document.getElementById('text-italic');
      if (textItalic) {
        textItalic.onclick = () => {
          if (element.style.fontStyle === 'italic') {
            element.style.fontStyle = 'normal';
            textItalic.classList.remove('active');
          } else {
            element.style.fontStyle = 'italic';
            textItalic.classList.add('active');
          }
        };
      }
    }
    
    // Propriétés spécifiques à l'image
    if (element.classList.contains('image-element')) {
      // Changer l'image
      const changeImage = document.getElementById('change-image');
      if (changeImage) {
        changeImage.onclick = () => {
          // Simuler un input de type file
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                // Créer une image pour obtenir les dimensions réelles
                const img = new Image();
                img.onload = function() {
                  // Ajuster la taille de l'élément aux dimensions réelles de l'image
                  element.style.width = `${img.width}px`;
                  element.style.height = `${img.height}px`;
                  
                  // Mettre à jour les champs de propriétés
                  const widthInput = document.getElementById('element-width');
                  const heightInput = document.getElementById('element-height');
                  if (widthInput) widthInput.value = img.width;
                  if (heightInput) heightInput.value = img.height;
                };
                
                img.src = e.target.result;
                
                element.innerHTML = '';
                element.style.backgroundImage = `url(${e.target.result})`;
                element.style.backgroundSize = 'contain';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
              };
              reader.readAsDataURL(file);
            }
          };
          fileInput.click();
        };
      }
      
      // Opacité
      const imageOpacity = document.getElementById('image-opacity');
      if (imageOpacity) {
        imageOpacity.oninput = () => {
          element.style.opacity = imageOpacity.value / 100;
          const opacityValue = imageOpacity.nextElementSibling;
          if (opacityValue) opacityValue.textContent = `${imageOpacity.value}%`;
        };
      }
      
      // Arrondi
      const imageRadius = document.getElementById('image-radius');
      if (imageRadius) {
        imageRadius.oninput = () => {
          element.style.borderRadius = `${imageRadius.value}px`;
          const radiusValue = imageRadius.nextElementSibling;
          if (radiusValue) radiusValue.textContent = `${imageRadius.value}px`;
        };
      }
    }
    
    // Propriétés spécifiques aux formes
    if (element.classList.contains('shape-element')) {
      // Couleur de fond
      const shapeBgColor = document.getElementById('shape-bg-color');
      if (shapeBgColor) {
        shapeBgColor.oninput = () => {
          element.style.backgroundColor = shapeBgColor.value;
        };
      }
      
      // Couleur de bordure
      const shapeBorderColor = document.getElementById('shape-border-color');
      if (shapeBorderColor) {
        shapeBorderColor.oninput = () => {
          element.style.borderColor = shapeBorderColor.value;
        };
      }
      
      // Épaisseur de bordure
      const shapeBorderWidth = document.getElementById('shape-border-width');
      if (shapeBorderWidth) {
        shapeBorderWidth.oninput = () => {
          element.style.borderWidth = `${shapeBorderWidth.value}px`;
          element.style.borderStyle = 'solid';
          const widthValue = shapeBorderWidth.nextElementSibling;
          if (widthValue) widthValue.textContent = `${shapeBorderWidth.value}px`;
        };
      }
      
      // Arrondi
      const shapeRadius = document.getElementById('shape-radius');
      if (shapeRadius) {
        shapeRadius.oninput = () => {
          element.style.borderRadius = `${shapeRadius.value}px`;
          const radiusValue = shapeRadius.nextElementSibling;
          if (radiusValue) radiusValue.textContent = `${shapeRadius.value}px`;
        };
      }
      
      // Type de forme
      const shapeType = document.getElementById('shape-type');
      if (shapeType) {
        shapeType.onchange = () => {
          switch(shapeType.value) {
            case 'circle':
              // Rendre la forme circulaire
              element.style.borderRadius = '50%';
              if (shapeRadius) {
                shapeRadius.value = 50;
                const radiusValue = shapeRadius.nextElementSibling;
                if (radiusValue) radiusValue.textContent = '50px';
              }
              break;
            case 'rounded':
              // Rectangle aux coins arrondis
              element.style.borderRadius = '10px';
              if (shapeRadius) {
                shapeRadius.value = 10;
                const radiusValue = shapeRadius.nextElementSibling;
                if (radiusValue) radiusValue.textContent = '10px';
              }
              break;
            case 'rectangle':
              // Rectangle standard
              element.style.borderRadius = '0';
              if (shapeRadius) {
                shapeRadius.value = 0;
                const radiusValue = shapeRadius.nextElementSibling;
                if (radiusValue) radiusValue.textContent = '0px';
              }
              break;
          }
        };
      }
    }
    
    // Propriétés spécifiques au minuteur
    if (element.classList.contains('timer-element')) {
      // Format
      const timerFormat = document.getElementById('timer-format');
      if (timerFormat) {
        timerFormat.onchange = () => {
          element.dataset.format = timerFormat.value;
          
          // Mettre à jour l'affichage du timer selon le format
          const duration = parseInt(element.dataset.duration) || 600;
          element.innerText = formatTime(duration, timerFormat.value);
        };
      }
      
      // Durée
      const timerDuration = document.getElementById('timer-duration');
      if (timerDuration) {
        timerDuration.onchange = () => {
          const duration = parseInt(timerDuration.value) || 600;
          element.dataset.duration = duration;
          
          // Mettre à jour l'affichage du timer selon le format
          const format = element.dataset.format || 'hh:mm:ss';
          element.innerText = formatTime(duration, format);
        };
      }
      
      // Couleur du texte
      const timerColor = document.getElementById('timer-color');
      if (timerColor) {
        timerColor.oninput = () => {
          element.style.color = timerColor.value;
        };
      }
      
      // Couleur de fond
      const timerBgColor = document.getElementById('timer-bg-color');
      if (timerBgColor) {
        timerBgColor.oninput = () => {
          element.style.backgroundColor = timerBgColor.value;
        };
      }
      
      // Taille de police
      const timerFontSize = document.getElementById('timer-font-size');
      if (timerFontSize) {
        timerFontSize.oninput = () => {
          element.style.fontSize = `${timerFontSize.value}px`;
          const sizeValue = timerFontSize.nextElementSibling;
          if (sizeValue) sizeValue.textContent = `${timerFontSize.value}px`;
        };
      }
    }
    
    // Formater le temps selon le format souhaité
    function formatTime(seconds, format) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      
      switch(format) {
        case 'hh:mm:ss':
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        case 'mm:ss':
          return `${(h * 60 + m).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        case 'ss':
          return `${(h * 3600 + m * 60 + s).toString().padStart(2, '0')}`;
        default:
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    }
    
    // Boutons d'avant-plan/arrière-plan
    const bringForward = document.getElementById('bring-forward');
    if (bringForward) {
      bringForward.onclick = () => {
        const zIndex = parseInt(element.style.zIndex || 1);
        element.style.zIndex = (zIndex + 1).toString();
      };
    }
    
    const sendBackward = document.getElementById('send-backward');
    if (sendBackward) {
      sendBackward.onclick = () => {
        const zIndex = parseInt(element.style.zIndex || 1);
        if (zIndex > 1) {
          element.style.zIndex = (zIndex - 1).toString();
        }
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
  }
  
  // Configuration de la taille du canvas
  function setupCanvasSize() {
    const canvasPreset = document.getElementById('canvas-preset');
    const customSizeDiv = document.querySelector('.custom-size');
    const canvasWidth = document.getElementById('canvas-width');
    const canvasHeight = document.getElementById('canvas-height');
    const canvasBackground = document.getElementById('canvas-background');
    const canvas = document.getElementById('editor-canvas');
    
    if (canvasPreset && customSizeDiv && canvas) {
      // Gestion du changement de preset
      canvasPreset.addEventListener('change', () => {
        if (canvasPreset.value === 'custom') {
          customSizeDiv.style.display = 'flex';
        } else {
          customSizeDiv.style.display = 'none';
          const [width, height] = canvasPreset.value.split('x');
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
        }
      });
      
      // Gestion des dimensions personnalisées
      if (canvasWidth && canvasHeight) {
        canvasWidth.addEventListener('change', () => {
          canvas.style.width = `${canvasWidth.value}px`;
        });
        
        canvasHeight.addEventListener('change', () => {
          canvas.style.height = `${canvasHeight.value}px`;
        });
      }
      
      // Gestion du fond du canvas
      if (canvasBackground) {
        canvasBackground.addEventListener('input', () => {
          canvas.style.backgroundColor = canvasBackground.value;
        });
      }
    }
  }
  
  // Configuration des boutons d'action
  function setupActionButtons() {
    // Prévisualisation
    const previewBtn = document.getElementById('preview-overlay');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        const previewData = window.generatePreviewData();
        const previewHtml = window.generatePreviewHtml(previewData);
        
        // Afficher la prévisualisation dans une modal
        const previewModal = document.getElementById('preview-modal');
        const previewFrame = document.getElementById('preview-frame');
        
        if (previewModal && previewFrame) {
          previewModal.style.display = 'flex';
          
          const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
          frameDoc.open();
          frameDoc.write(previewHtml);
          frameDoc.close();
        }
      });
    }
    
    // Sauvegarder
    const saveBtn = document.getElementById('save-overlay');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const saveModal = document.getElementById('save-modal');
        const saveNameInput = document.getElementById('save-overlay-name');
        const overlayNameInput = document.getElementById('overlay-name');
        
        if (saveModal && saveNameInput && overlayNameInput) {
          saveModal.style.display = 'flex';
          saveNameInput.value = overlayNameInput.value;
        }
      });
    }
    
    // Confirmer la sauvegarde
    const confirmSaveBtn = document.getElementById('confirm-save');
    if (confirmSaveBtn) {
      confirmSaveBtn.addEventListener('click', async () => {
        const saveNameInput = document.getElementById('save-overlay-name');
        const overlayNameInput = document.getElementById('overlay-name');
        const descriptionInput = document.getElementById('overlay-description');
        const categorySelect = document.getElementById('overlay-category');
        const publicCheckbox = document.getElementById('overlay-public');
        
        // Mettre à jour le nom de l'overlay
        if (overlayNameInput && saveNameInput) {
          overlayNameInput.value = saveNameInput.value;
        }
        
        // Récupérer les données de l'overlay
        const overlayData = window.generateOverlayData();
        
        // Ajouter les métadonnées supplémentaires
        overlayData.metadata = {
          name: saveNameInput ? saveNameInput.value : "Overlay sans nom",
          description: descriptionInput ? descriptionInput.value : "",
          category: categorySelect ? categorySelect.value : "other",
          public: publicCheckbox ? publicCheckbox.checked : false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Sauvegarder l'overlay
        try {
          await window.saveOverlay(overlayData);
          
          // Activer le bouton de copie d'URL
          const copyUrlBtn = document.getElementById('copy-url');
          if (copyUrlBtn) {
            copyUrlBtn.disabled = false;
            
            // Ajouter l'événement pour copier l'URL
            copyUrlBtn.onclick = () => {
              const urlModal = document.getElementById('url-modal');
              const obsUrlInput = document.getElementById('obs-url');
              
              if (urlModal && obsUrlInput) {
                urlModal.style.display = 'flex';
                const baseUrl = window.location.origin;
                const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
                const userId = userData.id || 'anonymous';
                
                // Créer un token encodé pour l'URL
                const token = btoa(`${userId}-${overlayData.id}`);
                obsUrlInput.value = `${baseUrl}/overlay.html?token=${token}`;
              }
            };
          }
          
          // Fermer le modal
          const saveModal = document.getElementById('save-modal');
          if (saveModal) {
            saveModal.style.display = 'none';
          }
          
          // Afficher une notification de succès
          showNotification('Overlay sauvegardé avec succès !', 'success');
        } catch (e) {
          console.error('Erreur lors de la sauvegarde:', e);
          showNotification('Erreur lors de la sauvegarde', 'error');
        }
      });
    }
    
    // Fermer les modals
    const closeButtons = document.querySelectorAll('.close-modal, #close-preview, #cancel-save, #close-url-modal');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
          modal.style.display = 'none';
        });
      });
    });
    
    // Copier l'URL pour OBS
    const copyObsUrlBtn = document.getElementById('copy-obs-url');
    if (copyObsUrlBtn) {
      copyObsUrlBtn.addEventListener('click', () => {
        const obsUrlInput = document.getElementById('obs-url');
        if (obsUrlInput) {
          obsUrlInput.select();
          document.execCommand('copy');
          showNotification('URL copiée dans le presse-papier', 'success');
        }
      });
    }
    
    // Effacer tout
    const clearCanvasBtn = document.getElementById('clear-canvas');
    if (clearCanvasBtn) {
      clearCanvasBtn.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir effacer tous les éléments ?')) {
          const canvas = document.getElementById('editor-canvas');
          if (canvas) {
            while (canvas.firstChild) {
              canvas.removeChild(canvas.firstChild);
            }
            
            // Réinitialiser le panneau des propriétés
            const propertiesGroups = document.querySelectorAll('.properties-group');
            propertiesGroups.forEach(group => group.style.display = 'none');
            
            const noSelection = document.querySelector('.no-selection-message');
            if (noSelection) noSelection.style.display = 'block';
          }
        }
      });
    }
  }
  
  // Afficher une notification
  function showNotification(message, type = 'info') {
    // Créer l'élément de notification s'il n'existe pas
    let notification = document.querySelector('.studio-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'studio-notification';
      document.body.appendChild(notification);
    }
    
    // Définir le type et le message
    notification.className = `studio-notification ${type}`;
    notification.textContent = message;
    
    // Afficher la notification
    notification.style.display = 'block';
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.style.display = 'none';
      }, 300);
    }, 3000);
  }

  // Attendre que la vue de l'éditeur soit visible
  document.addEventListener('viewChanged', (event) => {
    if (event.detail.view === 'editor') {
      initEditor();
      
      // Si un ID d'overlay est défini, le charger
      if (window.currentOverlayId && window.loadOverlay) {
        window.loadOverlay(window.currentOverlayId);
      }
    }
  });
  
  // Initialiser l'éditeur si c'est la vue par défaut
  if (document.getElementById('editor-view') && !document.getElementById('editor-view').classList.contains('hidden')) {
    initEditor();
  }
  
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
          
          // Masquer les poignées de redimensionnement
          if (el.resizeHandles) {
            Object.values(el.resizeHandles).forEach(handle => {
              handle.style.display = 'none';
            });
          }
        });
        
        // Afficher le message "aucune sélection"
        const propertiesGroups = document.querySelectorAll('.properties-group');
        propertiesGroups.forEach(group => group.style.display = 'none');
        
        const noSelection = document.querySelector('.no-selection-message');
        if (noSelection) noSelection.style.display = 'block';
      }
    });
  }
  
  // Charger html2canvas
  function loadHTML2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // Charger html2canvas au démarrage
  loadHTML2Canvas().catch(e => console.error('Erreur lors du chargement de html2canvas:', e));
});
