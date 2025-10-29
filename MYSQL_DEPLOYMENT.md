# 🆓 CareerAI - MySQL Free Deployment Guide

Deploy your CareerAI platform with MySQL database completely FREE!

## 🚀 Option 1: Railway + PlanetScale MySQL (Recommended)

### Total Cost: $0/month
- **Database**: PlanetScale MySQL (Free tier - 1GB)
- **Backend**: Railway (500 hours free)
- **Frontend**: Railway (Free)

### Step-by-Step Deployment:

#### 1. Setup MySQL Database (PlanetScale)
1. Go to [PlanetScale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create new database → Name: `careerai`
4. Go to "Connect" → Create password
5. Copy connection string (MySQL format)

#### 2. Deploy Backend (Railway)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your CareerAI repository
5. Choose "backend" folder as root directory
6. Add environment variables:
   ```
   DATABASE_URL=mysql://username:password@host/careerai?sslaccept=strict
   JWT_SECRET=your-super-secure-jwt-secret-at-least-256-bits-long
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=https://your-frontend-domain.up.railway.app
   NODE_ENV=production
   ```

#### 3. Deploy Frontend (Railway)
1. Click "New Service" → "GitHub Repo" → Same repository
2. Choose "frontend" folder as root directory
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.up.railway.app/api
   ```

#### 4. Setup Database
1. In Railway backend service terminal:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

---

## 🚀 Option 2: Render + Aiven MySQL

### Total Cost: $0/month
- **Database**: Aiven MySQL (Free tier - 1 month)
- **Backend**: Render (750 hours free)
- **Frontend**: Render (Free)

#### 1. Setup Database (Aiven)
1. Go to [Aiven.io](https://aiven.io)
2. Create free MySQL service
3. Get connection details

#### 2. Deploy Backend (Render)
1. Go to [Render.com](https://render.com)
2. Create "Web Service" → Connect GitHub
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
4. Add environment variables with MySQL DATABASE_URL

---

## 🚀 Option 3: Vercel + Railway MySQL

### Setup MySQL on Railway
1. Railway → New Project → "Deploy MySQL"
2. Get connection string
3. Deploy frontend to Vercel
4. Deploy backend to Vercel with MySQL URL

---

## 🔧 MySQL Environment Variables

### Backend (.env)
```env
# MySQL Database (keep your current format)
DATABASE_URL="mysql://user:password@host:3306/database"

# Required
JWT_SECRET="your-super-secure-jwt-secret-256-bits"
GROQ_API_KEY="gsk_your_groq_api_key"

# Optional
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# URLs
FRONTEND_URL="https://your-frontend-domain.com"
BACKEND_URL="https://your-backend-domain.com"
NODE_ENV="production"
```

---

## ✅ MySQL Deployment Checklist

### Pre-Deployment
- [ ] MySQL database created and accessible
- [ ] DATABASE_URL in correct MySQL format
- [ ] Prisma schema uses `provider = "mysql"`
- [ ] All environment variables set

### Post-Deployment
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate deploy`
- [ ] Test database connection
- [ ] Verify all features work

---

## 🔄 Database Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (if needed)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

---

## 🆘 MySQL Troubleshooting

### "Connection refused"
- Check if DATABASE_URL format is correct
- Ensure SSL settings: `?sslaccept=strict`
- Verify database is running and accessible

### "Table doesn't exist"
- Run migrations: `npx prisma migrate deploy`
- Check if schema.prisma has `provider = "mysql"`

### "Authentication failed"
- Verify username/password in DATABASE_URL
- Check if database user has proper permissions

---

## 💡 MySQL Hosting Options

### Free MySQL Hosting:
1. **PlanetScale** - 1GB free, excellent for production
2. **Aiven** - 1 month free trial
3. **Railway MySQL** - Deploy your own MySQL instance
4. **FreeSQLDatabase** - Free MySQL hosting
5. **db4free.net** - Free MySQL database

### Your Current Setup:
- Local MySQL: `mysql://root:password@localhost:3306/career_ai`
- Keep this for development
- Use cloud MySQL for production

---

## 🎉 Success!

Your CareerAI with MySQL is now deployed for free!

**What works:**
- ✅ MySQL database with Prisma ORM
- ✅ All existing data models
- ✅ No schema changes needed
- ✅ Same local development experience
- ✅ Free cloud deployment

**Next Steps:**
1. Test all features after deployment
2. Setup automated backups
3. Monitor database usage
4. Scale when needed