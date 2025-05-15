import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import authRouter from './api/auth.js';
import { requireAuth } from './middleware/auth.js';
import { config } from './config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: config.appUrl,
  credentials: true
}));

// Routes publiques (accessibles sans authentification)
app.use('/auth', authRouter);
app.use('/images', express.static(join(__dirname, '../public/images')));

// Middleware de vérification d'authentification pour toutes les autres routes
app.use((req, res, next) => {
  if (req.path === '/login') {
    return next();
  }
  requireAuth(req, res, next);
});

// Route de login (page de garde)
app.get('/login', (req, res) => {
  res.sendFile(join(__dirname, '../public/login.html'));
});

// Routes protégées
app.get('/', requireAuth, (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.get('/api/user', requireAuth, (req, res) => {
  res.json(req.user);
});

// Route pour vérifier l'authentification
app.get('/api/user', async (req, res) => {
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route de callback Twitch
app.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    // Échange du code contre un token
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.twitchClientId,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.twitchRedirectUri
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Token non reçu');
    }

    // Récupération des informations utilisateur
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Client-Id': config.twitchClientId
      }
    });

    const userData = await userResponse.json();
    const user = userData.data[0];

    // Création du JWT
    const token = jwt.sign({
      id: user.id,
      login: user.login,
      display_name: user.display_name,
      access_token: tokenData.access_token
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Configuration du cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'apo-overlay.netlify.app',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    // Redirection vers la page principale
    res.redirect(config.appUrl);
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.redirect(`${config.appUrl}/login?error=auth`);
  }
});

// Route de déconnexion
app.get('/auth/logout', (req, res) => {
  res.clearCookie('auth-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: 'apo-overlay.netlify.app'
  });
  res.json({ success: true });
});

// Route pour générer une URL d'overlay
app.get('/api/overlay/generate', (req, res) => {
  const overlayId = crypto.randomUUID();
  const overlayUrl = `${config.appUrl}/overlay/${overlayId}`;
  res.json({ url: overlayUrl });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 