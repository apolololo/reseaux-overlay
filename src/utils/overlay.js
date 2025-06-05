import { UI_CONFIG } from '../config/constants.js';

export function generateOverlayToken(overlayPath, userData) {
  const tokenData = {
    userId: userData?.id || 'anonymous',
    overlayPath,
    twitchData: {
      token: localStorage.getItem('twitch_token'),
      user: userData
    },
    timestamp: Date.now()
  };
  
  return btoa(JSON.stringify(tokenData));
}

export function getOverlayUrl(overlayPath, config = {}) {
  const userData = JSON.parse(localStorage.getItem('twitch_user') || '{}');
  const token = generateOverlayToken(overlayPath, userData);
  
  const url = new URL(overlayPath, window.location.origin);
  url.searchParams.set('token', token);
  
  Object.entries(config).forEach(([key, value]) => {
    url.searchParams.set(key, value.toString());
  });
  
  return url.toString();
}