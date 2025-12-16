import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { createAccessToken, createRefreshToken, verifyToken } from '../utils/jwt.js';


function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined,
  });
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, plan: u.plan, verified: u.verified };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name || '',
      email,
      password: hashed,
      verified: true,
    },
  });

  const token = createAccessToken({ id: user.id });
  const refreshToken = createRefreshToken({ id: user.id });
  setRefreshCookie(res, refreshToken);

  res.json({ token, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = createAccessToken({ id: user.id });
  const refreshToken = createRefreshToken({ id: user.id });
  setRefreshCookie(res, refreshToken);
  
  res.json({ token, user: publicUser(user) });
}

export async function refresh(req, res) {
  // Try to get refresh token from cookie first, then from Authorization header as fallback
  let rt = req.cookies?.refreshToken;
  
  if (!rt) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      rt = authHeader.substring(7);
    }
  }
  
  if (!rt) {
    console.log('Refresh token missing - cookies:', !!req.cookies?.refreshToken, 'auth header:', !!req.headers.authorization);
    return res.status(401).json({ error: 'Missing refresh token' });
  }
  
  try {
    const decoded = verifyToken(rt);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const newAccess = createAccessToken({ id: user.id });
    
    // Also set a new refresh token cookie
    const newRefresh = createRefreshToken({ id: user.id });
    setRefreshCookie(res, newRefresh);
    
    res.json({ token: newAccess, refreshToken: newRefresh });
  } catch (e) {
    console.log('Refresh token verification failed:', e.message);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}



export async function forgotPassword(req, res) {
  res.status(501).json({ error: 'Password reset not available' });
}

export async function resetPassword(req, res) {
  res.status(501).json({ error: 'Password reset not available' });
}

export async function logout(req, res) {
  // JWT-based logout is client-side; clear refresh cookie for good measure
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}

