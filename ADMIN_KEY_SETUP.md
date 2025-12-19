# Admin Key Setup Guide

## Error: "Invalid admin key"

This error means the admin key you entered doesn't match the one configured in your environment variables.

## Quick Fix

### Step 1: Set Admin Key in Environment Variables

**For Local Development:**

Create `frontend/.env` file (if it doesn't exist):

```env
VITE_ADMIN_KEY=your-secret-admin-key-here
```

Replace `your-secret-admin-key-here` with a strong random string, for example:
- `eeu-cafe-admin-2024-secure-key`
- `my-super-secret-admin-key-12345`
- Or generate a random one: https://randomkeygen.com/

**Important:** 
- ✅ Use a strong, random string
- ✅ Keep it secret
- ✅ Don't commit it to git (it's in .gitignore)

**For Vercel Deployment:**

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Key:** `VITE_ADMIN_KEY`
   - **Value:** `your-secret-admin-key-here` (same as local)
3. **Redeploy** your project

### Step 2: Use the Same Key in Admin Page

1. Go to admin page
2. Enter the **exact same** admin key you set in environment variables
3. Click "Publish Changes"
4. Should work! ✅

## Generate a Secure Admin Key

You can generate a secure random key:

**Option 1: Online Generator**
- Visit: https://randomkeygen.com/
- Use "Fort Knox Password" or "CodeIgniter Encryption Keys"

**Option 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 3: PowerShell (Windows)**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Example Setup

**Local `.env` file:**
```env
VITE_SUPABASE_URL=https://dugrwatnnmjzeujifckb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_KEY=eeu-cafe-2024-admin-secure-key-xyz123
```

**In Admin Page:**
- Enter: `eeu-cafe-2024-admin-secure-key-xyz123`
- Click "Publish Changes"
- ✅ Should work!

## Troubleshooting

### "Admin key is required"
- **Fix:** Make sure you enter an admin key in the admin page input field

### "Invalid admin key"
- **Fix:** 
  1. Check `frontend/.env` has `VITE_ADMIN_KEY` set
  2. Restart dev server after changing `.env`
  3. Make sure you're entering the **exact same** key (case-sensitive, no extra spaces)

### Works locally but not on Vercel
- **Fix:** 
  1. Check Vercel environment variables
  2. Make sure `VITE_ADMIN_KEY` is set
  3. Redeploy after adding environment variable

### Key works but suddenly stops working
- **Fix:** 
  1. Check if `.env` file was changed
  2. Restart dev server
  3. Clear browser cache/localStorage

## Security Notes

⚠️ **Important:**
- Admin key should be **secret** - don't share it
- Use different keys for development and production
- Don't commit `.env` file to git (already in .gitignore)
- Change default key in production
- Use strong, random strings

## Default Key (Development Only)

For development/testing, you can use the default:
- Default: `your-secret-admin-key-change-this`
- ⚠️ **Change this for production!**

## Verification

To verify your admin key is set correctly:

1. Check `.env` file exists and has `VITE_ADMIN_KEY`
2. Restart dev server
3. Enter the key in admin page
4. Should save successfully ✅
