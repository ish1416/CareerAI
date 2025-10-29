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
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
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

  // Generate verification token
  const verificationToken = crypto.randomBytes(24).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      name: name || '',
      email,
      password: hashed,
      role: role === 'admin' ? 'admin' : 'user',
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
    },
  });

  const token = createAccessToken({ id: user.id, role: user.role });
  const refreshToken = createRefreshToken({ id: user.id, role: user.role });
  setRefreshCookie(res, refreshToken);

  // Send verification email
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5174';
  const verifyUrl = `${frontend}/verify?token=${verificationToken}`;
  try {
    await sendMail({
      to: email,
      subject: '✨ Welcome to CareerAI - Verify Your Email',
      html: emailTemplates.verification(verifyUrl, name),
      text: textTemplates.verification(verifyUrl, name),
    });
  } catch (e) {
    console.warn('Email send failed (verification):', e.message);
  }

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
  const rt = req.cookies?.refreshToken;
  if (!rt) return res.status(401).json({ error: 'Missing refresh token' });
  try {
    const decoded = verifyToken(rt);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const newAccess = createAccessToken({ id: user.id, role: user.role });
    res.json({ token: newAccess });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function verifyEmail(req, res) {
  const token = req.query?.token;
  if (!token) return res.status(400).json({ error: 'Missing token' });
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  if (user.verificationTokenExpires && user.verificationTokenExpires.getTime() < Date.now()) {
    return res.status(400).json({ error: 'Token expired' });
  }
  
  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, verificationToken: null, verificationTokenExpires: null } });
  
  // Send welcome email
  try {
    await sendMail({
      to: user.email,
      subject: '🎉 Welcome to CareerAI - You\'re All Set!',
      html: emailTemplates.welcome(user.name),
      text: textTemplates.welcome(user.name),
    });
  } catch (e) {
    console.warn('Welcome email send failed:', e.message);
  }
  
  res.json({ message: 'Email verified' });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: 'If account exists, reset email sent' });

  const resetToken = crypto.randomBytes(24).toString('hex');
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpires } });

  const frontend = process.env.FRONTEND_URL || 'http://localhost:5174';
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

export async function resendVerification(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.emailVerified) {
      return res.json({ message: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(24).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationTokenExpires },
    });

    // Send verification email
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5174';
    const verifyUrl = `${frontend}/verify?token=${verificationToken}`;
    try {
      await sendMail({
        to: user.email,
        subject: '✨ CareerAI Email Verification',
        html: emailTemplates.verification(verifyUrl, user.name),
        text: textTemplates.verification(verifyUrl, user.name),
      });
    } catch (e) {
      console.warn('Email send failed (resend verification):', e.message);
    }

    return res.json({ message: 'Verification email sent' });
  } catch (e) {
    console.error('Resend verification error:', e);
    return res.status(500).json({ error: 'Unable to resend verification email' });
  }
}