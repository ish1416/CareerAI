# CareerAI - Complete Project Structure Guide

## 🏗️ Project Overview

CareerAI is a full-stack web application that helps users build professional resumes, analyze job matches, and advance their careers using AI technology. The project is built with a modern tech stack and follows industry best practices.

## 📁 Root Directory Structure

```
CAREER_AI/
├── CareerAI/                    # Main application directory
│   ├── backend/                 # Node.js/Express API server
│   ├── frontend/                # React.js client application
│   └── PROJECT_STRUCTURE.md     # This documentation file
└── README.md                    # Project overview
```

## 🔧 Technology Stack

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Primary database (via Supabase)
- **Prisma** - Database ORM and query builder
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Cloudinary** - Media storage and processing

### Frontend Technologies
- **React.js** - User interface library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **CSS Variables** - Custom theming system

### External Services
- **Supabase** - Database hosting and authentication
- **Google OAuth** - Social authentication
- **Cloudinary** - Image/video storage
- **Stripe** - Payment processing
- **GROQ API** - AI language model integration
- **RapidAPI** - Course data integration
- **Adzuna API** - Job listings integration

## 🗄️ Backend Structure (`/backend/`)

### Core Configuration
```
backend/
├── .env                         # Environment variables (secrets)
├── package.json                 # Dependencies and scripts
├── server.js                    # Application entry point
└── src/                         # Source code directory
```

### Source Code Organization (`/backend/src/`)

#### 📋 Main Application Files
```
src/
├── app.js                       # Express app configuration
├── config/                      # Configuration files
│   ├── database.js             # Database connection setup
│   ├── passport.js             # Authentication strategies
│   └── mail.js                 # Email service configuration
├── controllers/                 # Request handlers (business logic)
├── middleware/                  # Custom middleware functions
├── models/                      # Database models (Prisma)
├── routes/                      # API route definitions
├── services/                    # External service integrations
└── utils/                       # Utility functions and helpers
```

#### 🎮 Controllers (`/backend/src/controllers/`)
Controllers handle HTTP requests and contain business logic:

```
controllers/
├── authController.js            # User authentication (login, register, OAuth)
├── userController.js            # User profile management
├── resumeController.js          # Resume creation and management
├── analysisController.js        # Resume analysis and scoring
├── jobController.js             # Job matching and search
├── coverLetterController.js     # Cover letter generation
├── learningController.js        # Learning resources and courses
├── communityController.js       # Community features and forums
├── portfolioController.js       # Portfolio management
├── interviewController.js       # Interview preparation tools
├── projectController.js         # Project showcase features
├── analyticsController.js       # User analytics and insights
└── paymentController.js         # Stripe payment processing
```

#### 🛡️ Middleware (`/backend/src/middleware/`)
Custom middleware for request processing:

```
middleware/
├── auth.js                      # JWT authentication verification
├── cors.js                      # Cross-origin resource sharing
├── errorHandler.js              # Global error handling
├── rateLimiter.js              # API rate limiting
├── validation.js                # Request data validation
└── upload.js                    # File upload handling
```

#### 🗃️ Models (`/backend/src/models/`)
Database schema definitions using Prisma:

```
models/
├── schema.prisma               # Main Prisma schema file
├── User.js                     # User model extensions
├── Resume.js                   # Resume model extensions
├── Job.js                      # Job model extensions
└── Analytics.js                # Analytics model extensions
```

#### 🛣️ Routes (`/backend/src/routes/`)
API endpoint definitions:

```
routes/
├── auth.js                     # Authentication routes (/api/auth/*)
├── users.js                    # User management (/api/users/*)
├── resumes.js                  # Resume operations (/api/resumes/*)
├── analysis.js                 # Analysis features (/api/analysis/*)
├── jobs.js                     # Job-related endpoints (/api/jobs/*)
├── cover-letters.js            # Cover letter generation (/api/cover-letters/*)
├── learning.js                 # Learning resources (/api/learning/*)
├── community.js                # Community features (/api/community/*)
├── portfolio.js                # Portfolio management (/api/portfolio/*)
├── interview.js                # Interview prep (/api/interview/*)
├── projects.js                 # Project showcase (/api/projects/*)
├── analytics.js                # Analytics data (/api/analytics/*)
├── payments.js                 # Payment processing (/api/payments/*)
├── web-scraper.js              # Web scraping tools (/api/web-scraper/*)
├── seo-tools.js                # SEO analysis tools (/api/seo-tools/*)
├── ai-advanced.js              # Advanced AI features (/api/ai-advanced/*)
└── email-test.js               # Email testing endpoint (/api/email-test/*)
```

