# Deploy Backend to Railway (Step-by-Step)

Railway is the easiest way to deploy your SQLite backend. It supports persistent storage and is free to start.

## Step 1: Sign Up

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Verify your email

## Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your `eeucafe` repository
5. Click **"Deploy Now"**

## Step 3: Configure Service

Railway will auto-detect your project. You need to configure it:

1. **Click on the service** that was created
2. Go to **Settings** tab
3. Set **Root Directory:** `backend`
4. Go to **Variables** tab

## Step 4: Set Environment Variables

Click **"New Variable"** and add:

```
NODE_ENV=production
```

```
PORT=5000
```

```
ADMIN_KEY=your-very-strong-random-key-here
```
⚠️ **Important:** Use a strong random string (at least 32 characters). You can generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```
Replace with your actual Vercel frontend URL.

## Step 5: Deploy

1. Railway will automatically start deploying
2. Watch the **Deployments** tab for progress
3. Wait for "Deploy Successful" ✅

## Step 6: Get Your Backend URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** (or use custom domain)
3. Your backend URL will be: `https://your-app.railway.app`
4. Your API will be at: `https://your-app.railway.app/api`

## Step 7: Test Backend

Open in browser: `https://your-app.railway.app/api/health`

Should return:
```json
{
  "status": "ok",
  "database": {
    "type": "SQLite",
    "status": "ok",
    "path": "...",
    "open": true
  }
}
```

## Step 8: Update Vercel Frontend

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add/Update:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
4. **Redeploy** your Vercel project

## Step 9: Verify Everything Works

1. **Test Frontend:**
   - Go to your Vercel URL
   - Navigate to admin page
   - Should show "DB Connected" ✅

2. **Test API:**
   - Try uploading an image
   - Try saving a menu
   - Should work! ✅

## Railway Free Tier Limits

- **$5 free credit** per month
- **500 hours** of usage
- **Persistent storage** included
- **Custom domains** supported

## Troubleshooting

### Build Fails
- Check **Deployments** tab for error logs
- Ensure `backend/package.json` has correct `start` script
- Check that all dependencies are in `package.json`

### Database Not Working
- Check **Logs** tab for errors
- Verify environment variables are set
- Check that `backend/data/` directory is writable

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check backend logs for CORS errors
- Ensure frontend URL includes `https://`

### Images Not Uploading
- Check **Logs** for upload errors
- Verify `backend/uploads/` directory exists
- Check file permissions

## Monitoring

- **Logs:** Real-time logs in Railway dashboard
- **Metrics:** CPU, Memory usage
- **Deployments:** History of all deployments

## Updating Backend

1. Push changes to GitHub
2. Railway automatically detects changes
3. Triggers new deployment
4. Zero-downtime deployment

## Database Backup

Railway persists your SQLite database file. To backup:

1. Use Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   railway run cat backend/data/eeu-cafe.db > backup.db
   ```

2. Or use Railway's volume backup feature (paid plans)

## Custom Domain (Optional)

1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain
4. Follow DNS instructions
5. Update `FRONTEND_URL` to match

## Cost Estimate

**Free Tier:**
- $5 credit/month
- Usually enough for small apps
- ~500 hours runtime

**Paid Plans:**
- Start at $5/month
- More resources
- Better performance

## Summary

✅ **Railway Advantages:**
- Easy deployment from GitHub
- Persistent storage for SQLite
- Free tier available
- Automatic deployments
- Simple environment variable management

✅ **Your Setup:**
- Frontend: Vercel (free)
- Backend: Railway (free tier)
- Database: SQLite (file-based, no extra cost)
- Total Cost: **$0/month** (on free tiers)

🎉 **You're all set!**


