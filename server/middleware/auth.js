const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'periodready_super_secret_jwt_key_2026';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found or session expired.' });
    }

    req.user = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db.users.findById(decoded.id);
      if (user) {
        req.user = {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        };
      }
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth,
  JWT_SECRET
};
