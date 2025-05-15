export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  twitchClientId: import.meta.env.VITE_TWITCH_CLIENT_ID,
  twitchRedirectUri: import.meta.env.VITE_TWITCH_REDIRECT_URI
}; 