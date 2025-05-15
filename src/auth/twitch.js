import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const generateOverlayUrl = (userId) => {
  const overlayId = uuidv4();
  return `${process.env.APP_URL}/overlay/${overlayId}`;
};

export const initTwitchAuth = () => {
  const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
  authUrl.searchParams.append('client_id', process.env.TWITCH_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', process.env.TWITCH_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'user:read:email channel:read:subscriptions');
  
  return authUrl.toString();
};

export const handleTwitchCallback = async (code) => {
  const tokenUrl = 'https://id.twitch.tv/oauth2/token';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITCH_REDIRECT_URI,
    }),
  });

  const data = await response.json();
  return data;
};

export const getUserProfile = async (accessToken) => {
  const response = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID,
    },
  });

  const data = await response.json();
  return data.data[0];
}; 