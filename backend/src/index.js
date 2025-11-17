import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
await dotenv.config();
// import 'newrelic'; // Temporarily disabled

import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import jobRoutes from './routes/job.js';
import coverLetterRoutes from './routes/coverletter.js';
import userRoutes from './routes/user.js';
import billingRoutes from './routes/billing.js';
import webhookRoutes from './routes/webhooks.js';
import healthRoutes from './routes/health.js';
import aiRoutes from './routes/ai.js';
import aiCopilotRoutes from './routes/aiCopilot.js';
import learningRoutes from './routes/learning.js';
import networkingRoutes from './routes/networking.js';
import portfolioRoutes from './routes/portfolio.js';
import jobTrackerRoutes from './routes/jobTracker.js';
import interviewRoutes from './routes/interview.js';
import projectFinderRoutes from './routes/projectFinder.js';
import enterpriseRoutes from './routes/enterprise.js';
import analyticsRoutes from './routes/analytics.js';
import productivityRoutes from './routes/productivity.js';
import careerDnaRoutes from './routes/careerDna.js';
import careerTwinRoutes from './routes/careerTwin.js';
import globalOpportunitiesRoutes from './routes/globalOpportunities.js';
import videoResumeRoutes from './routes/videoResume.js';
import virtualFairRoutes from './routes/virtualFair.js';
import blockchainRoutes from './routes/blockchain.js';
import mentorMarketplaceRoutes from './routes/mentorMarketplace.js';
import autoDistributionRoutes from './routes/autoDistribution.js';
import communicationCoachRoutes from './routes/communicationCoach.js';
import jobIntelligenceRoutes from './routes/jobIntelligence.js';
import salaryNegotiationRoutes from './routes/salaryNegotiation.js';
import careerGoalsRoutes from './routes/careerGoals.js';
import googleAuthRoutes from './routes/googleAuth.js';
import scrapingRoutes from './routes/scraping.js';
import seoRoutes from './routes/seo.js';
import codingQuestionsRoutes from './routes/codingQuestions.js';
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
if (process.env.NODE_ENV === 'production') {
  app.use('/api', apiLimiter);
}

// Enable CORS with credentials for cookie-based refresh
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5180',
  'http://localhost:3000',
  'https://career-ai-frontend.vercel.app',
  'https://careerai.vercel.app',
  'https://career-ai-q0tf.onrender.com',
  'https://careerai-frontend-5keb.onrender.com'
];

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(passport.initialize());

// Mount webhook (raw body) BEFORE JSON parser
app.use('/api/webhooks', webhookRoutes);

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// JSON parser for regular APIs
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/coverletter', coverLetterRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/copilot', aiCopilotRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/network', networkingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/job-tracker', jobTrackerRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/projects', projectFinderRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/career-dna', careerDnaRoutes);
app.use('/api/career-twin', careerTwinRoutes);
app.use('/api/global-opportunities', globalOpportunitiesRoutes);
app.use('/api/video-resume', videoResumeRoutes);
app.use('/api/virtual-fair', virtualFairRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/mentor-marketplace', mentorMarketplaceRoutes);
app.use('/api/auto-distribution', autoDistributionRoutes);
app.use('/api/communication-coach', communicationCoachRoutes);
app.use('/api/job-intelligence', jobIntelligenceRoutes);
app.use('/api/salary-negotiation', salaryNegotiationRoutes);
app.use('/api/career-goals', careerGoalsRoutes);
app.use('/api/google', googleAuthRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/coding-questions', codingQuestionsRoutes);
app.use('/api', billingRoutes);

// Test email route (development only)
if (process.env.NODE_ENV !== 'production') {
  const testEmailRoutes = await import('./routes/test-email.js');
  app.use('/api', testEmailRoutes.default);
}

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start server (works for both local and Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export default app;