/**
 * Script des modèles d'overlays
 * Gère l'affichage et l'utilisation des modèles prédéfinis
 */

document.addEventListener('DOMContentLoaded', () => {
  // Éléments du DOM
  const templatesView = document.getElementById('templates-view');
  const templatesGrid = templatesView.querySelector('.templates-grid');
  const filterButtons = templatesView.querySelectorAll('.filter-btn');
  
  // Filtrer les modèles
  const filterTemplates = (category) => {
    const templateCards = templatesGrid.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
      if (category === 'all' || card.dataset.type === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };
  
  // Utiliser un modèle
  const useTemplate = (templateType) => {
    // Charger le modèle dans l'éditeur
    let templateData;
    
    switch (templateType) {
      case 'starting-1':
        templateData = getStartingTemplate();
        break;
        
      case 'brb-1':
        templateData = getBrbTemplate();
        break;
        
      case 'ending-1':
        templateData = getEndingTemplate();
        break;
        
      case 'social-1':
        templateData = getSocialTemplate();
        break;
        
      case 'gaming-1':
        templateData = getGamingTemplate();
        break;
        
      case 'gaming-2':
        templateData = getFortniteTemplate();
        break;
        
      default:
        templateData = getEmptyTemplate();
    }
    
    // Charger le modèle dans l'éditeur
    window.loadOverlay(templateData);
    
    // Changer de vue
    document.querySelector('.nav-btn[data-view="editor"]').click();
  };
  
  // Modèle "Starting Soon"
  const getStartingTemplate = () => {
    return {
      id: null,
      name: 'Starting Soon - Modern',
      canvas: {
        width: 1920,
        height: 1080
      },
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: 'shape',
          properties: {
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: `element-${Date.now()}-2`,
          type: 'text',
          properties: {
            left: 710,
            top: 300,
            width: 500,
            height: 100,
            text: 'STREAM COMMENCE BIENTÔT',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '36px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-3`,
          type: 'timer',
          properties: {
            left: 710,
            top: 400,
            width: 500,
            height: 150,
            time: '05:00',
            color: '#6c5ce7',
            fontFamily: 'Montserrat',
            fontSize: '72px',
            fontWeight: 'bold'
          }
        },
        {
          id: `element-${Date.now()}-4`,
          type: 'text',
          properties: {
            left: 710,
            top: 550,
            width: 500,
            height: 50,
            text: 'Préparez-vous pour le stream !',
            color: '#a0a0a7',
            fontFamily: 'Montserrat',
            fontSize: '20px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-5`,
          type: 'creator-code',
          properties: {
            left: 810,
            top: 650,
            width: 300,
            height: 50,
            code: 'APO21',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '14px'
          }
        }
      ]
    };
  };
  
  // Modèle "Be Right Back"
  const getBrbTemplate = () => {
    return {
      id: null,
      name: 'Be Right Back - Minimal',
      canvas: {
        width: 1920,
        height: 1080
      },
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: 'shape',
          properties: {
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: `element-${Date.now()}-2`,
          type: 'text',
          properties: {
            left: 710,
            top: 400,
            width: 500,
            height: 100,
            text: 'JE REVIENS DANS UN INSTANT',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '36px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-3`,
          type: 'text',
          properties: {
            left: 710,
            top: 500,
            width: 500,
            height: 50,
            text: 'Petite pause en cours...',
            color: '#a0a0a7',
            fontFamily: 'Montserrat',
            fontSize: '20px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-4`,
          type: 'creator-code',
          properties: {
            left: 810,
            top: 600,
            width: 300,
            height: 50,
            code: 'APO21',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '14px'
          }
        }
      ]
    };
  };
  
  // Modèle "Stream Ending"
  const getEndingTemplate = () => {
    return {
      id: null,
      name: 'Stream Ending - Social',
      canvas: {
        width: 1920,
        height: 1080
      },
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: 'shape',
          properties: {
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: `element-${Date.now()}-2`,
          type: 'text',
          properties: {
            left: 710,
            top: 300,
            width: 500,
            height: 100,
            text: 'FIN DU STREAM',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '48px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-3`,
          type: 'text',
          properties: {
            left: 710,
            top: 400,
            width: 500,
            height: 50,
            text: 'Merci d\'avoir suivi le live !',
            color: '#a0a0a7',
            fontFamily: 'Montserrat',
            fontSize: '24px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-4`,
          type: 'social',
          properties: {
            left: 810,
            top: 500,
            width: 300,
            height: 40,
            username: '@tryh_apo',
            icon: '../../images/twitch.png',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px'
          }
        },
        {
          id: `element-${Date.now()}-5`,
          type: 'social',
          properties: {
            left: 810,
            top: 550,
            width: 300,
            height: 40,
            username: '@apoftn1',
            icon: '../../images/x.png',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px'
          }
        },
        {
          id: `element-${Date.now()}-6`,
          type: 'social',
          properties: {
            left: 810,
            top: 600,
            width: 300,
            height: 40,
            username: '@tryhapo',
            icon: '../../images/youtube.png',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px'
          }
        },
        {
          id: `element-${Date.now()}-7`,
          type: 'creator-code',
          properties: {
            left: 810,
            top: 700,
            width: 300,
            height: 50,
            code: 'APO21',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '14px'
          }
        }
      ]
    };
  };
  
  // Modèle "Social Media Bar"
  const getSocialTemplate = () => {
    return {
      id: null,
      name: 'Social Media Bar',
      canvas: {
        width: 1920,
        height: 150
      },
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: 'shape',
          properties: {
            left: 0,
            top: 0,
            width: 1920,
            height: 150,
            backgroundColor: 'rgba(30, 30, 46, 0.8)',
            borderRadius: '0px',
            border: 'none'
          }
        },
        {
          id: `element-${Date.now()}-2`,
          type: 'social',
          properties: {
            left: 50,
            top: 55,
            width: 200,
            height: 40,
            username: '@tryh_apo',
            icon: '../../images/twitch.png',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px'
          }
        },
        {
          id: `element-${Date.now()}-3`,
          type: 'social',
          properties: {
            left: 300,
            top: 55,
            width: 200,
            height: 40,
            username: '@apoftn1',
            icon: '../../images/x.png',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px'
          }
        },
        {
          id: `element-${Date.now()}-4`,
          type: 'social',
          properties: {
            left: 550,
            top: 55,
            width: 200,
            height: 40,
            username: '@tryhapo',
            icon: '../../images/youtube.png',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px'
          }
        },
        {
          id: `element-${Date.now()}-5`,
          type: 'creator-code',
          properties: {
            left: 1600,
            top: 50,
            width: 250,
            height: 50,
            code: 'APO21',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '14px'
          }
        }
      ]
    };
  };
  
  // Modèle "Gaming HUD"
  const getGamingTemplate = () => {
    return {
      id: null,
      name: 'Gaming HUD',
      canvas: {
        width: 1920,
        height: 1080
      },
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: 'shape',
          properties: {
            left: 50,
            top: 50,
            width: 400,
            height: 100,
            backgroundColor: 'rgba(30, 30, 46, 0.8)',
            borderRadius: '10px',
            border: '2px solid #6c5ce7'
          }
        },
        {
          id: `element-${Date.now()}-2`,
          type: 'text',
          properties: {
            left: 160,
            top: 75,
            width: 280,
            height: 50,
            text: 'APO',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '36px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-3`,
          type: 'shape',
          properties: {
            left: 50,
            top: 170,
            width: 400,
            height: 200,
            backgroundColor: 'rgba(30, 30, 46, 0.8)',
            borderRadius: '10px',
            border: '2px solid #6c5ce7'
          }
        },
        {
          id: `element-${Date.now()}-4`,
          type: 'text',
          properties: {
            left: 70,
            top: 190,
            width: 360,
            height: 40,
            text: 'STATISTIQUES',
            color: '#6c5ce7',
            fontFamily: 'Montserrat',
            fontSize: '24px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-5`,
          type: 'text',
          properties: {
            left: 70,
            top: 240,
            width: 180,
            height: 30,
            text: 'Kills:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-6`,
          type: 'text',
          properties: {
            left: 250,
            top: 240,
            width: 180,
            height: 30,
            text: '0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-7`,
          type: 'text',
          properties: {
            left: 70,
            top: 280,
            width: 180,
            height: 30,
            text: 'Victoires:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-8`,
          type: 'text',
          properties: {
            left: 250,
            top: 280,
            width: 180,
            height: 30,
            text: '0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-9`,
          type: 'text',
          properties: {
            left: 70,
            top: 320,
            width: 180,
            height: 30,
            text: 'Temps de jeu:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-10`,
          type: 'text',
          properties: {
            left: 250,
            top: 320,
            width: 180,
            height: 30,
            text: '00:00:00',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-11`,
          type: 'creator-code',
          properties: {
            left: 1550,
            top: 980,
            width: 300,
            height: 50,
            code: 'APO21',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '14px'
          }
        }
      ]
    };
  };
  
  // Modèle "Fortnite Stats"
  const getFortniteTemplate = () => {
    return {
      id: null,
      name: 'Fortnite Stats',
      canvas: {
        width: 500,
        height: 300
      },
      elements: [
        {
          id: `element-${Date.now()}-1`,
          type: 'shape',
          properties: {
            left: 0,
            top: 0,
            width: 500,
            height: 300,
            backgroundColor: 'rgba(30, 30, 46, 0.8)',
            borderRadius: '10px',
            border: '2px solid #6c5ce7'
          }
        },
        {
          id: `element-${Date.now()}-2`,
          type: 'text',
          properties: {
            left: 20,
            top: 20,
            width: 460,
            height: 40,
            text: 'FORTNITE STATS',
            color: '#6c5ce7',
            fontFamily: 'Montserrat',
            fontSize: '24px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center'
          }
        },
        {
          id: `element-${Date.now()}-3`,
          type: 'text',
          properties: {
            left: 20,
            top: 80,
            width: 200,
            height: 30,
            text: 'Kills:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-4`,
          type: 'text',
          properties: {
            left: 280,
            top: 80,
            width: 200,
            height: 30,
            text: '0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-5`,
          type: 'text',
          properties: {
            left: 20,
            top: 120,
            width: 200,
            height: 30,
            text: 'Victoires:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-6`,
          type: 'text',
          properties: {
            left: 280,
            top: 120,
            width: 200,
            height: 30,
            text: '0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-7`,
          type: 'text',
          properties: {
            left: 20,
            top: 160,
            width: 200,
            height: 30,
            text: 'K/D Ratio:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-8`,
          type: 'text',
          properties: {
            left: 280,
            top: 160,
            width: 200,
            height: 30,
            text: '0.0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-9`,
          type: 'text',
          properties: {
            left: 20,
            top: 200,
            width: 200,
            height: 30,
            text: 'Parties jouées:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-10`,
          type: 'text',
          properties: {
            left: 280,
            top: 200,
            width: 200,
            height: 30,
            text: '0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        },
        {
          id: `element-${Date.now()}-11`,
          type: 'text',
          properties: {
            left: 20,
            top: 240,
            width: 200,
            height: 30,
            text: 'Top 10:',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left'
          }
        },
        {
          id: `element-${Date.now()}-12`,
          type: 'text',
          properties: {
            left: 280,
            top: 240,
            width: 200,
            height: 30,
            text: '0',
            color: '#ffffff',
            fontFamily: 'Montserrat',
            fontSize: '18px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'right'
          }
        }
      ]
    };
  };
  
  // Modèle vide
  const getEmptyTemplate = () => {
    return {
      id: null,
      name: 'Nouvel overlay',
      canvas: {
        width: 1920,
        height: 1080
      },
      elements: []
    };
  };
  
  // Initialiser les gestionnaires d'événements
  const initEventListeners = () => {
    // Filtrage des modèles
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Mettre à jour les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filtrer les modèles
        filterTemplates(button.dataset.filter);
      });
    });
    
    // Utilisation des modèles
    const useTemplateButtons = templatesView.querySelectorAll('.use-template-btn');
    useTemplateButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Déterminer le type de modèle
        let templateType;
        
        switch (index) {
          case 0:
            templateType = 'starting-1';
            break;
          case 1:
            templateType = 'brb-1';
            break;
          case 2:
            templateType = 'ending-1';
            break;
          case 3:
            templateType = 'social-1';
            break;
          case 4:
            templateType = 'gaming-1';
            break;
          case 5:
            templateType = 'gaming-2';
            break;
          default:
            templateType = 'empty';
        }
        
        // Utiliser le modèle
        useTemplate(templateType);
      });
    });
  };
  
  // Initialiser les modèles
  initEventListeners();
});