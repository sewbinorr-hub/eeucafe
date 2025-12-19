# Quick Start Guide - Fix Database Access Issue

## The Problem
You're seeing: "Cannot access SQLite database. Changes cannot be saved until the database is accessible."

## The Solution (3 Steps)

### Step 1: Start the Backend Server

**Option A: Using PowerShell Script (Easiest)**
```powershell
# In the project root directory
.\start-backend.ps1
```

**Option B: Manual Start**
```bash
cd backend
npm install  # Only needed first time
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📦 Environment: development
💾 Database: SQLite at ...\backend\data\eeu-cafe.db
✅ Database initialized successfully
```

### Step 2: Configure Frontend API URL

Create `frontend/.env` file with:
```
VITE_API_URL=http://localhost:5000/api
```

**Important:** After creating/editing `.env`, restart your frontend dev server!

### Step 3: Verify Connection

1. Open browser: `http://localhost:5000/api/health`
2. Should see JSON response with `"status": "ok"` and `"database": { "status": "ok" }`
3. Check admin page - database status should show "DB Connected" ✅

## Common Issues

### Backend won't start?
- Check if port 5000 is already in use
- Make sure you're in the `backend` directory
- Run `npm install` first

### Frontend still shows "DB Disconnected"?
- Make sure backend is running (check Step 1)
- Verify `frontend/.env` has `VITE_API_URL=http://localhost:5000/api`
- **Restart frontend dev server** after changing `.env`
- Check browser console (F12) for errors

### Database file not found?
- Backend will create it automatically on first run
- Make sure `backend/data/` directory exists
- Check file permissions

## Testing

1. **Test Backend:**
   - Open: `http://localhost:5000/api/health`
   - Should return: `{"status":"ok","database":{"status":"ok",...}}`

2. **Test Frontend:**
   - Go to admin page
   - Should show: "DB Connected" with green indicator

3. **Test Save:**
   - Enter admin key (from `backend/.env` ADMIN_KEY)
   - Make a change
   - Click "Publish Changes"
   - Should see "Menu saved successfully!"

## Still Having Issues?

See `TROUBLESHOOTING.md` for detailed solutions.
