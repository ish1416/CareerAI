# 🆓 CareerAI - Free Deployment Guide

Deploy your CareerAI platform completely FREE using these cloud services!

## 🚀 Option 1: Railway (Recommended - Easiest)

### Total Cost: $0/month
- **Database**: PostgreSQL (Free tier)
- **Backend**: Node.js app (500 hours free)
- **Frontend**: Static hosting (Free)

### Step-by-Step Deployment:

#### 1. Prepare Your Repository
```bash
# Fork this repository to your GitHub account
# Or clone and push to your own repo
git clone https://github.com/your-username/CareerAI.git
cd CareerAI
git remote set-url origin https://github.com/YOUR-USERNAME/CareerAI.git
git push -u origin main
```

#### 2. Get Free API Keys
- **Groq API** (Free, Unlimited): https://console.groq.com
  - Sign up → Create API Key → Copy `gsk_...`
- **Google OAuth** (Optional): https://console.developers.google.com
  - Create project → Enable Google+ API → Create credentials

#### 3. Deploy Database
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the connection string (starts with `postgresql://`)

#### 4. Deploy Backend
1. In Railway, click "New Service" → "GitHub Repo"
2. Select your CareerAI repository
3. Choose "backend" folder as root directory
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://postgres:password@host:5432/railway
   JWT_SECRET=your-super-secure-jwt-secret-at-least-256-bits-long
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GOOGLE_CLIENT_ID=your-google-client-id (optional)
   GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
   FRONTEND_URL=https://your-frontend-domain.up.railway.app
   NODE_ENV=production
   ```
5. Railway will auto-deploy and give you a URL like `https://backend-production-xxxx.up.railway.app`

#### 5. Deploy Frontend
1. Click "New Service" → "GitHub Repo" → Same repository
2. Choose "frontend" folder as root directory
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.up.railway.app/api
   ```
4. Railway will build and deploy your frontend

#### 6. Setup Database
1. Go to your backend service in Railway
2. Click "Deploy Logs" → Wait for deployment to complete
3. Click "Connect" → "Railway CLI" or use the web terminal
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

#### 7. Test Your Deployment
- Visit your frontend URL
- Register a new account
- Upload a resume and test AI analysis
- Check all features work

---

## 🚀 Option 2: Render + Supabase

### Total Cost: $0/month
- **Database**: Supabase PostgreSQL (Free tier)
- **Backend**: Render Web Service (750 hours free)
- **Frontend**: Render Static Site (Free)

#### 1. Setup Database (Supabase)
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (URI format)

#### 2. Deploy Backend (Render)
1. Go to [Render.com](https://render.com)
2. Connect GitHub account
3. Create "Web Service" → Connect repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
5. Add environment variables (same as Railway)
6. Deploy

#### 3. Deploy Frontend (Render)
1. Create "Static Site" → Connect same repository
2. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

---

## 🚀 Option 3: Vercel + PlanetScale

### Total Cost: $0/month
- **Database**: PlanetScale MySQL (Free tier)
- **Backend**: Vercel Serverless (Free)
- **Frontend**: Vercel Static (Free)

#### 1. Setup Database (PlanetScale)
1. Go to [PlanetScale.com](https://planetscale.com)
2. Create database
3. Create branch → Get connection string
4. Update `schema.prisma` to use MySQL instead of PostgreSQL

#### 2. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import Git Repository
3. Deploy both frontend and backend as separate projects
4. Configure environment variables

---

## 🔧 Environment Variables Reference

### Backend (.env)
```env
# Required
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-super-secure-jwt-secret-256-bits"
GROQ_API_KEY="gsk_your_groq_api_key"

# Optional but recommended
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="https://your-backend-domain.com/api/auth/google/callback"

# Email (Optional - for notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="CareerAI <noreply@yourdomain.com>"

# URLs
FRONTEND_URL="https://your-frontend-domain.com"
BACKEND_URL="https://your-backend-domain.com"
NODE_ENV="production"
```

### Frontend (.env)
```env
VITE_API_URL="https://your-backend-domain.com/api"
```

---

## ✅ Verification Checklist

After deployment, test these features:

### Basic Functionality
- [ ] User registration works
- [ ] Email verification (if enabled)
- [ ] Login/logout works
- [ ] Google OAuth (if enabled)

### Core Features
- [ ] Resume upload (PDF/DOCX)
- [ ] Resume builder works
- [ ] AI analysis generates scores
- [ ] AI rewriting works
- [ ] Resume templates load
- [ ] Job matcher shows results
- [ ] Interview prep questions load
- [ ] Career insights display data

### Performance
- [ ] Pages load in under 3 seconds
- [ ] API responses under 1 second
- [ ] No console errors
- [ ] Mobile responsive

---

## 🆘 Troubleshooting

### Common Issues

#### "Database connection failed"
```bash
# Check your DATABASE_URL format
# PostgreSQL: postgresql://user:pass@host:5432/db
# MySQL: mysql://user:pass@host:3306/db
```

#### "CORS error"
- Make sure `FRONTEND_URL` in backend matches your frontend domain exactly
- Check both URLs are HTTPS in production

#### "AI analysis not working"
- Verify `GROQ_API_KEY` is set correctly
- Test API key at https://console.groq.com

#### "Build failed"
- Check Node.js version (use 18+)
- Clear node_modules and reinstall
- Check for syntax errors

### Getting Help
1. Check deployment logs in your platform
2. Test API endpoints manually
3. Verify environment variables are set
4. Check database connection

---

## 🎉 Success!

Your CareerAI platform is now live and free! 

### What's Included:
- ✅ AI-powered resume analysis
- ✅ Professional resume templates
- ✅ Job matching system
- ✅ Interview preparation
- ✅ Career insights & analytics
- ✅ Cover letter generator
- ✅ User authentication
- ✅ Dark/light mode
- ✅ Mobile responsive design

### Next Steps:
1. **Custom Domain**: Add your own domain for branding
2. **Analytics**: Add Google Analytics for user tracking
3. **Monitoring**: Set up uptime monitoring
4. **Backups**: Configure automated database backups
5. **SEO**: Optimize for search engines

### Scaling Up:
When you're ready to scale:
- **Railway**: Upgrade to Pro ($5/month) for more resources
- **Render**: Upgrade for faster builds and more bandwidth
- **Vercel**: Pro plan for advanced features

---

## 💡 Pro Tips

1. **Performance**: Enable caching and CDN for faster loading
2. **Security**: Add rate limiting and input validation
3. **SEO**: Add meta tags and structured data
4. **Analytics**: Track user behavior and feature usage
5. **Feedback**: Add user feedback system for improvements

Your professional CareerAI platform is ready to help users land their dream jobs! 🚀