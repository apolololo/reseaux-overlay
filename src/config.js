const PROD_URL = 'https://apo-overlay.netlify.app';

export const config = {
  apiUrl: PROD_URL,
  appUrl: PROD_URL,
  twitchClientId: 'gp762nuuoqcoxypju8c569th9wz7q5',
  twitchRedirectUri: `${PROD_URL}/auth/callback`,
  twitchScopes: ['user:read:email', 'channel:read:subscriptions']
}; 