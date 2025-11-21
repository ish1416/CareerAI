import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { createAccessToken, createRefreshToken, verifyToken } from '../utils/jwt.js';
import { sendMail } from '../config/mail.js';
import { emailTemplates, textTemplates } from '../utils/emailTemplates.js';

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
  return { id: u.id, name: u.name, email: u.email, role: u.role, plan: u.plan, emailVerified: !!u.emailVerified };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name || '',
      email,
      password: hashed,
      role: role === 'admin' ? 'admin' : 'user',
      emailVerified: true, // Auto-verify emails
    },
  });

  const token = createAccessToken({ id: user.id, role: user.role });
  const refreshToken = createRefreshToken({ id: user.id, role: user.role });
  setRefreshCookie(res, refreshToken);

  res.json({ token, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = createAccessToken({ id: user.id, role: user.role });
  const refreshToken = createRefreshToken({ id: user.id, role: user.role });
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
    const newAccess = createAccessToken({ id: user.id, role: user.role });
    
    // Also set a new refresh token cookie
    const newRefresh = createRefreshToken({ id: user.id, role: user.role });
    setRefreshCookie(res, newRefresh);
    
    res.json({ token: newAccess, refreshToken: newRefresh });
  } catch (e) {
    console.log('Refresh token verification failed:', e.message);
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}



export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: 'If account exists, reset email sent' });

  const resetToken = crypto.randomBytes(24).toString('hex');
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpires } });

  const frontend = (process.env.FRONTEND_URL || 'http://localhost:5174').replace(/\/$/, '');
  const link = `${frontend}/reset?token=${resetToken}`;
  try {
    await sendMail({
      to: email,
      subject: '🔐 Reset Your CareerAI Password',
      html: emailTemplates.passwordReset(link, user.name),
      text: textTemplates.passwordReset(link, user.name),
    });
  } catch (e) {
    console.warn('Email send failed (reset):', e.message);
  }

  res.json({ message: 'If account exists, reset email sent' });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'token and password required' });
  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  if (user.resetTokenExpires && user.resetTokenExpires.getTime() < Date.now()) {
    return res.status(400).json({ error: 'Token expired' });
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed, resetToken: null, resetTokenExpires: null } });
  res.json({ message: 'Password updated' });
}

export async function logout(req, res) {
  // JWT-based logout is client-side; clear refresh cookie for good measure
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}

