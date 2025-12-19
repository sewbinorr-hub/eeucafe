# Vercel Environment Variables Setup

## Problem: "Invalid admin key" Error

If you're seeing this error on Vercel, it means the `VITE_ADMIN_KEY` environment variable is not set or doesn't match what you're entering.

## Solution: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **eeucafe** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Environment Variables

Add these **3 environment variables**:

#### 1. Supabase URL
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://dugrwatnnmjzeujifckb.supabase.co`
- **Environment:** Production, Preview, Development (select all)

#### 2. Supabase Anon Key
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z3J3YXRubm1qemV1amlmY2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMjA1NTAsImV4cCI6MjA4MTY5NjU1MH0.gDrILTFwqnbZjpKHsYHriXe7pKv7Z9Lb7cFMjp_X00Q`
- **Environment:** Production, Preview, Development (select all)

#### 3. Admin Key (Important!)
- **Key:** `VITE_ADMIN_KEY`
- **Value:** `your-secret-admin-key-here` (choose a strong password)
- **Environment:** Production, Preview, Development (select all)

⚠️ **Important:** 
- Use the **same admin key** you enter in the admin page
- Make it strong and secret (at least 16 characters)
- Don't use simple passwords like "admin" or "password"

### Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **3 dots** (⋮) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

Or push a new commit to trigger automatic redeploy.

### Step 4: Verify

1. Go to your Vercel app URL
2. Navigate to admin page
3. Enter the admin key you set in `VITE_ADMIN_KEY`
4. Try uploading an image
5. Should work! ✅

## Quick Checklist

- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] `VITE_ADMIN_KEY` is set (and matches what you enter)
- [ ] All variables selected for Production, Preview, Development
- [ ] Redeployed after setting variables

## Generate a Strong Admin Key

You can generate a strong random key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use an online generator
# Just search "random password generator"
```

## Troubleshooting

### Still getting "Invalid admin key"?

1. **Check the exact value:**
   - Go to Vercel → Settings → Environment Variables
   - Verify `VITE_ADMIN_KEY` value
   - Make sure there are no extra spaces

2. **Check you're using the same key:**
   - The key you enter in admin page must **exactly match** `VITE_ADMIN_KEY`
   - Case-sensitive
   - No extra spaces

3. **Redeploy after changes:**
   - Environment variables are baked into the build
   - Must redeploy after adding/changing variables

4. **Check browser console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for any clues

### "Cannot connect to Supabase database"?

- Check `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_ANON_KEY` is correct
- Verify Supabase project is active

### Images not uploading?

- Check `VITE_ADMIN_KEY` is set and matches
- Verify Supabase Storage bucket exists
- Check storage policies are set

## Security Note

⚠️ **Important Security Consideration:**

Currently, admin key validation happens in the **frontend code**. This means:
- The admin key is exposed in the JavaScript bundle
- Anyone can view it in browser DevTools

**For better security (optional future improvement):**
- Use Supabase Row Level Security (RLS) policies
- Create a serverless function for admin operations
- Or use Supabase Auth for proper authentication

**For now (acceptable for simple apps):**
- Admin key provides basic protection
- Most users won't look at the code
- Supabase storage policies provide additional protection

## Example Setup

**Vercel Environment Variables:**

```
VITE_SUPABASE_URL=https://dugrwatnnmjzeujifckb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_KEY=my-super-secret-admin-key-2024
```

**Admin Page:**
- Enter: `my-super-secret-admin-key-2024`
- Should work! ✅

## Summary

The "Invalid admin key" error happens because:
1. `VITE_ADMIN_KEY` is not set in Vercel, OR
2. The key you enter doesn't match `VITE_ADMIN_KEY`

**Fix:** Set `VITE_ADMIN_KEY` in Vercel environment variables and use the same key in the admin page.


