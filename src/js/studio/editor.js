
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
  };
  
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
    
    // Vérifier si un élément existe déjà à cette position
    // pour éviter la duplication lors du premier déplacement
    const existingElements = document.querySelectorAll('.editor-element');
    for (let el of existingElements) {
      const elLeft = parseInt(el.style.left);
      const elTop = parseInt(el.style.top);
      // Si un élément existe déjà à moins de 10px de cette position, ne pas créer de nouvel élément
      if (Math.abs(elLeft - x) < 10 && Math.abs(elTop - y) < 10) {
        console.log('Élément déjà présent à cette position, annulation de la création');
        return null;
      }
    }
    
    const element = document.createElement('div');
    element.className = `editor-element ${type}-element`;
    element.dataset.type = type;
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.cursor = 'move';

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
        element.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Fond transparent par défaut
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
        break;
      case 'timer':
        element.innerHTML = '00:00';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '24px';
        element.style.padding = '8px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        element.style.color = '#ffffff';
        element.style.borderRadius = '4px';
        element.dataset.format = 'mm:ss'; // Format par défaut
        element.dataset.duration = '300'; // 5 minutes par défaut
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

  // Rendre un élément déplaçable
  function makeElementDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
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
    });
    element.style.outline = '2px solid #0066ff';
    
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
      if (bgColor) {
        bgColor.value = element.style.backgroundColor || 'rgba(0, 0, 0, 0)';
      }
      
      // Opacité du texte
      const textOpacity = document.getElementById('text-opacity');
      if (textOpacity) {
        const opacity = parseFloat(element.style.opacity) * 100 || 100;
        textOpacity.value = opacity;
        const opacityValue = textOpacity.nextElementSibling;
        if (opacityValue) opacityValue.textContent = `${opacity}%`;
      }
      
      // Alignement du texte
      const textAlign = document.getElementById('text-align');
      if (textAlign) {
        textAlign.value = element.style.textAlign || 'left';
      }
      
      // Gras
      const fontWeight = document.getElementById('font-weight');
      if (fontWeight) {
        fontWeight.checked = element.style.fontWeight === 'bold';
      }
      
      // Italique
      const fontStyle = document.getElementById('font-style');
      if (fontStyle) {
        fontStyle.checked = element.style.fontStyle === 'italic';
      }
      
      // Soulignement
      const textDecoration = document.getElementById('text-decoration');
      if (textDecoration) {
        textDecoration.checked = element.style.textDecoration === 'underline';
      }
      
      // Espacement des lettres
      const letterSpacing = document.getElementById('letter-spacing');
      if (letterSpacing) {
        const spacing = parseFloat(element.style.letterSpacing) || 0;
        letterSpacing.value = spacing;
        const spacingValue = letterSpacing.nextElementSibling;
        if (spacingValue) spacingValue.textContent = `${spacing}px`;
      }
      
      // Bordure
      const textBorder = document.getElementById('text-border');
      if (textBorder) {
        textBorder.value = element.style.border || 'none';
      }
    } else if (element.classList.contains('timer-element')) {
      const timerProperties = document.querySelector('.timer-properties');
      if (timerProperties) timerProperties.style.display = 'block';
      
      // Format du minuteur
      const timerFormat = document.getElementById('timer-format');
      if (timerFormat) {
        timerFormat.value = element.dataset.format || 'mm:ss';
      }
      
      // Durée du minuteur
      const timerDuration = document.getElementById('timer-duration');
      if (timerDuration) {
        timerDuration.value = element.dataset.duration || '300';
      }
      
      // Couleur du texte du minuteur
      const timerColor = document.getElementById('timer-color');
      if (timerColor) {
        timerColor.value = element.style.color || '#ffffff';
      }
      
      // Couleur de fond du minuteur
      const timerBgColor = document.getElementById('timer-bg-color');
      if (timerBgColor) {
        timerBgColor.value = element.style.backgroundColor || 'rgba(0, 0, 0, 0.7)';
      }
      
      // Taille de police du minuteur
      const timerFontSize = document.getElementById('timer-font-size');
      if (timerFontSize) {
        const size = parseInt(element.style.fontSize);
        timerFontSize.value = size || 24;
        const sizeValue = timerFontSize.nextElementSibling;
        if (sizeValue) sizeValue.textContent = `${size || 24}px`;
      }
      
      // Police du minuteur
      const timerFontFamily = document.getElementById('timer-font-family');
      if (timerFontFamily) {
        timerFontFamily.value = element.style.fontFamily.split(',')[0].replace(/['"]/g, '') || 'monospace';
      }
      
      // Bordure du minuteur
      const timerBorderRadius = document.getElementById('timer-border-radius');
      if (timerBorderRadius) {
        const radius = parseInt(element.style.borderRadius) || 4;
        timerBorderRadius.value = radius;
        const radiusValue = timerBorderRadius.nextElementSibling;
        if (radiusValue) radiusValue.textContent = `${radius}px`;
      }
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
    
    // Mise en forme du texte
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
      
      // Opacité du texte
      const textOpacity = document.getElementById('text-opacity');
      if (textOpacity) {
        textOpacity.oninput = () => {
          element.style.opacity = textOpacity.value / 100;
          const opacityValue = textOpacity.nextElementSibling;
          if (opacityValue) opacityValue.textContent = `${textOpacity.value}%`;
        };
      }
      
      // Alignement du texte
      const textAlign = document.getElementById('text-align');
      if (textAlign) {
        textAlign.onchange = () => {
          element.style.textAlign = textAlign.value;
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
      
      // Soulignement
      const textDecoration = document.getElementById('text-decoration');
      if (textDecoration) {
        textDecoration.onchange = () => {
          element.style.textDecoration = textDecoration.checked ? 'underline' : 'none';
        };
      }
      
      // Espacement des lettres
      const letterSpacing = document.getElementById('letter-spacing');
      if (letterSpacing) {
        letterSpacing.oninput = () => {
          element.style.letterSpacing = `${letterSpacing.value}px`;
          const spacingValue = letterSpacing.nextElementSibling;
          if (spacingValue) spacingValue.textContent = `${letterSpacing.value}px`;
        };
      }
      
      // Bordure
      const textBorder = document.getElementById('text-border');
      if (textBorder) {
        textBorder.onchange = () => {
          element.style.border = textBorder.value;
        };
      }
    }
    
    // Propriétés du minuteur
    if (element.classList.contains('timer-element')) {
      // Format du minuteur
      const timerFormat = document.getElementById('timer-format');
      if (timerFormat) {
        timerFormat.onchange = () => {
          element.dataset.format = timerFormat.value;
          // Mettre à jour l'affichage du minuteur selon le format
          updateTimerDisplay(element);
        };
      }
      
      // Durée du minuteur
      const timerDuration = document.getElementById('timer-duration');
      if (timerDuration) {
        timerDuration.onchange = () => {
          element.dataset.duration = timerDuration.value;
          // Mettre à jour l'affichage du minuteur
          updateTimerDisplay(element);
        };
      }
      
      // Couleur du texte du minuteur
      const timerColor = document.getElementById('timer-color');
      if (timerColor) {
        timerColor.oninput = () => {
          element.style.color = timerColor.value;
        };
      }
      
      // Couleur de fond du minuteur
      const timerBgColor = document.getElementById('timer-bg-color');
      if (timerBgColor) {
        timerBgColor.oninput = () => {
          element.style.backgroundColor = timerBgColor.value;
        };
      }
      
      // Taille de police du minuteur
      const timerFontSize = document.getElementById('timer-font-size');
      if (timerFontSize) {
        timerFontSize.oninput = () => {
          element.style.fontSize = `${timerFontSize.value}px`;
          const sizeValue = timerFontSize.nextElementSibling;
          if (sizeValue) sizeValue.textContent = `${timerFontSize.value}px`;
        };
      }
      
      // Police du minuteur
      const timerFontFamily = document.getElementById('timer-font-family');
      if (timerFontFamily) {
        timerFontFamily.onchange = () => {
          element.style.fontFamily = timerFontFamily.value;
        };
      }
      
      // Bordure du minuteur
      const timerBorderRadius = document.getElementById('timer-border-radius');
      if (timerBorderRadius) {
        timerBorderRadius.oninput = () => {
          element.style.borderRadius = `${timerBorderRadius.value}px`;
          const radiusValue = timerBorderRadius.nextElementSibling;
          if (radiusValue) radiusValue.textContent = `${timerBorderRadius.value}px`;
        };
      }
    }
    
    // Propriétés d'image
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
                // Créer une image temporaire pour obtenir les dimensions réelles
                const img = new Image();
                img.onload = () => {
                  // Définir la taille de l'élément à la taille réelle de l'image
                  element.style.width = `${img.width}px`;
                  element.style.height = `${img.height}px`;
                  
                  // Mettre à jour les champs de propriétés
                  if (document.getElementById('element-width')) {
                    document.getElementById('element-width').value = img.width;
                  }
                  if (document.getElementById('element-height')) {
                    document.getElementById('element-height').value = img.height;
                  }
                  
                  // Ajouter des poignées de redimensionnement
                  addResizeHandles(element);
                };
                img.src = e.target.result;
                
                // Appliquer l'image comme fond
                element.innerHTML = '';
                element.style.backgroundImage = `url(${e.target.result})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
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
    
    // Boutons d'avant-plan/arrière-plan
    const bringForward = document.getElementById('bring-forward');
    if (bringForward) {
      bringForward.onclick = () => {
        // Récupérer tous les éléments pour comparer les z-index
        const allElements = document.querySelectorAll('.editor-element');
        let maxZIndex = 0;
        
        // Trouver le z-index maximum actuel
        allElements.forEach(el => {
          const elZIndex = parseInt(el.style.zIndex || 0);
          if (elZIndex > maxZIndex) maxZIndex = elZIndex;
        });
        
        // Définir un z-index supérieur au maximum actuel
        element.style.zIndex = maxZIndex + 1;
        console.log('Élément avancé au z-index:', element.style.zIndex);
      };
    }
    
    const sendBackward = document.getElementById('send-backward');
    if (sendBackward) {
      sendBackward.onclick = () => {
        // Récupérer tous les éléments pour comparer les z-index
        const allElements = document.querySelectorAll('.editor-element');
        let minZIndex = 0;
        
        // Trouver le z-index minimum actuel (sauf 0)
        allElements.forEach(el => {
          if (el !== element) {
            const elZIndex = parseInt(el.style.zIndex || 0);
            if (elZIndex < minZIndex || minZIndex === 0) minZIndex = elZIndex;
          }
        });
        
        // Définir un z-index inférieur au minimum actuel, mais pas en dessous de 0
        element.style.zIndex = Math.max(0, minZIndex - 1);
        console.log('Élément reculé au z-index:', element.style.zIndex);
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
        if (descriptionInput) overlayData.description = descriptionInput.value;
        if (categorySelect) overlayData.category = categorySelect.value;
        if (publicCheckbox) overlayData.public = publicCheckbox.checked;
        
        // Sauvegarder l'overlay
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
              // Récupérer le token d'authentification
              const token = localStorage.getItem('twitch_token');
              if (!token) {
                alert('Vous devez être connecté pour générer une URL d\'overlay');
                return;
              }
              
              urlModal.style.display = 'flex';
              const baseUrl = window.location.origin;
              obsUrlInput.value = `${baseUrl}/overlay.html?id=${overlayData.id}&token=${token}`;
            }
          };
        }
        
        // Fermer le modal
        const saveModal = document.getElementById('save-modal');
        if (saveModal) {
          saveModal.style.display = 'none';
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
        });
        
        // Afficher le message "aucune sélection"
        const propertiesGroups = document.querySelectorAll('.properties-group');
        propertiesGroups.forEach(group => group.style.display = 'none');
        
        const noSelection = document.querySelector('.no-selection-message');
        if (noSelection) noSelection.style.display = 'block';
      }
    });
  }
  
  // Fonction pour ajouter des poignées de redimensionnement à un élément
  function addResizeHandles(element) {
    // Supprimer les poignées existantes si elles existent
    const existingHandles = element.querySelectorAll('.resize-handle');
    existingHandles.forEach(handle => handle.remove());
    
    // Positions des poignées (coins et milieux des côtés)
    const positions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    
    // Créer les poignées
    positions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-${pos}`;
      handle.style.position = 'absolute';
      handle.style.width = '10px';
      handle.style.height = '10px';
      handle.style.backgroundColor = '#0066ff';
      handle.style.borderRadius = '50%';
      handle.style.zIndex = '1000';
      handle.style.cursor = getCursorStyle(pos);
      
      // Positionner la poignée
      switch(pos) {
        case 'nw': // Nord-ouest (coin supérieur gauche)
          handle.style.top = '-5px';
          handle.style.left = '-5px';
          break;
        case 'n': // Nord (milieu supérieur)
          handle.style.top = '-5px';
          handle.style.left = 'calc(50% - 5px)';
          break;
        case 'ne': // Nord-est (coin supérieur droit)
          handle.style.top = '-5px';
          handle.style.right = '-5px';
          break;
        case 'e': // Est (milieu droit)
          handle.style.top = 'calc(50% - 5px)';
          handle.style.right = '-5px';
          break;
        case 'se': // Sud-est (coin inférieur droit)
          handle.style.bottom = '-5px';
          handle.style.right = '-5px';
          break;
        case 's': // Sud (milieu inférieur)
          handle.style.bottom = '-5px';
          handle.style.left = 'calc(50% - 5px)';
          break;
        case 'sw': // Sud-ouest (coin inférieur gauche)
          handle.style.bottom = '-5px';
          handle.style.left = '-5px';
          break;
        case 'w': // Ouest (milieu gauche)
          handle.style.top = 'calc(50% - 5px)';
          handle.style.left = '-5px';
          break;
      }
      
      // Ajouter l'événement de redimensionnement
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // Empêcher la propagation au parent
        e.preventDefault();
        
        // Position initiale de la souris
        const startX = e.clientX;
        const startY = e.clientY;
        
        // Dimensions et position initiales de l'élément
        const startWidth = element.offsetWidth;
        const startHeight = element.offsetHeight;
        const startLeft = element.offsetLeft;
        const startTop = element.offsetTop;
        
        // Fonction de redimensionnement
        function resize(e) {
          // Calculer le déplacement
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          
          // Appliquer le redimensionnement selon la position de la poignée
          switch(pos) {
            case 'nw': // Nord-ouest
              element.style.width = `${startWidth - dx}px`;
              element.style.height = `${startHeight - dy}px`;
              element.style.left = `${startLeft + dx}px`;
              element.style.top = `${startTop + dy}px`;
              break;
            case 'n': // Nord
              element.style.height = `${startHeight - dy}px`;
              element.style.top = `${startTop + dy}px`;
              break;
            case 'ne': // Nord-est
              element.style.width = `${startWidth + dx}px`;
              element.style.height = `${startHeight - dy}px`;
              element.style.top = `${startTop + dy}px`;
              break;
            case 'e': // Est
              element.style.width = `${startWidth + dx}px`;
              break;
            case 'se': // Sud-est
              element.style.width = `${startWidth + dx}px`;
              element.style.height = `${startHeight + dy}px`;
              break;
            case 's': // Sud
              element.style.height = `${startHeight + dy}px`;
              break;
            case 'sw': // Sud-ouest
              element.style.width = `${startWidth - dx}px`;
              element.style.height = `${startHeight + dy}px`;
              element.style.left = `${startLeft + dx}px`;
              break;
            case 'w': // Ouest
              element.style.width = `${startWidth - dx}px`;
              element.style.left = `${startLeft + dx}px`;
              break;
          }
          
          // Mettre à jour les champs de propriétés
          if (document.getElementById('element-width')) {
            document.getElementById('element-width').value = Math.round(element.offsetWidth);
          }
          if (document.getElementById('element-height')) {
            document.getElementById('element-height').value = Math.round(element.offsetHeight);
          }
          if (document.getElementById('position-x')) {
            document.getElementById('position-x').value = Math.round(element.offsetLeft);
          }
          if (document.getElementById('position-y')) {
            document.getElementById('position-y').value = Math.round(element.offsetTop);
          }
        }
        
        // Fonction pour arrêter le redimensionnement
        function stopResize() {
          document.removeEventListener('mousemove', resize);
          document.removeEventListener('mouseup', stopResize);
        }
        
        // Ajouter les écouteurs d'événements
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
      });
      
      // Ajouter la poignée à l'élément
      element.appendChild(handle);
    });
  }
  
  // Fonction pour obtenir le style de curseur en fonction de la position
  function getCursorStyle(position) {
    switch(position) {
      case 'nw': return 'nw-resize';
      case 'n': return 'n-resize';
      case 'ne': return 'ne-resize';
      case 'e': return 'e-resize';
      case 'se': return 'se-resize';
      case 's': return 's-resize';
      case 'sw': return 'sw-resize';
      case 'w': return 'w-resize';
      default: return 'move';
    }
  }
  
  // Fonction pour mettre à jour l'affichage du minuteur
  function updateTimerDisplay(element) {
    const format = element.dataset.format || 'mm:ss';
    const duration = parseInt(element.dataset.duration || '300');
    
    // Calculer les heures, minutes et secondes
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    // Formater l'affichage selon le format choisi
    let display = '';
    switch(format) {
      case 'hh:mm:ss':
        display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        break;
      case 'mm:ss':
        display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        break;
      case 'ss':
        display = `${duration.toString().padStart(2, '0')}`;
        break;
      case 'mm:ss.ms':
        display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.00`;
        break;
    }
    
    // Mettre à jour l'affichage
    element.innerText = display;
  }
});
