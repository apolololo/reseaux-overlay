/**
 * Configuration des clients OAuth pour l'authentification
 */

// ID client pour Twitch
export const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID || "z8q1w4g12yrql6cyb5zzwmhe1pnxyn";

// ID client pour Google
// Cet ID client est configuré pour permettre l'accès à tous les utilisateurs
// Note: Pour que l'authentification Google fonctionne, vous devez configurer cet ID client
// dans la console Google Cloud (https://console.cloud.google.com/) et ajouter les URLs
// de redirection autorisées.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1098123020683-iqtdlh9g8hgkbvqp4qm7hgb9jd3s0dih.apps.googleusercontent.com";

// Scopes pour Twitch
export const TWITCH_SCOPES = "user:read:email channel:read:subscriptions moderator:read:followers";

// Scopes pour Google
export const GOOGLE_SCOPES = "email profile https://www.googleapis.com/auth/youtube.readonly";