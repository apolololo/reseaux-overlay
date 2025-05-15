export const requireAuth = async (req, res, next) => {
  const session = await getSession(req);
  
  if (!session) {
    return res.redirect('/auth/twitch');
  }
  
  req.user = session.user;
  next();
};

export const getSession = async (req) => {
  const token = req.cookies['auth-token'];
  if (!token) return null;

  try {
    const session = await verifyToken(token);
    return session;
  } catch (error) {
    return null;
  }
};

const verifyToken = async (token) => {
  try {
    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 