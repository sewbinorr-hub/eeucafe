# Supabase Storage Setup for Images

## Step-by-Step Image Storage Setup

### Step 1: Create Storage Bucket

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** (left sidebar)
4. Click **"Create a new bucket"**
5. Fill in:
   - **Name:** `menu-images`
   - **Public bucket:** ✅ **CHECK THIS** (important for public access)
6. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

You need to allow:
- **Public read access** (anyone can view images)
- **Authenticated uploads** (admin can upload)

#### Policy 1: Public Read Access

1. Go to **Storage** → **Policies**
2. Click on `menu-images` bucket
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Fill in:
   - **Policy name:** `Public read access`
   - **Allowed operation:** `SELECT` (read)
   - **Policy definition:**
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'menu-images');
   ```
6. Click **"Review"** then **"Save policy"**

#### Policy 2: Allow Uploads

1. Click **"New Policy"** again
2. Select **"For full customization"**
3. Fill in:
   - **Policy name:** `Allow uploads`
   - **Allowed operation:** `INSERT` (upload)
   - **Policy definition:**
   ```sql
   CREATE POLICY "Allow uploads"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'menu-images');
   ```
4. Click **"Review"** then **"Save policy"**

#### Policy 3: Allow Updates (Optional - for replacing images)

1. Click **"New Policy"**
2. Select **"For full customization"**
3. Fill in:
   - **Policy name:** `Allow updates`
   - **Allowed operation:** `UPDATE`
   - **Policy definition:**
   ```sql
   CREATE POLICY "Allow updates"
   ON storage.objects FOR UPDATE
   USING (bucket_id = 'menu-images');
   ```
4. Click **"Review"** then **"Save policy"**

#### Policy 4: Allow Deletes (Optional - for removing images)

1. Click **"New Policy"**
2. Select **"For full customization"**
3. Fill in:
   - **Policy name:** `Allow deletes`
   - **Allowed operation:** `DELETE`
   - **Policy definition:**
   ```sql
   CREATE POLICY "Allow deletes"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'menu-images');
   ```
4. Click **"Review"** then **"Save policy"**

### Step 3: Verify Setup

1. **Test Upload:**
   - Go to admin page
   - Try uploading an image
   - Should upload successfully ✅

2. **Test Display:**
   - Image should appear in menu card
   - Image URL should be: `https://dugrwatnnmjzeujifckb.supabase.co/storage/v1/object/public/menu-images/...`

3. **Check Storage:**
   - Go to Supabase → Storage → `menu-images`
   - Should see uploaded images ✅

## Image URL Format

Images are stored at:
```
https://dugrwatnnmjzeujifckb.supabase.co/storage/v1/object/public/menu-images/{filename}
```

Example:
```
https://dugrwatnnmjzeujifckb.supabase.co/storage/v1/object/public/menu-images/1734612345678-123456789.jpg
```

## How It Works

1. **Upload:**
   - Admin uploads image in admin page
   - Image is uploaded to Supabase Storage bucket `menu-images`
   - Supabase returns public URL
   - URL is saved in menu data (JSON in database)

2. **Display:**
   - Menu data is fetched from Supabase
   - Image URLs are included in the data
   - React components display images using the URLs
   - Images are served directly from Supabase CDN

## Troubleshooting

### "Failed to upload image"
- ✅ Check bucket `menu-images` exists
- ✅ Verify bucket is set to **Public**
- ✅ Check upload policy is set
- ✅ Verify admin key is correct

### "Image not displaying"
- ✅ Check image URL is valid (starts with `https://`)
- ✅ Verify bucket is **Public** (not private)
- ✅ Check browser console for CORS errors
- ✅ Verify image exists in Supabase Storage

### "CORS error"
- ✅ Bucket must be **Public**
- ✅ Check storage policies allow read access
- ✅ Verify Supabase project is active

### "403 Forbidden" when viewing image
- ✅ Bucket is not public - set it to public
- ✅ Missing read policy - add public read policy

## Storage Limits (Free Tier)

- **1 GB** file storage
- **2 GB** bandwidth per month
- Usually enough for hundreds of images

## Image Optimization Tips

1. **Compress images before upload:**
   - Use tools like TinyPNG or ImageOptim
   - Recommended: Max 1MB per image

2. **Use appropriate formats:**
   - JPG for photos
   - PNG for graphics with transparency
   - WebP for best compression (if supported)

3. **Resize images:**
   - Menu images don't need to be huge
   - Recommended: 800x600px max

## File Naming

Images are automatically named:
```
{timestamp}-{random}.{extension}
```

Example: `1734612345678-123456789.jpg`

This ensures:
- ✅ Unique filenames
- ✅ No conflicts
- ✅ Easy to identify upload time

## Cleanup (Optional)

To delete old images:
1. Go to Supabase → Storage → `menu-images`
2. Select images to delete
3. Click "Delete"

Or use Supabase API to delete programmatically.
