# 🚀 Render Deployment Setup Guide

## ⚠️ Important: Environment Variables

You **MUST** set these environment variables in Render Dashboard for both services:

### Backend Service Environment Variables:
```
DATABASE_URL=postgresql://...          # Your PostgreSQL connection string
DIRECT_URL=postgresql://...            # Direct database URL (same as DATABASE_URL for Render)
JWT_SECRET=your-secret-key-here        # Random secret for JWT tokens
GROQ_API_KEY=your-groq-api-key         # Get from https://console.groq.com
GROQ_MODEL=llama-3.1-8b-instant        # Already set in render.yaml
FRONTEND_URL=https://your-frontend-url.onrender.com  # Your frontend Render URL
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
STRIPE_SECRET_KEY=your-stripe-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend Service Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com/api  # Your backend Render URL
```

## 📋 Deployment Steps

### Step 1: Prepare Database
1. Create PostgreSQL database in Render
2. Copy the internal database URL (for DIRECT_URL)
3. Copy the external database URL (for DATABASE_URL)

### Step 2: Deploy Backend
1. Connect your GitHub repo to Render
2. Create new Web Service
3. Select your repo
4. Configure:
   - **Name:** careerai-backend
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install && npx prisma generate`
   - **Start Command:** `cd backend && npm start`
   - **Health Check Path:** `/api/health`
5. Add all environment variables from above
6. Deploy

### Step 3: Run Database Migrations
After backend deploys, open Render Shell for backend service:
```bash
cd backend
npx prisma migrate deploy
```

### Step 4: Get Backend URL
After deployment, copy your backend URL (e.g., `https://careerai-backend-xxx.onrender.com`)

### Step 5: Deploy Frontend
1. Create new Static Site in Render
2. Connect same GitHub repo
3. Configure:
   - **Name:** careerai-frontend
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`
5. Deploy

### Step 6: Update Backend FRONTEND_URL
1. Go to backend service settings
2. Update `FRONTEND_URL` environment variable to your frontend URL
3. Redeploy backend (or it will auto-update)

## ✅ Verification

1. **Backend Health Check:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Frontend:**
   - Visit your frontend URL
   - Should load without errors
   - Try logging in

3. **API Connection:**
   - Open browser console on frontend
   - Should see API calls going to backend
   - No CORS errors

## 🔧 Troubleshooting

### Backend won't start
- Check environment variables are set
- Check DATABASE_URL is correct
- Check logs in Render dashboard
- Verify Prisma migrations ran

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check backend CORS settings
- Verify backend is running (health check)
- Check browser console for errors

### Database connection errors
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
- Check DIRECT_URL matches DATABASE_URL
- Run migrations: `npx prisma migrate deploy`

## 📝 Notes

- **Build commands:** Already configured in render.yaml
- **Migrations:** Must run manually after first deployment
- **Environment variables:** Must be set in Render dashboard
- **CORS:** Backend allows frontend URL automatically if FRONTEND_URL is set correctly

