import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

export const requireVerified = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.emailVerified) {
      return res.status(403).json({ error: 'Email not verified. Please verify to access this feature.' });
    }
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Unable to verify email status' });
  }
};