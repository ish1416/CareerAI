# 🚀 CareerAI Complete Deployment Guide

## 📋 Table of Contents
1. [Quick Local Setup](#quick-local-setup)
2. [Free Cloud Deployment Options](#free-cloud-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Domain & SSL](#domain--ssl)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🏃‍♂️ Quick Local Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone & Setup
```bash
git clone <your-repo>
cd CareerAI

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Configure Environment
Edit `backend/.env`:
```env
DATABASE_URL="postgresql://careerai:careerai123@localhost:5432/careerai"
JWT_SECRET="your-super-secret-jwt-key-here"
GROQ_API_KEY="your-groq-api-key"  # Get free at console.groq.com
GOOGLE_CLIENT_ID="your-google-oauth-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
```

### 3. Start with Docker
```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/api/health

---

## ☁️ Free Cloud Deployment

### Option 1: Railway (Recommended - Easiest)

#### Database (PostgreSQL)
1. Go to [Railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string

#### Backend Deployment
1. Connect GitHub repo
2. Select `backend` folder
3. Add environment variables:
```env
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=your-jwt-secret
GROQ_API_KEY=your-groq-key
FRONTEND_URL=https://your-frontend-domain.com
```
4. Deploy automatically triggers

#### Frontend Deployment
1. New service → Connect repo
2. Select `frontend` folder
3. Add build command: `npm run build`
4. Add environment variable:
```env
VITE_API_URL=https://your-backend-domain.railway.app/api
```

### Option 2: Render + Supabase

#### Database (Supabase)
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string

#### Backend (Render)
1. Go to [Render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Add environment variables

#### Frontend (Render/Netlify)
1. New Static Site
2. Build Command: `npm run build`
3. Publish Directory: `dist`

### Option 3: Vercel + PlanetScale

#### Database (PlanetScale)
1. [PlanetScale.com](https://planetscale.com) - Free tier
2. Create database
3. Get connection string

#### Backend (Vercel)
1. Deploy to Vercel
2. Add environment variables
3. Configure build settings

#### Frontend (Vercel)
1. Deploy frontend to Vercel
2. Configure environment variables

---

## 🏭 Production Deployment

### Option 1: AWS (Complete Setup)

#### 1. Database (RDS PostgreSQL)
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier careerai-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username careerai \
  --master-user-password YourSecurePassword \
  --allocated-storage 20
```

#### 2. Backend (ECS Fargate)
```bash
# Build and push Docker image
docker build -t careerai-backend ./backend
docker tag careerai-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/careerai-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/careerai-backend:latest

# Create ECS service
aws ecs create-service \
  --cluster careerai-cluster \
  --service-name careerai-backend \
  --task-definition careerai-backend:1 \
  --desired-count 2
```

#### 3. Frontend (S3 + CloudFront)
```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://careerai-frontend-bucket

# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### Option 2: DigitalOcean Droplet

#### 1. Create Droplet
```bash
# Create Ubuntu 22.04 droplet
doctl compute droplet create careerai-prod \
  --size s-2vcpu-2gb \
  --image ubuntu-22-04-x64 \
  --region nyc1
```

#### 2. Setup Server
```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone your repo
git clone <your-repo>
cd CareerAI

# Setup environment
cp backend/.env.example backend/.env
# Edit with production values

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5001

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Security
JWT_SECRET="your-super-secure-jwt-secret-256-bits"

# AI (Choose one)
GROQ_API_KEY="gsk_..." # Free, unlimited
OPENAI_API_KEY="sk-..." # Paid
HF_API_KEY="hf_..." # Free with limits

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="https://yourdomain.com/api/auth/google/callback"

# Email (SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="CareerAI <noreply@yourdomain.com>"

# Payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# URLs
FRONTEND_URL="https://yourdomain.com"
BACKEND_URL="https://api.yourdomain.com"
```

### Frontend (.env)
```env
VITE_API_URL="https://api.yourdomain.com/api"
```

---

## 🗄️ Database Setup

### Local Development
```bash
# Start PostgreSQL with Docker
docker run --name careerai-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### Production
```bash
# Run migrations on production database
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### Backup Strategy
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20240101.sql
```

---

## 🌐 Domain & SSL

### 1. Domain Setup
- Buy domain from Namecheap, GoDaddy, etc.
- Point DNS to your hosting provider

### 2. SSL Certificate
```bash
# Using Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### 3. Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 Monitoring & Maintenance

### 1. Health Monitoring
```bash
# Setup monitoring script
#!/bin/bash
curl -f https://api.yourdomain.com/api/health || echo "API DOWN" | mail -s "CareerAI Alert" admin@yourdomain.com
```

### 2. Log Management
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Log rotation
echo '/var/log/careerai/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}' > /etc/logrotate.d/careerai
```

### 3. Performance Monitoring
- Use tools like New Relic, DataDog, or Grafana
- Monitor response times, error rates, database performance

### 4. Security Updates
```bash
# Regular updates
apt update && apt upgrade -y
docker-compose pull
docker-compose up -d
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Post-Deployment
- [ ] Health checks passing
- [ ] All features working
- [ ] Performance acceptable
- [ ] Monitoring setup
- [ ] Error tracking configured

### Security Checklist
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication secure
- [ ] Database access restricted
- [ ] Secrets properly managed

---

## 💰 Cost Estimates

### Free Tier (Monthly)
- **Railway**: $0 (500 hours free)
- **Supabase**: $0 (500MB database)
- **Vercel**: $0 (100GB bandwidth)
- **Total**: $0/month

### Production (Monthly)
- **DigitalOcean Droplet**: $12/month
- **Managed Database**: $15/month
- **Domain**: $1/month
- **Total**: ~$28/month

### Enterprise (Monthly)
- **AWS ECS**: $50/month
- **RDS**: $30/month
- **CloudFront**: $10/month
- **Total**: ~$90/month

---

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is running
   - Check firewall settings

2. **CORS Errors**
   - Update FRONTEND_URL in backend
   - Check CORS configuration

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

4. **SSL Issues**
   - Verify certificate paths
   - Check domain DNS propagation

### Getting Help
- Check logs: `docker-compose logs`
- Test endpoints: `curl https://api.yourdomain.com/api/health`
- Database status: `docker-compose exec postgres pg_isready`

---

## 🎉 Success!

Your CareerAI application should now be live and accessible to users worldwide!

**Next Steps:**
1. Set up monitoring and alerts
2. Plan regular backups
3. Monitor performance and scale as needed
4. Gather user feedback and iterate

**Support:**
- Documentation: Check README files
- Issues: Create GitHub issues
- Community: Join discussions