import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
dotenv.config();

import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import jobRoutes from './routes/job.js';
import coverLetterRoutes from './routes/coverletter.js';
import userRoutes from './routes/user.js';
import billingRoutes from './routes/billing.js';
import webhookRoutes from './routes/webhooks.js';
import healthRoutes from './routes/health.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import './config/passport.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
// app.use('/api', apiLimiter);

// Enable CORS with credentials for cookie-based refresh
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5180',
];
const allowAllLocal = process.env.NODE_ENV !== 'production';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin or curl
    if (allowedOrigins.includes(origin) || (allowAllLocal && origin.startsWith('http://localhost:')))
      return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(passport.initialize());

// Mount webhook (raw body) BEFORE JSON parser
app.use('/api/webhooks', webhookRoutes);

// JSON parser for regular APIs
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/coverletter', coverLetterRoutes);
app.use('/api/user', userRoutes);
app.use('/api', billingRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});