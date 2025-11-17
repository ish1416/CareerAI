# 🚀 Deploy CareerAI Frontend to Render

## Step 1: Prepare Frontend for Deployment

✅ **Files Created:**
- `frontend/.env.production` - Production environment variables
- `frontend/render.yaml` - Render configuration
- This deployment guide

## Step 2: Deploy to Render

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Click "New +" → "Static Site"

### 2. Connect Repository
- Choose "Build and deploy from a Git repository"
- Connect your GitHub account
- Select your `CareerAI` repository

### 3. Configure Static Site
- **Name**: `careerai-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend` ⚠️ **IMPORTANT**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 4. Environment Variables
Add this environment variable:
```
VITE_API_URL=https://careerai-backend-iakw.onrender.com/api
```

### 5. Advanced Settings
- **Auto-Deploy**: Yes
- **Pull Request Previews**: Optional

## Step 3: Configure Redirects (SPA Support)

Render will automatically handle SPA routing with the `render.yaml` configuration.

## Step 4: Deploy and Test

1. **Click "Create Static Site"**
2. **Wait for Build** (3-5 minutes)
3. **Test Your Site**: `https://your-frontend-name.onrender.com`

## Step 5: Update Backend with Frontend URL

Once deployed, update your backend environment variables in Render:
```
FRONTEND_URL=https://your-frontend-name.onrender.com
```

## Step 6: Update Google OAuth

Add your frontend URL to Google OAuth settings:
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Edit OAuth 2.0 Client
4. Add to Authorized JavaScript origins:
   ```
   https://your-frontend-name.onrender.com
   ```

## Expected Build Output

```bash
npm install && npm run build
✓ Building for production...
✓ Built in 45s
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── favicon.svg
```

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check for TypeScript errors

### Blank Page
- Verify VITE_API_URL is set correctly
- Check browser console for errors
- Ensure backend is running

### API Calls Fail
- Check CORS settings in backend
- Verify API URL is correct
- Test backend endpoints directly

## Free Tier Limitations

**Render Static Site (Free)**:
- 100GB bandwidth/month
- Global CDN included
- Custom domains supported
- Automatic SSL certificates

## Production Checklist

- [ ] Frontend deployed successfully
- [ ] Environment variables set
- [ ] Backend URL updated
- [ ] Google OAuth configured
- [ ] All pages load correctly
- [ ] API calls working
- [ ] Authentication flow working

---

**🎉 Your frontend will be live at:**
`https://your-frontend-name.onrender.com`