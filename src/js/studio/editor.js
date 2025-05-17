
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
        element.style.borderRadius = '4px';
        break;
      case 'timer':
        element.innerHTML = '00:00';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '24px';
        element.style.padding = '8px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        element.style.color = '#ffffff';
        element.style.borderRadius = '4px';
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
      
      // Couleur
      const textColor = document.getElementById('text-color');
      if (textColor) textColor.value = element.style.color || '#ffffff';
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
      
      // Couleur
      const textColor = document.getElementById('text-color');
      if (textColor) {
        textColor.oninput = () => {
          element.style.color = textColor.value;
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
        const zIndex = parseInt(element.style.zIndex || 0);
        const maxZIndex = Math.max(...Array.from(document.querySelectorAll('.editor-element')).map(el => parseInt(el.style.zIndex || 0)));
        element.style.zIndex = maxZIndex + 1;
        showNotification('Élément déplacé vers l\'avant', 'success');
      };
    }
    
    const sendBackward = document.getElementById('send-backward');
    if (sendBackward) {
      sendBackward.onclick = () => {
        const zIndex = parseInt(element.style.zIndex || 0);
        const minZIndex = Math.min(...Array.from(document.querySelectorAll('.editor-element')).map(el => parseInt(el.style.zIndex || 0)));
        element.style.zIndex = Math.max(0, minZIndex - 1);
        showNotification('Élément déplacé vers l\'arrière', 'success');
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
              urlModal.style.display = 'flex';
              const baseUrl = window.location.origin;
              obsUrlInput.value = `${baseUrl}/overlay.html?id=${overlayData.id}`;
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
});