#### 🔧 Services (`/backend/src/services/`)
External service integrations:

```
services/
├── aiService.js                # GROQ AI integration for content generation
├── cloudinaryService.js        # Media upload and processing
├── emailService.js             # Email sending functionality
├── jobService.js               # Job API integrations (Adzuna)
├── courseService.js            # Course API integrations (RapidAPI)
├── paymentService.js           # Stripe payment processing
├── analyticsService.js         # Analytics data processing
└── scrapingService.js          # Web scraping functionality
```

#### 🛠️ Utils (`/backend/src/utils/`)
Utility functions and helpers:

```
utils/
├── jwt.js                      # JWT token creation and verification
├── validation.js               # Data validation schemas
├── helpers.js                  # General utility functions
├── constants.js                # Application constants
└── api.js                      # API response formatting
```

## 🎨 Frontend Structure (`/frontend/`)

### Core Configuration
```
frontend/
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite build configuration
├── index.html                  # HTML entry point
└── src/                        # Source code directory
```

### Source Code Organization (`/frontend/src/`)

#### 📋 Main Application Files
```
src/
├── main.jsx                    # React application entry point
├── App.jsx                     # Root component with routing
├── index.css                   # Global styles and imports
├── components/                 # Reusable UI components
├── pages/                      # Page-level components
├── context/                    # React context providers
├── hooks/                      # Custom React hooks
├── utils/                      # Utility functions
└── styles/                     # CSS and styling files
```

#### 🧩 Components (`/frontend/src/components/`)
Reusable UI components organized by functionality:

```
components/
├── AuthShell.jsx               # Authenticated app layout with sidebar
├── Navbar.jsx                  # Navigation bar for public pages
├── Logo.jsx                    # Application logo component
├── BackButton.jsx              # Navigation back button
├── JobTracker.jsx              # Job application tracking
├── WebScraper.jsx              # Web scraping interface
├── SEOTools.jsx                # SEO analysis tools
├── AutoDistribution.jsx        # Automated resume distribution
├── CareerDNA.jsx               # Career analysis and insights
├── ResumeBuilder.jsx           # Resume creation interface
├── AnalysisResults.jsx         # Resume analysis display
├── CoverLetterGenerator.jsx    # Cover letter creation
├── InterviewPrep.jsx           # Interview preparation tools
├── LearningHub.jsx             # Learning resources interface
├── Community.jsx               # Community features
├── Portfolio.jsx               # Portfolio management
├── ProjectShowcase.jsx         # Project display component
├── Analytics.jsx               # Analytics dashboard
├── Settings.jsx                # User settings interface
└── PaymentForm.jsx             # Stripe payment integration
```

#### 📄 Pages (`/frontend/src/pages/`)
Full-page components for different routes:

```
pages/
├── Landing.jsx                 # Homepage for non-authenticated users
├── Login.jsx                   # User login page
├── Register.jsx                # User registration page
├── Dashboard.jsx               # Main dashboard after login
├── Builder.jsx                 # Resume builder page
├── Analysis.jsx                # Resume analysis page
├── JobMatch.jsx                # Job matching page
├── CoverLetters.jsx            # Cover letter management
├── Learning.jsx                # Learning hub page
├── Community.jsx               # Community page
├── Portfolio.jsx               # Portfolio page
├── Interview.jsx               # Interview preparation
├── Projects.jsx                # Project showcase
├── Analytics.jsx               # Analytics page
├── Settings.jsx                # User settings
├── Pricing.jsx                 # Subscription pricing
├── WebScraper.jsx              # Web scraping tools
├── SEOTools.jsx                # SEO analysis tools
├── AIAdvanced.jsx              # Advanced AI features
└── NotFound.jsx                # 404 error page
```

#### 🔄 Context (`/frontend/src/context/`)
React context providers for global state:

```
context/
├── AuthContext.jsx             # User authentication state
├── ThemeContext.jsx            # Light/dark theme management
├── ResumeContext.jsx           # Resume data state
└── AnalyticsContext.jsx        # Analytics data state
```

#### 🎣 Hooks (`/frontend/src/hooks/`)
Custom React hooks for reusable logic:

```
hooks/
├── useAuth.js                  # Authentication utilities
├── useApi.js                   # API request handling
├── useLocalStorage.js          # Local storage management
├── useDebounce.js              # Input debouncing
└── useAnalytics.js             # Analytics tracking
```

#### 🛠️ Utils (`/frontend/src/utils/`)
Frontend utility functions:

```
utils/
├── api.js                      # Axios API client configuration
├── auth.js                     # Authentication helpers
├── validation.js               # Form validation utilities
├── formatting.js               # Data formatting functions
└── constants.js                # Frontend constants
```

