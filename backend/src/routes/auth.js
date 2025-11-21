import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, refresh, forgotPassword, resetPassword } from '../controllers/authController.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Credentials auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Refresh access token from cookie
router.post('/refresh', refresh);



// Password reset
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login?oauth=error' }), (req, res) => {
  try {
    const user = req.user;
    const accessToken = createAccessToken({ id: user.id, role: user.role });
    const refreshToken = createRefreshToken({ id: user.id, role: user.role });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userPayload = { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan, emailVerified: user.emailVerified };
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signing in...</title>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <h2>Signing you in...</h2>
    <p>Please wait while we redirect you to the dashboard.</p>
  </div>
  <script>
    try {
      localStorage.setItem('token', '${accessToken}');
      localStorage.setItem('user', JSON.stringify(${JSON.stringify(userPayload)}));
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/dashboard';
      }, 1000);
    } catch(e) {
      console.error('Auth error:', e);
      window.location.href = 'http://localhost:3000/login?oauth=error';
    }
  </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect('http://localhost:3000/login?oauth=error');
  }
});

export default router;