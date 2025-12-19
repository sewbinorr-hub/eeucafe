# Vercel Deployment Guide

This guide will help you deploy the EEU CAFE frontend to Vercel. For the backend, you'll need to deploy it separately (see options below).

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- Vercel CLI (optional, for command-line deployment)
- GitHub account (recommended for automatic deployments)

## Option 1: Deploy Frontend Only (Recommended)

If you want to deploy the frontend to Vercel and keep the backend on a separate service (like Railway, Render, or your own server).

### Step 1: Prepare Frontend for Vercel

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-domain.com/api`

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add environment variables
6. Click "Deploy"

### Step 3: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Option 2: Deploy Both Frontend and Backend

Vercel supports serverless functions, but for a full Express backend, you have two options:

### Option 2A: Convert Backend to Vercel Serverless Functions

This requires restructuring the backend into serverless functions. See `api/` directory structure below.

### Option 2B: Deploy Backend Separately

Deploy backend to:
- **Railway** (recommended): Easy MongoDB integration
- **Render**: Free tier available
- **Heroku**: Paid plans
- **Your own server**: Full control

Then point frontend to backend URL.

## Backend Deployment Options

### Railway (Recommended)

1. Sign up at [railway.app](https://railway.app)
2. Create new project
3. Add MongoDB service
4. Deploy from GitHub
5. Set environment variables
6. Get your backend URL

### Render

1. Sign up at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add MongoDB service

## Environment Variables Setup

### Frontend (Vercel)

In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/Render/etc.)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
ADMIN_KEY=your-strong-admin-key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## CORS Configuration

Make sure your backend allows requests from your Vercel domain:

```env
FRONTEND_URL=https://your-app.vercel.app
```

## File Uploads

For file uploads to work, you have two options:

1. **Use a cloud storage service** (recommended):
   - AWS S3
   - Cloudinary
   - Uploadcare
   - Update upload route to use cloud storage

2. **Use Vercel Blob Storage** (if using Vercel serverless functions)

## Deployment Steps Summary

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable `VITE_API_URL`
5. Deploy

### Backend (Railway/Render)

1. Push code to GitHub
2. Create new service
3. Set root directory to `backend`
4. Add environment variables
5. Connect MongoDB
6. Deploy

## Automatic Deployments

Once connected to GitHub:
- **Vercel**: Automatically deploys on every push to main branch
- **Railway/Render**: Can be configured for auto-deploy

## Custom Domain

### Vercel

1. Go to project settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatically configured

### Backend

Update `FRONTEND_URL` in backend environment variables to include your custom domain.

## Monitoring

- **Vercel Analytics**: Built-in analytics for frontend
- **Vercel Logs**: View deployment and function logs
- **Backend Logs**: Check Railway/Render dashboard

## Troubleshooting

### Frontend Issues

1. **Build Fails:**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Check Node.js version compatibility

2. **API Calls Fail:**
   - Verify `VITE_API_URL` is set correctly
   - Check CORS configuration in backend
   - Verify backend is running and accessible

3. **Environment Variables Not Working:**
   - Ensure variables start with `VITE_` for Vite
   - Redeploy after adding new variables

### Backend Issues

1. **MongoDB Connection:**
   - Verify connection string
   - Check IP whitelist in MongoDB Atlas
   - Verify network connectivity

2. **CORS Errors:**
   - Update `FRONTEND_URL` in backend
   - Check allowed origins

## Quick Deploy Commands

```bash
# Frontend
cd frontend
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Cost Considerations

- **Vercel**: Free tier includes:
  - 100GB bandwidth
  - Unlimited deployments
  - Custom domains
  - SSL certificates

- **Railway**: Free tier includes:
  - $5 credit monthly
  - MongoDB integration

- **Render**: Free tier available with limitations

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to Railway/Render
3. Configure environment variables
4. Test all functionality
5. Set up custom domain (optional)
6. Enable monitoring and analytics

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
