# Supabase Quick Setup - EEU CAFE

## Your Supabase Credentials

✅ **Project URL:** `https://dugrwatnnmjzeujifckb.supabase.co`  
✅ **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 1: Set Up Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **"New query"**
5. Copy and paste the contents of `SUPABASE_SCHEMA.sql`
6. Click **"Run"** (or press Ctrl+Enter)

You should see: ✅ Success. No rows returned

## Step 2: Set Up Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **"Create a new bucket"**
3. Name: `menu-images`
4. **Public bucket:** ✅ (check this - important!)
5. Click **"Create bucket"**

### Set Storage Policies

1. Go to **Storage** → **Policies**
2. Click on `menu-images` bucket
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Name: `Public read access`
6. Policy definition:
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');
```
7. Click **"Review"** then **"Save policy"**

8. Create another policy for uploads:
   - Name: `Allow uploads`
   - Policy definition:
```sql
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');
```

## Step 3: Set Environment Variables

### For Local Development

Create `frontend/.env`:
```
VITE_SUPABASE_URL=https://dugrwatnnmjzeujifckb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z3J3YXRubm1qemV1amlmY2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMjA1NTAsImV4cCI6MjA4MTY5NjU1MH0.gDrILTFwqnbZjpKHsYHriXe7pKv7Z9Lb7cFMjp_X00Q
VITE_ADMIN_KEY=your-secret-admin-key-change-this
```

### For Vercel Deployment

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = `https://dugrwatnnmjzeujifckb.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `VITE_ADMIN_KEY` = `your-secret-admin-key`

3. **Redeploy** your Vercel project

## Step 4: Test the Setup

1. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test database connection:**
   - Go to admin page
   - Should show "DB Connected" ✅

3. **Test menu save:**
   - Enter admin key
   - Make a change
   - Click "Publish Changes"
   - Should save successfully ✅

4. **Test image upload:**
   - Upload an image
   - Should upload to Supabase Storage ✅

## Verification Checklist

- [ ] Database schema created (menus table exists)
- [ ] Storage bucket `menu-images` created and set to public
- [ ] Storage policies set (read + upload)
- [ ] Environment variables set in `.env` (local)
- [ ] Environment variables set in Vercel (production)
- [ ] Frontend shows "DB Connected"
- [ ] Can save menu
- [ ] Can upload images

## Troubleshooting

### "Cannot connect to Supabase database"
- Check environment variables are set correctly
- Verify Supabase project is active
- Check browser console for errors

### "Failed to upload image"
- Verify `menu-images` bucket exists
- Check bucket is set to **Public**
- Verify storage policies are set

### "Invalid admin key"
- Check `VITE_ADMIN_KEY` is set correctly
- Make sure it matches what you enter in admin page

## What Changed

✅ **No backend needed anymore!**
- Frontend connects directly to Supabase
- Database: Supabase PostgreSQL
- Storage: Supabase Storage
- Works perfectly with Vercel!

## Next Steps

1. ✅ Set up database schema
2. ✅ Set up storage bucket
3. ✅ Set environment variables
4. ✅ Test locally
5. ✅ Deploy to Vercel
6. ✅ Update Vercel environment variables
7. 🎉 Done!


