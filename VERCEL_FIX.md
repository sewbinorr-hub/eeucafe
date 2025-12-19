# Vercel 404 Fix Guide

## Problem
Getting 404 errors on Vercel deployment: `eeucafe-efjinn7fi-teges-projects.vercel.app`

## Solution Options

### Option 1: Configure Root Directory in Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **General**
3. Under **Root Directory**, set it to: `frontend`
4. Save and redeploy

This tells Vercel to treat the `frontend` folder as the project root, and it will use `frontend/vercel.json` automatically.

### Option 2: Use Root vercel.json (Current Setup)

The root `vercel.json` is now configured to build from the frontend directory. Make sure:

1. **Build Command**: `cd frontend && npm ci && npm run build`
2. **Output Directory**: `frontend/dist`
3. **Install Command**: `cd frontend && npm ci`

### Option 3: Manual Vercel Configuration

If the above doesn't work, manually configure in Vercel dashboard:

1. Go to **Settings** → **General**
2. Set:
   - **Framework Preset**: Other
   - **Root Directory**: (leave empty or set to root)
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm ci`

3. Go to **Settings** → **Environment Variables**
4. Add: `VITE_API_URL` = `https://your-backend-url.com/api`

## Verify Build Output

After deployment, check the build logs to ensure:
- ✅ Build completes successfully
- ✅ `frontend/dist` folder is created
- ✅ `index.html` exists in `frontend/dist`
- ✅ Assets are in `frontend/dist/assets`

## Common Issues

### Issue: Build fails
**Solution**: Check that all dependencies are in `frontend/package.json`

### Issue: 404 on all routes
**Solution**: Ensure the rewrite rule `"source": "/(.*)", "destination": "/index.html"` is present

### Issue: Assets not loading
**Solution**: Check that `outputDirectory` points to `frontend/dist` and assets are in `frontend/dist/assets`

## Quick Fix Commands

If you have Vercel CLI:

```bash
# Redeploy with new configuration
vercel --prod

# Check deployment logs
vercel logs
```

## After Fix

Once fixed, your app should be accessible at:
- Production: `https://eeucafe-efjinn7fi-teges-projects.vercel.app`
- All routes should work (/, /about, /admin)
