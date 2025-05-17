
/**
 * Module de modèles pour le Studio
 * Gère l'affichage et l'interaction avec les modèles d'overlays
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Modèles chargés');
  
  // Initialiser les modèles
  const initTemplates = () => {
    console.log('Initialisation des modèles');
    
    // Gérer les filtres de modèles
    const filterButtons = document.querySelectorAll('.templates-filter .filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Mettre à jour les boutons de filtre
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        // Filtrer les modèles
        const templates = document.querySelectorAll('.template-card');
        templates.forEach(template => {
          if (filter === 'all' || template.dataset.type === filter) {
            template.style.display = 'block';
          } else {
            template.style.display = 'none';
          }
        });
      });
    });
    
    // Gérer l'utilisation des modèles
    const useTemplateButtons = document.querySelectorAll('.use-template-btn');
    
    useTemplateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const templateCard = btn.closest('.template-card');
        const templateType = templateCard?.dataset.type || 'unknown';
        
        console.log(`Utilisation du modèle: ${templateType}`);
        
        // Passer à l'éditeur avec le modèle sélectionné
        const event = new CustomEvent('viewChanged', { detail: { view: 'editor' } });
        document.dispatchEvent(event);
        
        // Mettre à jour les boutons de navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.view === 'editor');
        });
        
        // Afficher la vue de l'éditeur
        document.getElementById('editor-view').classList.remove('hidden');
        document.getElementById('templates-view').classList.add('hidden');
        
        // Notification temporaire
        alert(`Le modèle "${templateType}" sera appliqué dans une prochaine version.`);
      });
    });
  };
  
  // Attendre que la vue des modèles soit visible
  document.addEventListener('viewChanged', (event) => {
    if (event.detail.view === 'templates') {
      initTemplates();
    }
  });
});
