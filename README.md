# 🚀 CareerAI - AI-Powered Resume Builder

<div align="center">

![CareerAI Logo](frontend/public/brand.png)

**Transform your career with AI-powered resume building, analysis, and optimization**

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template/ZweBXA)

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

## 🚀 Quick Deploy

### Railway (Recommended)
1. Click the Railway button above
2. Connect your GitHub account
3. Set environment variables (see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md))
4. Deploy automatically!

### Local Development
```bash
# Clone repository
git clone https://github.com/ish1416/CareerAI.git
cd CareerAI

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

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

- **Issues**: [GitHub Issues](https://github.com/ish1416/CareerAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ish1416/CareerAI/discussions)

---

<div align="center">

**Made with ❤️ by the CareerAI Team**

[⭐ Star this repo](https://github.com/ish1416/CareerAI) • [🐦 Follow us](https://twitter.com/careerai) • [💼 LinkedIn](https://linkedin.com/company/careerai)

</div>