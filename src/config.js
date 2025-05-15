const PROD_URL = 'https://apo-overlay.netlify.app';

export const config = {
  apiUrl: PROD_URL,
  appUrl: PROD_URL,
  twitchClientId: '6qdvxjxzwxjvxlm5ydkw9f6jg3xdw1',
  twitchRedirectUri: `${PROD_URL}/auth/callback`,
  twitchScopes: ['user:read:email', 'channel:read:subscriptions']
}; 