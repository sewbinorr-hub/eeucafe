# Migrating to Supabase

Supabase is an excellent alternative that solves your Vercel deployment issues! It provides:
- ✅ **PostgreSQL Database** (cloud-hosted, no separate backend needed)
- ✅ **File Storage** (for images, replaces local uploads)
- ✅ **Auto-generated REST API** (can use directly from frontend)
- ✅ **Free Tier** (generous limits)
- ✅ **Works with Vercel** (no separate backend deployment needed!)

## Why Supabase is Great for Your App

### Current Setup (SQLite + Backend):
```
Frontend (Vercel) → Backend (Railway) → SQLite File
```

### With Supabase:
```
Frontend (Vercel) → Supabase (Database + Storage + API)
```
**No separate backend needed!** 🎉

## Benefits

1. **Simpler Architecture**
   - No need to deploy backend separately
   - Supabase provides database + storage + API
   - Can use Supabase client directly from frontend

2. **Better for Vercel**
   - Works perfectly with Vercel
   - No persistent storage issues
   - File uploads handled by Supabase Storage

3. **Free Tier**
   - 500 MB database
   - 1 GB file storage
   - 2 GB bandwidth
   - Usually enough for small apps

4. **Real-time Features** (bonus!)
   - Can add real-time menu updates
   - Live notifications when menu changes

## Migration Options

### Option 1: Use Supabase Client Directly (Recommended)

**Pros:**
- No backend needed at all
- Simpler architecture
- Works perfectly with Vercel
- Free tier sufficient

**Cons:**
- Admin key validation must be done via Supabase Row Level Security (RLS)
- Need to set up RLS policies

### Option 2: Keep Backend, Use Supabase as Database

**Pros:**
- Keep existing backend structure
- Easier migration (just change database)
- More control over API

**Cons:**
- Still need to deploy backend separately
- More complex setup

## Quick Start: Option 1 (Supabase Client)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Create new project
4. Wait for database to initialize (~2 minutes)

### Step 2: Set Up Database Schema

In Supabase SQL Editor, run:

```sql
-- Create menus table
CREATE TABLE menus (
  id BIGSERIAL PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  slots JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date
CREATE INDEX idx_menus_date ON menus(date);

-- Create index on updated_at
CREATE INDEX idx_menus_updated_at ON menus(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read menus
CREATE POLICY "Menus are viewable by everyone"
  ON menus FOR SELECT
  USING (true);

-- Policy: Only authenticated users with admin key can insert/update
-- We'll use a service role key for admin operations
CREATE POLICY "Admins can insert menus"
  ON menus FOR INSERT
  WITH CHECK (true);  -- We'll validate admin key in application

CREATE POLICY "Admins can update menus"
  ON menus FOR UPDATE
  USING (true);
```

### Step 3: Set Up Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Create new bucket: `menu-images`
3. Set to **Public** (or Private with signed URLs)
4. Add policy to allow uploads

### Step 4: Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### Step 5: Create Supabase Client

Create `frontend/src/services/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 6: Update Environment Variables

**Frontend `.env`:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-key  # For admin operations
```

### Step 7: Update API Service

Replace `frontend/src/services/api.js` to use Supabase instead of axios.

## Quick Start: Option 2 (Backend with Supabase)

### Step 1: Create Supabase Project

Same as Option 1

### Step 2: Set Up Database Schema

Same SQL as Option 1

### Step 3: Install Supabase in Backend

```bash
cd backend
npm install @supabase/supabase-js
npm uninstall better-sqlite3  # Remove SQLite
```

### Step 4: Update Backend Database Module

Replace `backend/database/db.js` to use Supabase PostgreSQL instead of SQLite.

### Step 5: Update Environment Variables

**Backend `.env`:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
ADMIN_KEY=your-admin-key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 6: Update File Uploads

Use Supabase Storage instead of local file system.

## Comparison

| Feature | SQLite + Backend | Supabase |
|---------|------------------|----------|
| **Deployment** | Frontend + Backend separate | Frontend only |
| **Database** | File-based (SQLite) | Cloud PostgreSQL |
| **File Storage** | Local filesystem | Supabase Storage |
| **Backend Needed** | Yes (Railway/Render) | No (Option 1) or Yes (Option 2) |
| **Vercel Compatible** | ❌ (needs separate backend) | ✅ (works directly) |
| **Free Tier** | Limited | Generous |
| **Setup Complexity** | Medium | Easy (Option 1) |

## Recommendation

**For your use case, I recommend Option 1:**
- ✅ Simplest setup
- ✅ Works perfectly with Vercel
- ✅ No separate backend deployment
- ✅ Free tier is sufficient
- ✅ File storage included

## Next Steps

Would you like me to:
1. **Migrate to Supabase Option 1** (no backend, use Supabase client directly)?
2. **Migrate to Supabase Option 2** (keep backend, use Supabase as database)?
3. **Just show you the code changes** so you can decide?

Let me know which option you prefer!


