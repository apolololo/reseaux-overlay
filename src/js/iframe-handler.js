// Function to ensure iframe content is visible
function ensureIframeContent() {
  // Execute this script in the iframe context
  try {
    const creatorElements = document.querySelectorAll('.creator-code, .creator-box');
    
    creatorElements.forEach(element => {
      if (element) {
        // Force visibility
        element.style.setProperty('visibility', 'visible', 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('display', 'flex', 'important');
        
        // Ensure all children are visible
        const children = element.querySelectorAll('*');
        children.forEach(child => {
          child.style.setProperty('visibility', 'visible', 'important');
          child.style.setProperty('opacity', '1', 'important');
          child.style.setProperty('display', 'inline-block', 'important');
        });
      }
    });
  } catch (error) {
    console.error('Error in iframe content handler:', error);
  }
}

// Export for use in other files
export { ensureIframeContent };
