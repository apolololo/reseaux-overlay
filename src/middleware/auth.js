import jwt from 'jsonwebtoken';

export const requireAuth = async (req, res, next) => {
  const session = await getSession(req);
  
  if (!session) {
    // Si la requête est une API, renvoyer une erreur 401
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    // Sinon, rediriger vers la page de login
    return res.redirect('/login');
  }
  
  req.user = session.user;
  next();
};

export const getSession = async (req) => {
  const token = req.cookies['auth-token'];
  if (!token) return null;

  try {
    const decoded = await verifyToken(token);
    return {
      user: {
        id: decoded.id,
        login: decoded.login,
        display_name: decoded.display_name,
        access_token: decoded.access_token
      }
    };
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token invalide');
  }
}; 