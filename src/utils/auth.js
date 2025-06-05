import { TWITCH_CLIENT_ID, REDIRECT_URI } from '../config/constants.js';

export function initAuth() {
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('twitch_auth_state', state);
  
  const scope = 'user:read:email channel:read:subscriptions moderator:read:followers';
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&force_verify=true`;
  
  return authUrl;
}

export function checkAuth() {
  const token = localStorage.getItem('twitch_token');
  const expiresAt = localStorage.getItem('twitch_expires_at');
  
  if (!token || !expiresAt || Date.now() >= parseInt(expiresAt)) {
    return false;
  }
  
  return true;
}

export function logout() {
  localStorage.clear();
  window.location.href = '/src/auth.html';
}

export function getAuthToken() {
  return localStorage.getItem('twitch_token');
}

export function getUserData() {
  const userData = localStorage.getItem('twitch_user');
  return userData ? JSON.parse(userData) : null;
}