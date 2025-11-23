# ✅ Render Deployment Checklist

## 📋 Pre-Deployment Checks

### ✅ Build Commands Verified
- [x] Backend build: `cd backend && npm install && npx prisma generate`
- [x] Backend start: `cd backend && npm start`
- [x] Frontend build: `cd frontend && npm install && npm run build`
- [x] Frontend publish: `./frontend/dist`

### ✅ Configuration Files
- [x] `render.yaml` - Configured correctly
- [x] Health check endpoint exists: `/api/health`
- [x] Backend entry point: `backend/src/index.js`
- [x] Server listens on PORT from environment

## 🚨 CRITICAL: Environment Variables

You **MUST** set these in Render Dashboard before deployment:

### Backend Required Variables:
```
✅ DATABASE_URL           - PostgreSQL connection string
✅ DIRECT_URL             - Same as DATABASE_URL for Render
✅ JWT_SECRET             - Random secret string (generate one)
✅ GROQ_API_KEY           - Get from https://console.groq.com
✅ FRONTEND_URL           - Set AFTER frontend deploys
✅ GOOGLE_CLIENT_ID       - Optional (for OAuth)
✅ GOOGLE_CLIENT_SECRET   - Optional (for OAuth)
✅ STRIPE_SECRET_KEY      - Optional (for payments)
✅ EMAIL_USER             - Optional (for emails)
✅ EMAIL_PASS             - Optional (for emails)
```

### Frontend Required Variables:
```
✅ VITE_API_URL           - Backend URL + /api (set AFTER backend deploys)
```

## 📝 Deployment Order

### 1️⃣ Deploy Backend First
1. Create Web Service in Render
2. Connect GitHub repo
3. Set **ALL** backend environment variables
4. Build will run: `npm install && prisma generate`
5. After deployment, **run migrations:**
   ```bash
   # In Render Shell for backend
   cd backend
   npx prisma migrate deploy
   ```

### 2️⃣ Deploy Frontend
1. Create Static Site in Render
2. Connect same GitHub repo
3. Set `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Build will run automatically
5. Site will publish from `frontend/dist`

### 3️⃣ Update Backend FRONTEND_URL
1. Go to backend environment variables
2. Update `FRONTEND_URL` = your frontend URL
3. This ensures CORS works correctly

## ✅ Post-Deployment Verification

### Backend Checks:
```bash
# Health check
curl https://your-backend.onrender.com/api/health
# Should return: {"status":"healthy",...}

# Test endpoint
curl https://your-backend.onrender.com/api/auth/test
```

### Frontend Checks:
- [ ] Frontend loads without errors
- [ ] No console errors in browser
- [ ] API calls go to correct backend URL
- [ ] Login/Register works
- [ ] No CORS errors

## 🔧 Common Issues & Fixes

### Issue: Backend fails to start
**Fix:**
- Check all environment variables are set
- Verify DATABASE_URL format is correct
- Check Render logs for specific errors
- Ensure migrations ran: `npx prisma migrate deploy`

### Issue: Frontend can't connect to backend
**Fix:**
- Verify VITE_API_URL is correct (includes `/api`)
- Check backend is running (health check)
- Verify CORS allows frontend URL
- Check browser console for specific errors

### Issue: Database connection fails
**Fix:**
- Use Render's internal database URL
- DIRECT_URL should match DATABASE_URL
- Check database is accessible from backend service
- Verify Prisma client generated: `npx prisma generate`

### Issue: Build fails
**Fix:**
- Check Node version (should be 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors
- Try building locally first

## 📊 Current Configuration Status

✅ **render.yaml** - Valid configuration
✅ **Health check** - `/api/health` endpoint exists
✅ **Build commands** - Correct paths
✅ **Start commands** - Correct paths
✅ **Static publish** - Points to `frontend/dist`
✅ **Server listen** - Will start on Render

## 🎯 Next Steps

1. **Review** `render.yaml` (already fixed)
2. **Set environment variables** in Render dashboard
3. **Deploy backend** first
4. **Run migrations** after backend deploys
5. **Deploy frontend** with backend URL
6. **Test** everything works
7. **Update** FRONTEND_URL in backend if needed

---

**Everything is ready for deployment! 🚀**

Just make sure to set all environment variables in Render dashboard before deploying.

