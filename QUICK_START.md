# 🚀 CareerAI - Quick Start Guide

## 🎯 Deploy in 5 Minutes (Free)

### Option 1: Railway (Recommended)
1. **Fork this repository** to your GitHub
2. **Get Groq API Key** (Free): https://console.groq.com
3. **Deploy Database**:
   - Go to [Railway.app](https://railway.app)
   - New Project → Add PostgreSQL
   - Copy connection string
4. **Deploy Backend**:
   - Add service → GitHub repo → Select `backend` folder
   - Add environment variables:
     ```
     DATABASE_URL=<your-railway-postgres-url>
     JWT_SECRET=your-super-secret-jwt-key-256-bits
     GROQ_API_KEY=gsk_your_groq_key_here
     FRONTEND_URL=https://your-frontend-domain.up.railway.app
     ```
5. **Deploy Frontend**:
   - Add service → GitHub repo → Select `frontend` folder
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-domain.up.railway.app/api
     ```
6. **Setup Database**:
   - In Railway backend service terminal:
     ```bash
     npx prisma migrate deploy
     npx prisma generate
     ```

### Option 2: Render + Supabase
1. **Database** (Supabase):
   - Create account at [Supabase.com](https://supabase.com)
   - New project → Get PostgreSQL URL
2. **Backend** (Render):
   - [Render.com](https://render.com) → New Web Service
   - Connect GitHub → Select backend folder
   - Build: `npm install && npx prisma generate`
   - Start: `npm start`
   - Add environment variables
3. **Frontend** (Render):
   - New Static Site → Connect GitHub
   - Build: `npm run build`
   - Publish: `dist`

## 🔧 Required Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-256-bit-secret-key"
GROQ_API_KEY="gsk_your_groq_key"  # Free at console.groq.com
FRONTEND_URL="https://your-frontend-domain.com"
```

### Frontend (.env)
```env
VITE_API_URL="https://your-backend-domain.com/api"
```

## 🎨 Optional Features (Add Later)

### Google OAuth
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Email (Gmail SMTP)
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### Payments (Stripe)
```env
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
```

## ✅ Verification Steps

1. **Backend Health**: Visit `https://your-backend-domain.com/api/health`
2. **Frontend**: Visit your frontend URL
3. **Database**: Check if you can register/login
4. **AI**: Try uploading a resume and analyzing it

## 🆘 Common Issues

### "Database connection failed"
- Check DATABASE_URL format
- Ensure database is running

### "CORS error"
- Update FRONTEND_URL in backend environment
- Check both URLs are correct

### "AI offline"
- Verify GROQ_API_KEY is set
- Check API key is valid at console.groq.com

## 🎉 Success!

Your CareerAI is now live! Share the frontend URL with users.

**Next Steps:**
- Add custom domain
- Setup SSL certificate
- Configure monitoring
- Add more features from DEPLOYMENT_FEATURES.md

**Need Help?**
- Check DEPLOYMENT_GUIDE.md for detailed instructions
- Create GitHub issue for support