#### 🎨 Styles (`/frontend/src/styles/`)
CSS and styling files:

```
styles/
├── modern-theme.css            # Main theme with CSS variables
├── components.css              # Component-specific styles
└── responsive.css              # Mobile responsive styles
```

## 🔐 Authentication System

### Authentication Flow
1. **Registration**: Users can register with email/password or Google OAuth
2. **Login**: JWT tokens issued for authenticated sessions
3. **Token Management**: Access tokens (short-lived) + Refresh tokens (long-lived)
4. **Protected Routes**: Middleware validates JWT tokens for API access
5. **Role-based Access**: Different permissions for free/pro/premium users

### Security Features
- Password hashing with bcrypt
- JWT token expiration and refresh
- HTTP-only cookies for refresh tokens
- CORS protection
- Rate limiting on API endpoints
- Input validation and sanitization

## 💾 Database Schema

### Core Tables (Prisma Models)
- **Users**: User accounts, profiles, and subscription data
- **Resumes**: Resume content, templates, and versions
- **Jobs**: Job listings, applications, and matches
- **Analytics**: User activity, resume views, and performance metrics
- **CoverLetters**: Generated cover letters and templates
- **Projects**: User project portfolios
- **Learning**: Course progress and certifications
- **Community**: Forum posts, comments, and interactions

## 🚀 API Endpoints

### Authentication (`/api/auth/`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Token refresh
- `GET /google` - Google OAuth initiation
- `GET /google/callback` - Google OAuth callback

### Resume Management (`/api/resumes/`)
- `GET /` - List user resumes
- `POST /` - Create new resume
- `GET /:id` - Get specific resume
- `PUT /:id` - Update resume
- `DELETE /:id` - Delete resume
- `POST /:id/analyze` - Analyze resume

### Job Features (`/api/jobs/`)
- `GET /search` - Search job listings
- `POST /match` - Find job matches
- `GET /applications` - User job applications
- `POST /apply` - Apply to job

### AI Features (`/api/ai-advanced/`)
- `POST /generate-content` - AI content generation
- `POST /analyze-resume` - AI resume analysis
- `POST /career-advice` - AI career guidance

## 🔧 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Git version control

### Environment Variables
Create `.env` files in both backend and frontend directories with required API keys and configuration.

### Installation Steps
1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up database with Prisma: `npx prisma migrate dev`
5. Start backend server: `npm run dev`
6. Start frontend server: `npm run dev`

## 📱 Features Overview

### Core Features
- **Resume Builder**: Drag-and-drop resume creation with multiple templates
- **AI Analysis**: Intelligent resume scoring and improvement suggestions
- **Job Matching**: AI-powered job recommendations based on skills
- **Cover Letter Generator**: Automated cover letter creation
- **Interview Prep**: Practice questions and video recording
- **Learning Hub**: Curated courses and skill development
- **Portfolio**: Project showcase and professional portfolio
- **Analytics**: Detailed insights on resume performance

### Advanced Features
- **Web Scraper**: Extract job listings and company information
- **SEO Tools**: Analyze and optimize online presence
- **Career DNA**: Comprehensive career analysis and planning
- **Auto Distribution**: Automated resume submission to relevant jobs
- **Community**: Professional networking and discussions

### Subscription Tiers
- **Free**: Basic resume building and limited AI features
- **Pro**: Advanced AI analysis, unlimited resumes, priority support
- **Premium**: All features, white-label options, API access

## 🔄 Data Flow

### Typical User Journey
1. User registers/logs in through frontend
2. Frontend sends authenticated requests to backend API
3. Backend validates JWT tokens and processes requests
4. Database operations performed through Prisma ORM
5. External APIs called for AI, jobs, and other services
6. Processed data returned to frontend for display
7. User interactions tracked for analytics

### File Upload Flow
1. User selects file in frontend
2. File sent to backend via multipart form data
3. Multer middleware processes file upload
4. File uploaded to Cloudinary for storage
5. File URL and metadata stored in database
6. Frontend receives file information for display

## 🚀 Deployment Architecture

### Production Environment
- **Frontend**: Deployed on Vercel/Netlify with CDN
- **Backend**: Deployed on Railway/Heroku with auto-scaling
- **Database**: Supabase PostgreSQL with connection pooling
- **Media Storage**: Cloudinary for images and videos
- **Monitoring**: Error tracking and performance monitoring

### CI/CD Pipeline
- Git-based deployment triggers
- Automated testing and linting
- Environment-specific configurations
- Database migration handling
- Zero-downtime deployments

This comprehensive structure ensures scalability, maintainability, and a great developer experience while providing powerful career development tools for users.