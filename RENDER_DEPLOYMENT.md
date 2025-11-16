# 🚀 Deploy CareerAI Backend to Render

## Prerequisites
- GitHub account
- Render account (free)
- PostgreSQL database (we'll use Render's free PostgreSQL)

## Step 1: Push Code to GitHub

1. **Initialize Git** (if not already done):
```bash
cd /Users/atharvsoni/CAREER_AI/CareerAI
git init
git add .
git commit -m "Initial commit - CareerAI backend"
```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Create new repository: `careerai-backend`
   - Don't initialize with README (we already have code)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/careerai-backend.git
git branch -M main
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"PostgreSQL"**
3. **Configure Database**:
   - Name: `careerai-db`
   - Database: `careerai`
   - User: `careerai_user`
   - Region: `Oregon (US West)`
   - Plan: **Free** (0.1 CPU, 256MB RAM, 1GB storage)
4. **Click "Create Database"**
5. **Copy Connection Details** (you'll need these):
   - Internal Database URL
   - External Database URL

## Step 3: Deploy Backend Service

1. **Go to Render Dashboard**
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**:
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Select `careerai-backend` repository
4. **Configure Service**:
   - **Name**: `careerai-backend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (0.1 CPU, 512MB RAM)

## Step 4: Configure Environment Variables

In the Render service settings, add these environment variables:

### Required Variables:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-render-postgresql-url>
JWT_SECRET=your-super-secure-jwt-secret-key-here
DEFAULT_PLAN=free
```

### AI Configuration (Groq - Free):
```
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama3-8b-8192
```

### Google OAuth:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-render-service.onrender.com/api/auth/google/callback
```

### Email Configuration (Optional):
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@careerai.com
```

### Frontend URL:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Step 5: Update Google OAuth Settings

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Navigate to**: APIs & Services → Credentials
3. **Edit OAuth 2.0 Client**
4. **Add Authorized Redirect URIs**:
   - `https://your-render-service.onrender.com/api/auth/google/callback`
5. **Save Changes**

## Step 6: Deploy and Test

1. **Click "Create Web Service"**
2. **Wait for Deployment** (5-10 minutes)
3. **Check Logs** for any errors
4. **Test Endpoints**:
   - Health: `https://your-service.onrender.com/api/health`
   - Google OAuth: `https://your-service.onrender.com/api/auth/google`

## Step 7: Update Frontend Configuration

Update your frontend environment variables:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

## Common Issues & Solutions

### Database Connection Issues:
- Ensure DATABASE_URL is correctly formatted
- Check if database is in same region as web service
- Verify database credentials

### Build Failures:
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Verify Prisma schema is valid

### OAuth Issues:
- Update Google OAuth redirect URIs
- Check GOOGLE_CALLBACK_URL matches exactly
- Ensure FRONTEND_URL is correct

### Email Issues:
- Use app-specific passwords for Gmail
- Check SMTP settings
- Verify EMAIL_HOST and PORT

## Free Tier Limitations

**Render Free Plan**:
- 0.1 CPU, 512MB RAM
- Sleeps after 15 minutes of inactivity
- 750 hours/month (enough for development)
- Custom domains not included

**PostgreSQL Free Plan**:
- 0.1 CPU, 256MB RAM
- 1GB storage
- Expires after 90 days (can create new one)

## Production Recommendations

For production use, consider upgrading to:
- **Starter Plan** ($7/month): No sleep, more resources
- **PostgreSQL Starter** ($7/month): Persistent database
- Custom domain and SSL included

## Monitoring & Logs

- **View Logs**: Render Dashboard → Service → Logs
- **Monitor Performance**: Built-in metrics
- **Health Checks**: Automatic with `/api/health` endpoint

## Backup Strategy

1. **Database Backups**: Render provides automatic backups
2. **Code Backups**: GitHub repository
3. **Environment Variables**: Document in secure location

---

**🎉 Your CareerAI backend is now deployed on Render!**

**Service URL**: `https://your-service-name.onrender.com`
**API Base**: `https://your-service-name.onrender.com/api`