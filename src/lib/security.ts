
/**
 * Security utilities to protect website content
 */

// Disable right-click context menu
export const disableContextMenu = () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};

// Disable text selection
export const disableTextSelection = () => {
  document.body.style.userSelect = 'none';
  // Apply vendor prefixes using proper TypeScript approach
  const bodyStyle = document.body.style as any;
  if (bodyStyle.webkitUserSelect !== undefined) bodyStyle.webkitUserSelect = 'none';
  if (bodyStyle.msUserSelect !== undefined) bodyStyle.msUserSelect = 'none';
  if (bodyStyle.mozUserSelect !== undefined) bodyStyle.mozUserSelect = 'none';
};

// Disable image dragging
export const disableImageDragging = () => {
  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
    }
  });
};

// Comprehensive keyboard shortcuts blocking
export const disableKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Block browser dev tools shortcuts
    if (
      // Common dev tools shortcuts
      (e.key === 'F12') ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.shiftKey && e.key === 'C') ||
      (e.ctrlKey && e.key === 'u') ||
      // Save shortcuts
      (e.ctrlKey && e.key === 's') ||
      // Print shortcuts
      (e.ctrlKey && e.key === 'p') ||
      // View source shortcuts
      (e.ctrlKey && e.key === 'u') ||
      // Firefox shortcuts
      (e.ctrlKey && e.shiftKey && e.key === 'K') ||
      // Safari shortcuts
      (e.metaKey && e.altKey && e.key === 'i') ||
      (e.metaKey && e.altKey && e.key === 'u') ||
      (e.metaKey && e.altKey && e.key === 'c')
    ) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });
};

// Add overlay div to prevent iframe embedding
export const preventFrameEmbedding = () => {
  if (window.self !== window.top) {
    // If page is loaded in an iframe
    window.top.location = window.self.location;
  }
};

// Enhanced dev tools detection
export const deterDevTools = () => {
  // Make it harder to use devtools
  const devToolsDetection = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    const devtoolsOpen = widthThreshold || heightThreshold;
    
    if (devtoolsOpen) {
      document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#080810;color:white;font-family:sans-serif;"><div style="text-align:center;"><h1>Accès interdit</h1><p>Les outils de développement ne sont pas autorisés sur ce site.</p><p>Veuillez les fermer pour continuer votre navigation.</p></div></div>';
    }
    
    return devtoolsOpen;
  };

  // Execute detection every 1s
  setInterval(devToolsDetection, 1000);
  
  // Additional detection for Firebug and console
  const checkConsole = () => {
    const before = new Date().getTime();
    debugger;
    const after = new Date().getTime();
    if (after - before > 100) {
      document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#080810;color:white;font-family:sans-serif;"><div style="text-align:center;"><h1>Accès interdit</h1><p>Les outils de développement ne sont pas autorisés sur ce site.</p><p>Veuillez les fermer pour continuer votre navigation.</p></div></div>';
    }
  };
  
  // Check periodically
  setInterval(checkConsole, 1000);
};

// Anti-adblock detection (basic implementation)
export const detectAdBlocker = () => {
  // Create a bait element that ad blockers might hide
  const bait = document.createElement('div');
  bait.className = 'ads ad adsbox doubleclick ad-placement carbon-ads';
  bait.style.height = '1px';
  bait.style.width = '1px';
  bait.style.position = 'absolute';
  bait.style.top = '-10000px';
  bait.style.left = '-10000px';
  document.body.appendChild(bait);

  // Check if the bait was hidden (potential ad blocker)
  setTimeout(() => {
    if (bait.offsetHeight === 0 || bait.offsetWidth === 0 || bait.clientHeight === 0) {
      console.log('Ad blocker detected');
      // You can show a message or take action here
      // displayAdBlockerMessage();
    }
    document.body.removeChild(bait);
  }, 100);
};

// Main function to apply all security measures
export const applySecurityMeasures = (options: {
  disableRightClick: boolean;
  disableSelection: boolean;
  disableDragging: boolean;
  disableShortcuts: boolean;
  preventEmbedding: boolean;
  deter: boolean;
  detectAdBlock: boolean;
}) => {
  if (options.disableRightClick) disableContextMenu();
  if (options.disableSelection) disableTextSelection();
  if (options.disableDragging) disableImageDragging();
  if (options.disableShortcuts) disableKeyboardShortcuts();
  if (options.preventEmbedding) preventFrameEmbedding();
  if (options.deter) deterDevTools();
  if (options.detectAdBlock) detectAdBlocker();
};
