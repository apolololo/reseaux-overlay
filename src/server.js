import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRouter from './api/auth.js';
import { requireAuth } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(express.json());

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

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 