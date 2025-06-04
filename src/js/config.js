export const config = {
  twitch: {
    clientId: "z8q1w4g12yrql6cyb5zzwmhe1pnxyn",
    redirectUri: "https://apo-overlay.netlify.app/auth/callback.html",
    scopes: [
      'user:read:email',
      'channel:read:subscriptions',
      'moderator:read:followers'
    ].join(' ')
  },
  google: {
    clientId: "VOTRE_CLIENT_ID_GOOGLE", // À remplacer par votre Client ID Google
    clientSecret: "VOTRE_CLIENT_SECRET_GOOGLE", // À remplacer par votre Client Secret Google
    redirectUri: "https://apo-overlay.netlify.app/auth/google-callback.html",
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
    ].join(' ')
  }
}; 