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
        element.style.padding = '10px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        element.style.borderRadius = '4px';
        break;
        
      case 'image':
        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';
        imageInput.style.display = 'none';
        
        element.appendChild(imageInput);
        element.innerHTML += '<div class="placeholder">Cliquez pour ajouter une image</div>';
        element.style.width = '200px';
        element.style.height = '150px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.color = '#ffffff';
        
        element.addEventListener('click', () => {
          imageInput.click();
        });
        
        imageInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                element.style.width = `${img.width}px`;
                element.style.height = `${img.height}px`;
                element.style.backgroundImage = `url(${e.target.result})`;
                element.style.backgroundSize = 'contain';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
                element.innerHTML = '';
              };
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
        
        // Ajout des poignées de redimensionnement
        const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
        handles.forEach(pos => {
          const handle = document.createElement('div');
          handle.className = `resize-handle ${pos}`;
          handle.style.position = 'absolute';
          handle.style.width = '10px';
          handle.style.height = '10px';
          handle.style.backgroundColor = '#fff';
          handle.style.border = '1px solid #000';
          handle.style.borderRadius = '50%';
          
          switch(pos) {
            case 'nw': handle.style.top = '-5px'; handle.style.left = '-5px'; break;
            case 'n': handle.style.top = '-5px'; handle.style.left = '50%'; handle.style.transform = 'translateX(-50%)'; break;
            case 'ne': handle.style.top = '-5px'; handle.style.right = '-5px'; break;
            case 'w': handle.style.left = '-5px'; handle.style.top = '50%'; handle.style.transform = 'translateY(-50%)'; break;
            case 'e': handle.style.right = '-5px'; handle.style.top = '50%'; handle.style.transform = 'translateY(-50%)'; break;
            case 'sw': handle.style.bottom = '-5px'; handle.style.left = '-5px'; break;
            case 's': handle.style.bottom = '-5px'; handle.style.left = '50%'; handle.style.transform = 'translateX(-50%)'; break;
            case 'se': handle.style.bottom = '-5px'; handle.style.right = '-5px'; break;
          }
          
          element.appendChild(handle);
        });
        break;
        
      case 'timer':
        element.innerHTML = '00:00';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '24px';
        element.style.padding = '10px 20px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        element.style.color = '#ffffff';
        element.style.borderRadius = '4px';
        element.dataset.format = 'mm:ss';
        element.dataset.duration = '300'; // 5 minutes par défaut
        break;
    }

    // Rendre l'élément déplaçable et redimensionnable
    makeElementDraggable(element);
    makeElementResizable(element);

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
    let isDragging = false;

    element.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
      if (e.target !== element && (e.target.contentEditable === 'true' || e.target.classList.contains('resize-handle'))) {
        return;
      }
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      isDragging = true;
      document.addEventListener('mousemove', elementDrag);
      document.addEventListener('mouseup', closeDragElement);
      
      selectElement(element);
    }

    function elementDrag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      element.style.top = `${element.offsetTop - pos2}px`;
      element.style.left = `${element.offsetLeft - pos1}px`;
      
      updatePropertyFields(element);
    }

    function closeDragElement() {
      isDragging = false;
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
    }
  }

  // Rendre un élément redimensionnable
  function makeElementResizable(element) {
    const handles = element.querySelectorAll('.resize-handle');
    
    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = element.offsetWidth;
        const startHeight = element.offsetHeight;
        const handleClass = Array.from(handle.classList)
          .find(className => ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].includes(className));
        
        function handleResize(e) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          
          switch(handleClass) {
            case 'se':
              element.style.width = `${startWidth + deltaX}px`;
              element.style.height = `${startHeight + deltaY}px`;
              break;
            case 'sw':
              element.style.width = `${startWidth - deltaX}px`;
              element.style.height = `${startHeight + deltaY}px`;
              element.style.left = `${element.offsetLeft + deltaX}px`;
              break;
            case 'ne':
              element.style.width = `${startWidth + deltaX}px`;
              element.style.height = `${startHeight - deltaY}px`;
              element.style.top = `${element.offsetTop + deltaY}px`;
              break;
            case 'nw':
              element.style.width = `${startWidth - deltaX}px`;
              element.style.height = `${startHeight - deltaY}px`;
              element.style.top = `${element.offsetTop + deltaY}px`;
              element.style.left = `${element.offsetLeft + deltaX}px`;
              break;
            case 'n':
              element.style.height = `${startHeight - deltaY}px`;
              element.style.top = `${element.offsetTop + deltaY}px`;
              break;
            case 's':
              element.style.height = `${startHeight + deltaY}px`;
              break;
            case 'e':
              element.style.width = `${startWidth + deltaX}px`;
              break;
            case 'w':
              element.style.width = `${startWidth - deltaX}px`;
              element.style.left = `${element.offsetLeft + deltaX}px`;
              break;
          }
          
          updatePropertyFields(element);
        }
        
        function stopResize() {
          window.removeEventListener('mousemove', handleResize);
          window.removeEventListener('mouseup', stopResize);
        }
        
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', stopResize);
      });
    });
  }

  // Sélection d'un élément
  function selectElement(element) {
    const elements = document.querySelectorAll('.editor-element');
    elements.forEach(el => {
      el.classList.remove('selected');
      el.style.outline = 'none';
    });
    
    element.classList.add('selected');
    element.style.outline = '2px solid var(--primary-color)';
    
    showElementProperties(element);
  }

  // Afficher les propriétés d'un élément
  function showElementProperties(element) {
    const propertiesGroups = document.querySelectorAll('.properties-group');
    const noSelection = document.querySelector('.no-selection-message');

    propertiesGroups.forEach(group => group.style.display = 'none');
    if (noSelection) noSelection.style.display = 'none';

    if (element.classList.contains('text-element')) {
      const textProperties = document.querySelector('.text-properties');
      if (textProperties) {
        textProperties.style.display = 'block';
        
        // Mettre à jour les champs
        const textContent = document.getElementById('text-content');
        const fontFamily = document.getElementById('font-family');
        const fontSize = document.getElementById('font-size');
        const textColor = document.getElementById('text-color');
        const bgColor = document.getElementById('text-bg-color');
        
        if (textContent) textContent.value = element.innerText;
        if (fontFamily) fontFamily.value = element.style.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Montserrat';
        if (fontSize) {
          const size = parseInt(element.style.fontSize);
          fontSize.value = size || 24;
          fontSize.nextElementSibling.textContent = `${size || 24}px`;
        }
        if (textColor) textColor.value = element.style.color || '#ffffff';
        if (bgColor) bgColor.value = element.style.backgroundColor || '#000000';
      }
    } else if (element.classList.contains('timer-element')) {
      const timerProperties = document.querySelector('.timer-properties');
      if (timerProperties) {
        timerProperties.style.display = 'block';
        
        // Mettre à jour les champs
        const timerFormat = document.getElementById('timer-format');
        const timerDuration = document.getElementById('timer-duration');
        const timerColor = document.getElementById('timer-color');
        const timerBgColor = document.getElementById('timer-bg-color');
        const timerSize = document.getElementById('timer-size');
        
        if (timerFormat) timerFormat.value = element.dataset.format || 'mm:ss';
        if (timerDuration) timerDuration.value = element.dataset.duration || '300';
        if (timerColor) timerColor.value = element.style.color || '#ffffff';
        if (timerBgColor) timerBgColor.value = element.style.backgroundColor || '#000000';
        if (timerSize) {
          const size = parseInt(element.style.fontSize);
          timerSize.value = size || 24;
          timerSize.nextElementSibling.textContent = `${size || 24}px`;
        }
      }
    }

    // Propriétés communes
    const commonProperties = document.querySelector('.common-properties');
    if (commonProperties) {
      commonProperties.style.display = 'block';
      updatePropertyFields(element);
    }
  }

  // Mettre à jour les champs de propriétés
  function updatePropertyFields(element) {
    const posX = document.getElementById('position-x');
    const posY = document.getElementById('position-y');
    const width = document.getElementById('element-width');
    const height = document.getElementById('element-height');
    const rotation = document.getElementById('element-rotation');
    
    if (posX) posX.value = Math.round(element.offsetLeft);
    if (posY) posY.value = Math.round(element.offsetTop);
    if (width) width.value = Math.round(element.offsetWidth);
    if (height) height.value = Math.round(element.offsetHeight);
    if (rotation) {
      const transform = element.style.transform;
      const angle = transform ? parseInt(transform.match(/rotate\((-?\d+)deg\)/) ?.[1] || 0) : 0;
      rotation.value = angle;
      rotation.nextElementSibling.textContent = `${angle}°`;
    }
  }

  // Configuration des événements pour les propriétés
  function setupPropertyEvents(element) {
    // Position et taille
    const posX = document.getElementById('position-x');
    const posY = document.getElementById('position-y');
    const width = document.getElementById('element-width');
    const height = document.getElementById('element-height');
    const rotation = document.getElementById('element-rotation');
    
    if (posX) posX.onchange = () => {
      element.style.left = `${posX.value}px`;
    };
    
    if (posY) posY.onchange = () => {
      element.style.top = `${posY.value}px`;
    };
    
    if (width) width.onchange = () => {
      element.style.width = `${width.value}px`;
    };
    
    if (height) height.onchange = () => {
      element.style.height = `${height.value}px`;
    };
    
    if (rotation) rotation.oninput = () => {
      element.style.transform = `rotate(${rotation.value}deg)`;
      rotation.nextElementSibling.textContent = `${rotation.value}°`;
    };

    // Propriétés de texte
    if (element.classList.contains('text-element')) {
      const textContent = document.getElementById('text-content');
      const fontFamily = document.getElementById('font-family');
      const fontSize = document.getElementById('font-size');
      const textColor = document.getElementById('text-color');
      const bgColor = document.getElementById('text-bg-color');
      const textBold = document.getElementById('text-bold');
      const textItalic = document.getElementById('text-italic');
      
      if (textContent) textContent.onchange = () => {
        element.innerText = textContent.value;
      };
      
      if (fontFamily) fontFamily.onchange = () => {
        element.style.fontFamily = fontFamily.value;
      };
      
      if (fontSize) fontSize.oninput = () => {
        element.style.fontSize = `${fontSize.value}px`;
        fontSize.nextElementSibling.textContent = `${fontSize.value}px`;
      };
      
      if (textColor) textColor.oninput = () => {
        element.style.color = textColor.value;
      };
      
      if (bgColor) bgColor.oninput = () => {
        element.style.backgroundColor = bgColor.value;
      };
      
      if (textBold) textBold.onclick = () => {
        element.style.fontWeight = element.style.fontWeight === 'bold' ? 'normal' : 'bold';
        textBold.classList.toggle('active');
      };
      
      if (textItalic) textItalic.onclick = () => {
        element.style.fontStyle = element.style.fontStyle === 'italic' ? 'normal' : 'italic';
        textItalic.classList.toggle('active');
      };
    }

    // Propriétés du timer
    if (element.classList.contains('timer-element')) {
      const timerFormat = document.getElementById('timer-format');
      const timerDuration = document.getElementById('timer-duration');
      const timerColor = document.getElementById('timer-color');
      const timerBgColor = document.getElementById('timer-bg-color');
      const timerSize = document.getElementById('timer-size');
      
      if (timerFormat) timerFormat.onchange = () => {
        element.dataset.format = timerFormat.value;
        updateTimerDisplay(element);
      };
      
      if (timerDuration) timerDuration.onchange = () => {
        element.dataset.duration = timerDuration.value;
        updateTimerDisplay(element);
      };
      
      if (timerColor) timerColor.oninput = () => {
        element.style.color = timerColor.value;
      };
      
      if (timerBgColor) timerBgColor.oninput = () => {
        element.style.backgroundColor = timerBgColor.value;
      };
      
      if (timerSize) timerSize.oninput = () => {
        element.style.fontSize = `${timerSize.value}px`;
        timerSize.nextElementSibling.textContent = `${timerSize.value}px`;
      };
    }

    // Boutons d'avant-plan/arrière-plan
    const bringForward = document.getElementById('bring-forward');
    const sendBackward = document.getElementById('send-backward');
    
    if (bringForward) {
      bringForward.onclick = () => {
        const zIndex = parseInt(element.style.zIndex || 0);
        element.style.zIndex = zIndex + 1;
      };
    }
    
    if (sendBackward) {
      sendBackward.onclick = () => {
        const zIndex = parseInt(element.style.zIndex || 0);
        element.style.zIndex = Math.max(0, zIndex - 1);
      };
    }

    // Suppression d'élément
    const deleteBtn = document.getElementById('delete-element');
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        element.remove();
        
        const propertiesGroups = document.querySelectorAll('.properties-group');
        propertiesGroups.forEach(group => group.style.display = 'none');
        
        const noSelection = document.querySelector('.no-selection-message');
        if (noSelection) noSelection.style.display = 'block';
      };
    }
  }

  // Mise à jour de l'affichage du timer
  function updateTimerDisplay(element) {
    const format = element.dataset.format;
    const duration = parseInt(element.dataset.duration);
    
    let display = '00:00';
    
    switch(format) {
      case 'hh:mm:ss':
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        break;
      case 'mm:ss':
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        break;
      case 'ss':
        display = duration.toString().padStart(2, '0');
        break;
    }
    
    element.innerText = display;
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
        const elements = document.querySelectorAll('.editor-element');
        elements.forEach(el => {
          el.classList.remove('selected');
          el.style.outline = 'none';
        });
        
        const propertiesGroups = document.querySelectorAll('.properties-group');
        propertiesGroups.forEach(group => group.style.display = 'none');
        
        const noSelection = document.querySelector('.no-selection-message');
        if (noSelection) noSelection.style.display = 'block';
      }
    });
  }
});