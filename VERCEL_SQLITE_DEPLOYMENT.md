# Why It Works Locally But Not on Vercel

## The Problem

**Vercel Limitations:**
- ✅ Great for frontend (React/Vite apps)
- ❌ Serverless functions are **stateless** (no persistent storage)
- ❌ SQLite database file **cannot persist** between function invocations
- ❌ File uploads **cannot be stored** permanently
- ❌ No continuous server process

**What Happens:**
1. Frontend deploys successfully ✅
2. Backend tries to use SQLite ❌
3. Database file gets wiped on each deployment ❌
4. Uploaded images are lost ❌

## Solution: Deploy Backend Separately

You need to deploy the **backend to a different service** that supports:
- ✅ Persistent file storage (for SQLite database)
- ✅ Continuous server process
- ✅ File uploads storage

## Recommended: Railway (Easiest)

Railway supports SQLite and persistent storage out of the box.

### Step 1: Deploy Backend to Railway

1. **Sign up at [railway.app](https://railway.app)** (free tier available)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `eeucafe` repository

3. **Configure Service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   ADMIN_KEY=your-strong-admin-key-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Get Your Backend URL:**
   - Railway will give you a URL like: `https://your-app.railway.app`
   - Your API will be at: `https://your-app.railway.app/api`

### Step 2: Update Vercel Frontend

1. **Go to Vercel Dashboard:**
   - Select your project
   - Go to Settings → Environment Variables

2. **Add/Update:**
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```

3. **Redeploy:**
   - Vercel will automatically redeploy with new environment variable

### Step 3: Verify

1. Check backend health: `https://your-app.railway.app/api/health`
2. Should return: `{"status":"ok","database":{"status":"ok",...}}`
3. Test admin page - should show "DB Connected"

## Alternative: Render

### Step 1: Deploy Backend to Render

1. **Sign up at [render.com](https://render.com)** (free tier available)

2. **Create New Web Service:**
   - Connect GitHub repository
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   ADMIN_KEY=your-strong-admin-key-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Important for Render:**
   - Render uses port from `PORT` environment variable
   - Free tier spins down after 15 minutes of inactivity
   - Database file persists in `/opt/render/project/src/data/`

5. **Update Database Path (Optional):**
   - In `backend/.env` on Render, set:
   ```
   DB_PATH=/opt/render/project/src/data/eeu-cafe.db
   ```

### Step 2: Update Vercel Frontend

Same as Railway - set `VITE_API_URL` to your Render backend URL.

## Alternative: Your Own Server (VPS)

If you have a VPS (DigitalOcean, AWS EC2, etc.):

1. **SSH into your server**
2. **Clone repository:**
   ```bash
   git clone https://github.com/sewbinorr-hub/eeucafe.git
   cd eeucafe/backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Use PM2 to keep server running:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name eeu-cafe-backend
   pm2 save
   pm2 startup  # Follow instructions to auto-start on reboot
   ```

6. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Why SQLite on Vercel Doesn't Work

### Vercel Serverless Functions:
```
Request → Function Starts → Process Request → Function Ends
         ↑                                    ↓
         └────────── No persistent storage ───┘
```

### What You Need:
```
Request → Server Running → SQLite File → Persistent Storage
         ↑                              ↓
         └────────── Continuous Process ───┘
```

## Architecture for Production

```
┌─────────────────┐
│  Vercel (Frontend) │  ← React app (static files)
│  vercel.app      │
└────────┬─────────┘
         │ HTTP Requests
         │ (API calls)
         ▼
┌─────────────────┐
│  Railway/Render  │  ← Backend server (always running)
│  (Backend)      │
└────────┬─────────┘
         │ File System
         ▼
┌─────────────────┐
│  SQLite Database │  ← Persistent file storage
│  backend/data/  │
│  eeu-cafe.db    │
└─────────────────┘
```

## Quick Setup Checklist

### Backend (Railway/Render):
- [ ] Deploy backend service
- [ ] Set `NODE_ENV=production`
- [ ] Set `ADMIN_KEY` (strong random string)
- [ ] Set `FRONTEND_URL` (your Vercel URL)
- [ ] Get backend URL
- [ ] Test: `https://your-backend.com/api/health`

### Frontend (Vercel):
- [ ] Set `VITE_API_URL` environment variable
- [ ] Point to your backend URL
- [ ] Redeploy frontend
- [ ] Test admin page shows "DB Connected"

## Troubleshooting

### "Cannot access SQLite database" on Vercel
- **Cause:** Backend not deployed or wrong URL
- **Fix:** Deploy backend to Railway/Render and update `VITE_API_URL`

### "Network error" when uploading images
- **Cause:** Backend not running or CORS issue
- **Fix:** Check backend is running, verify `FRONTEND_URL` in backend env

### Database resets on each deployment
- **Cause:** Using Vercel serverless functions
- **Fix:** Use Railway/Render which has persistent storage

## Summary

**Vercel = Frontend Only** ✅
- Deploy React app to Vercel
- Set `VITE_API_URL` to point to your backend

**Railway/Render = Backend** ✅
- Deploy Express server with SQLite
- Persistent file storage
- Continuous server process

**Result:** Frontend on Vercel + Backend on Railway/Render = Full working app! 🎉


