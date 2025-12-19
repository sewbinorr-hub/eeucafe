# Supabase Setup Guide for EEU CAFE

## Why Supabase?

- ✅ **No separate backend deployment needed**
- ✅ **Works perfectly with Vercel**
- ✅ **PostgreSQL database** (cloud-hosted)
- ✅ **File storage** for images
- ✅ **Free tier** (500 MB DB, 1 GB storage)
- ✅ **Auto-generated REST API**

## Step-by-Step Setup

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Verify email

### 2. Create New Project

1. Click "New Project"
2. Fill in:
   - **Name:** `eeu-cafe`
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
3. Click "Create new project"
4. Wait ~2 minutes for setup

### 3. Get Your Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGc...`
   - **service_role key:** `eyJhbGc...` (keep secret!)

### 4. Set Up Database Schema

1. Go to **SQL Editor**
2. Click "New query"
3. Paste and run:

```sql
-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id BIGSERIAL PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  slots JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_menus_date ON menus(date);
CREATE INDEX IF NOT EXISTS idx_menus_updated_at ON menus(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read menus (public access)
CREATE POLICY "Public read access"
  ON menus FOR SELECT
  USING (true);

-- Policy: Allow inserts (we'll validate admin key in app)
CREATE POLICY "Allow inserts"
  ON menus FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (we'll validate admin key in app)
CREATE POLICY "Allow updates"
  ON menus FOR UPDATE
  USING (true);
```

4. Click "Run" (or press Ctrl+Enter)

### 5. Set Up Storage for Images

1. Go to **Storage**
2. Click "Create a new bucket"
3. Name: `menu-images`
4. **Public bucket:** ✅ (check this)
5. Click "Create bucket"

6. **Set up storage policies:**
   - Go to **Storage** → **Policies**
   - Click on `menu-images` bucket
   - Add policy:

```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Allow authenticated uploads (we'll use service key)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');
```

### 6. Install Supabase in Frontend

```bash
cd frontend
npm install @supabase/supabase-js
```

### 7. Create Supabase Client

Create `frontend/src/services/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 8. Set Environment Variables

**Vercel Environment Variables:**
1. Go to Vercel project → Settings → Environment Variables
2. Add:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_SUPABASE_SERVICE_KEY=eyJhbGc...  # For admin operations
   VITE_ADMIN_KEY=your-admin-key
   ```

**Local `.env` file:**
Create `frontend/.env`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_SERVICE_KEY=eyJhbGc...
VITE_ADMIN_KEY=your-admin-key
```

### 9. Update API Service

Replace `frontend/src/services/api.js` to use Supabase.

## Database Schema

Your `menus` table structure:
- `id` - Auto-incrementing primary key
- `date` - Text (YYYY-MM-DD format), unique
- `slots` - JSONB (stores menu slots array)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Storage Structure

Images stored in `menu-images` bucket:
- Path: `menu-images/{date}/{filename}`
- Public URL: `https://xxxxx.supabase.co/storage/v1/object/public/menu-images/{filename}`

## Security

- **Public read:** Anyone can view menus
- **Admin write:** Validated via admin key in application
- **Service key:** Used for admin operations (keep secret!)

## Testing

1. **Test database:**
   - Go to Supabase → Table Editor
   - Should see `menus` table
   - Try inserting a test row

2. **Test storage:**
   - Go to Supabase → Storage
   - Upload a test image to `menu-images` bucket
   - Check public URL works

3. **Test API:**
   - Frontend should connect to Supabase
   - Admin page should show "DB Connected"

## Migration from SQLite

If you have existing data in SQLite:

1. Export SQLite data to JSON
2. Use Supabase dashboard or API to import
3. Or write a migration script

## Cost

**Free Tier:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- Usually enough for small apps

**Paid Plans:**
- Start at $25/month
- More storage and bandwidth
- Better performance

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

