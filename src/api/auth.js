import express from 'express';
import { initTwitchAuth, handleTwitchCallback, getUserProfile } from '../auth/twitch';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/twitch', (req, res) => {
  const authUrl = initTwitchAuth();
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokenData = await handleTwitchCallback(code);
    
    // Récupérer les informations de l'utilisateur Twitch
    const userProfile = await getUserProfile(tokenData.access_token);
    
    // Créer un token JWT
    const token = jwt.sign(
      { 
        id: userProfile.id,
        login: userProfile.login,
        display_name: userProfile.display_name,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Définir le cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });
    
    res.redirect('/');
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.redirect('/error');
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('auth-token');
  res.redirect('/');
});

export default router; 