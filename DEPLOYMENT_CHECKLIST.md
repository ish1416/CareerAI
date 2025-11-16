# 📋 Render Deployment Checklist

## Pre-Deployment Setup

### ✅ 1. GitHub Repository
- [ ] Create GitHub repository: `careerai-backend`
- [ ] Push code to GitHub
- [ ] Verify all files are committed

### ✅ 2. Render Account Setup
- [ ] Create free Render account at https://render.com
- [ ] Connect GitHub account to Render

### ✅ 3. Database Setup
- [ ] Create PostgreSQL database on Render
- [ ] Copy database connection URL
- [ ] Note down database credentials

## Deployment Steps

### ✅ 4. Web Service Creation
- [ ] Create new Web Service on Render
- [ ] Connect to GitHub repository
- [ ] Set **Root Directory** to `backend`
- [ ] Set **Build Command**: `npm install && npx prisma generate`
- [ ] Set **Start Command**: `npm start`

### ✅ 5. Environment Variables
Copy from `.env.production` and set in Render:

**Required:**
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `DATABASE_URL=<your-render-postgresql-url>`
- [ ] `JWT_SECRET=<secure-random-string>`
- [ ] `DEFAULT_PLAN=free`

**AI (Groq):**
- [ ] `GROQ_API_KEY=<your-groq-key>`
- [ ] `GROQ_MODEL=llama3-8b-8192`

**Google OAuth:**
- [ ] `GOOGLE_CLIENT_ID=<your-client-id>`
- [ ] `GOOGLE_CLIENT_SECRET=<your-client-secret>`
- [ ] `GOOGLE_CALLBACK_URL=https://your-service.onrender.com/api/auth/google/callback`

**Frontend:**
- [ ] `FRONTEND_URL=<your-frontend-url>`

### ✅ 6. Google OAuth Configuration
- [ ] Go to Google Cloud Console
- [ ] Update OAuth redirect URIs
- [ ] Add: `https://your-service.onrender.com/api/auth/google/callback`

### ✅ 7. Deployment & Testing
- [ ] Deploy service on Render
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check deployment logs for errors
- [ ] Test health endpoint: `https://your-service.onrender.com/api/health`
- [ ] Test Google OAuth: `https://your-service.onrender.com/api/auth/google`

## Post-Deployment

### ✅ 8. Frontend Configuration
- [ ] Update frontend `VITE_API_URL` to Render service URL
- [ ] Deploy frontend with new backend URL
- [ ] Test complete OAuth flow

### ✅ 9. Monitoring
- [ ] Bookmark Render dashboard
- [ ] Set up log monitoring
- [ ] Test all API endpoints
- [ ] Verify email functionality (if configured)

## Quick Commands

**Deploy to GitHub:**
```bash
./deploy-render.sh
```

**Test locally before deployment:**
```bash
cd backend
npm install
npm start
```

**Check deployment status:**
- Render Dashboard: https://dashboard.render.com
- Service Logs: Available in Render dashboard

## Troubleshooting

**Build Fails:**
- Check Node.js version compatibility
- Verify package.json dependencies
- Check Prisma schema syntax

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check database region matches service region
- Ensure database is running

**OAuth Issues:**
- Update Google OAuth redirect URIs
- Check callback URL matches exactly
- Verify client ID and secret

**Service Won't Start:**
- Check environment variables
- Review startup logs
- Verify port configuration (should be 10000)

---

**🎉 Once completed, your backend will be live at:**
`https://your-service-name.onrender.com`