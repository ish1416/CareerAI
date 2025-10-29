# 🚀 Railway Deployment Guide

## Quick Deploy (2 Services)

### 1. Backend Service
1. Connect your GitHub repo to Railway
2. Create new service → Select your repo
3. Set service name: `careerai-backend`
4. Set environment variables:
   ```
   RAILWAY_SERVICE_NAME=backend
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_key
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
5. Deploy automatically

### 2. Frontend Service  
1. Create another service from same repo
2. Set service name: `careerai-frontend`
3. Set environment variables:
   ```
   RAILWAY_SERVICE_NAME=frontend
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
4. Deploy automatically

## Environment Variables Required

### Backend (.env)
```
PORT=5001
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your-super-secure-secret"
GROQ_API_KEY="gsk_your_groq_key"
GROQ_MODEL="llama-3.1-8b-instant"
FRONTEND_URL="https://your-frontend.railway.app"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
```

### Frontend (.env)
```
VITE_API_URL="https://your-backend.railway.app/api"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
```

## Database Setup
- Use Railway PostgreSQL addon or external database
- Migrations run automatically on backend deployment

## Custom Domains (Optional)
- Add custom domain in Railway dashboard
- Update FRONTEND_URL and VITE_API_URL accordingly

## Monitoring
- Check logs in Railway dashboard
- Both services will auto-restart on failure