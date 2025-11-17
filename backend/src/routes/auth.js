import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, refresh, verifyEmail, forgotPassword, resetPassword, resendVerification } from '../controllers/authController.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Credentials auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Refresh access token from cookie
router.post('/refresh', refresh);

// Email verification
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', requireAuth, resendVerification);

// Password reset
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: ((process.env.FRONTEND_URL || 'http://localhost:5174').replace(/\/$/, '')) + '/login?oauth=error' }), (req, res) => {
  // Issue tokens and auto-login via HTML page setting localStorage, then redirect to dashboard
  const user = req.user;
  const accessToken = createAccessToken({ id: user.id, role: user.role });
  const refreshToken = createRefreshToken({ id: user.id, role: user.role });
  const frontend = (process.env.FRONTEND_URL || 'http://localhost:5174').replace(/\/$/, '');

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userPayload = { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan, emailVerified: user.emailVerified };
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Signing in…</title></head><body>
<script>
try {
  localStorage.setItem('token', '${accessToken}');
  localStorage.setItem('user', '${JSON.stringify(userPayload).replace(/"/g, '\\"')}');
} catch(e) {}
window.location = '${frontend}/dashboard';
</script>
</body></html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;