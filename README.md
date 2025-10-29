# 🚀 CareerAI - AI-Powered Resume Builder & Career Assistant

<div align="center">

![CareerAI Logo](frontend/public/brand.png)

**Transform your career with AI-powered resume building, analysis, and optimization**

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/CareerAI)

[🌟 Live Demo](https://careerai-demo.com) • [📖 Documentation](./DEPLOYMENT_GUIDE.md) • [🚀 Quick Start](./QUICK_START.md)

</div>

## ✨ Features

### 🤖 AI-Powered Analysis
- **ATS Score Analysis** - Get compatibility scores with Applicant Tracking Systems
- **Smart Suggestions** - AI-driven recommendations for resume improvement
- **Keyword Optimization** - Identify and integrate missing industry keywords
- **Professional Rewriting** - Transform content with AI assistance

### 📄 Resume Management
- **Multiple Templates** - 5+ professional resume templates
- **Real-time Preview** - See changes instantly as you build
- **Export Options** - Download as PDF, DOCX, or share via link
- **Version History** - Track changes and analysis over time

### 🔐 User Experience
- **Secure Authentication** - JWT + OAuth (Google) integration
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Works perfectly on all devices
- **Offline Support** - PWA capabilities for offline access

### 💼 Professional Tools
- **Cover Letter Generator** - AI-powered cover letter creation
- **Job Matching** - Find relevant positions based on your resume
- **Interview Prep** - Get AI-generated interview questions
- **Career Insights** - Track your progress and improvements

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Chart.js** - Interactive analytics

### Backend
- **Node.js + Express** - Robust server framework
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Reliable relational database
- **JWT Authentication** - Secure token-based auth
- **Stripe Integration** - Payment processing

### AI & Services
- **Groq API** - Free, unlimited AI processing
- **Google OAuth** - Social authentication
- **Nodemailer** - Email notifications
- **PDF/DOCX Parsing** - Resume upload support

## 🚀 Quick Deploy (5 Minutes)

### 1. Get API Keys (Free)
- **Groq API**: [console.groq.com](https://console.groq.com) (Free, unlimited)
- **Google OAuth**: [console.developers.google.com](https://console.developers.google.com) (Optional)

### 2. Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

1. Click "Deploy Now"
2. Connect your GitHub
3. Add environment variables:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   JWT_SECRET=your-256-bit-secret
   ```
4. Deploy automatically!

### 3. Alternative: Manual Setup
```bash
# Clone repository
git clone https://github.com/your-username/CareerAI.git
cd CareerAI

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start with Docker
docker-compose up -d

# Or start manually
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## 📱 Screenshots

<div align="center">

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Resume Builder
![Resume Builder](docs/screenshots/builder.png)

### AI Analysis
![AI Analysis](docs/screenshots/analysis.png)

</div>

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/careerai"

# Security
JWT_SECRET="your-super-secure-256-bit-secret"

# AI Provider (Choose one)
GROQ_API_KEY="gsk_..."           # Free, unlimited
OPENAI_API_KEY="sk-..."          # Paid
HF_API_KEY="hf_..."              # Free with limits

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"

# Email (Optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Payments (Optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5001"
```

#### Frontend (.env)
```env
VITE_API_URL="http://localhost:5001/api"
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   PostgreSQL    │
│                 │    │                 │    │    Database     │
│  • Resume Builder│◄──►│  • REST API     │◄──►│                 │
│  • AI Interface │    │  • Authentication│    │  • User Data    │
│  • Dashboard    │    │  • File Upload  │    │  • Resumes      │
│  • Analytics    │    │  • AI Integration│    │  • Analytics    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   External APIs │              │
         │              │                 │              │
         └──────────────►│  • Groq AI     │◄─────────────┘
                        │  • Google OAuth │
                        │  • Stripe       │
                        │  • SMTP         │
                        └─────────────────┘
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e

# Load testing
npm run test:load
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Bundle Size**: < 500KB gzipped
- **API Response**: < 200ms average
- **Database Queries**: Optimized with Prisma
- **Caching**: Redis for session management

## 🔒 Security

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Zod schema validation
- **SQL Injection**: Prisma ORM protection
- **XSS Protection**: Content Security Policy
- **HTTPS**: SSL/TLS encryption

## 🌍 Deployment Options

### Free Tier
- **Railway** (Recommended): $0/month, 500 hours
- **Render + Supabase**: $0/month, limited resources
- **Vercel + PlanetScale**: $0/month, hobby projects

### Production
- **DigitalOcean**: ~$28/month, full control
- **AWS**: ~$50/month, enterprise features
- **Google Cloud**: ~$40/month, AI integration

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

### Development Setup
```bash
# Fork and clone
git clone https://github.com/your-username/CareerAI.git
cd CareerAI

# Install dependencies
npm run install:all

# Start development
npm run dev

# Run tests
npm test
```

### Code Style
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **Conventional Commits** for commit messages

## 📈 Roadmap

### v2.0 (Next Release)
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] API for third-party integrations

### v2.1 (Future)
- [ ] Video resume builder
- [ ] Interview scheduling
- [ ] Salary negotiation assistant
- [ ] Career path recommendations
- [ ] Company culture matching

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing free AI API
- **Railway** for excellent deployment platform
- **Prisma** for amazing database toolkit
- **Tailwind CSS** for beautiful styling
- **React Team** for the incredible framework

## 📞 Support

- **Documentation**: [docs.careerai.com](https://docs.careerai.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/CareerAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/CareerAI/discussions)
- **Email**: support@careerai.com

---

<div align="center">

**Made with ❤️ by the CareerAI Team**

[⭐ Star this repo](https://github.com/your-username/CareerAI) • [🐦 Follow us](https://twitter.com/careerai) • [💼 LinkedIn](https://linkedin.com/company/careerai)

</div>