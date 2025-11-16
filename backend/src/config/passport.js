import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';

const clientID = process.env.GOOGLE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/google/callback`;

// Only configure Google OAuth if credentials are provided
if (clientID && clientSecret) {
  passport.use(new GoogleStrategy({
  clientID,
  clientSecret,
  callbackURL,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = (profile.emails?.[0]?.value || '').toLowerCase();
    if (!email) return done(new Error('Google account missing email'));

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create placeholder password for OAuth accounts
      const placeholder = await bcrypt.hash(Math.random().toString(36), 10);
      user = await prisma.user.create({
        data: {
          email,
          name: profile.displayName || '',
          password: placeholder,
          // Mark as verified by provider
          emailVerified: true,
          oauthProvider: 'google',
          oauthProviderId: profile.id,
        },
      });
    } else {
      // Update name and provider info if missing
      if (!user.name && profile.displayName) {
        await prisma.user.update({ where: { id: user.id }, data: { name: profile.displayName } });
      }
      if (!user.oauthProviderId) {
        await prisma.user.update({ where: { id: user.id }, data: { oauthProvider: 'google', oauthProviderId: profile.id } });
      }
    }
    return done(null, user);
  } catch (e) {
    return done(e);
  }
  }));
} else {
  console.log('Google OAuth not configured - skipping Google strategy setup');
}