
/**
 * Utilitaires pour les overlays
 */

// Valider que l'overlay est correctement accédé
export const validateOverlayAccess = () => {
  // Vérifier si on est dans un iframe (accès normal via token)
  const isInIframe = window !== window.top;
  
  // Vérifier si on a un paramètre de token valide
  const hasValidToken = () => {
    const params = new URLSearchParams(window.location.search);
    return params.has('token');
  };
  
  // Accès valide si dans iframe ou avec token
  return isInIframe || hasValidToken();
};

// Obtenir un paramètre d'URL
export const getUrlParam = (name, defaultValue = null) => {
  const params = new URLSearchParams(window.location.search);
  return params.has(name) ? params.get(name) : defaultValue;
};

// Valider le token d'overlay
export const validateToken = (token) => {
  try {
    const decodedData = atob(token);
    return decodedData.indexOf('-') !== -1;
  } catch (e) {
    return false;
  }
};
