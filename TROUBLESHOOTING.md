# Troubleshooting: SQLite Database Access Issue

## Error Message
"Cannot access SQLite database. Changes cannot be saved until the database is accessible."

## Common Causes & Solutions

### 1. Backend Server Not Running

**Problem:** The frontend cannot connect to the backend API.

**Solution:**
1. Open a terminal in the `backend` folder
2. Run: `npm install` (if not done already)
3. Run: `npm run dev` or `npm start`
4. You should see: `🚀 Server running on port 5000`
5. You should see: `✅ Database initialized successfully`

**Check if backend is running:**
- Open browser: `http://localhost:5000/api/health`
- Should return JSON with `"status": "ok"` and `"database": { "status": "ok" }`

### 2. Frontend API URL Not Configured

**Problem:** Frontend doesn't know where the backend is.

**Solution:**
1. Create `frontend/.env` file (if it doesn't exist)
2. Add this line:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart the frontend dev server

**For Production:**
- Set `VITE_API_URL` in Vercel environment variables
- Point to your deployed backend URL

### 3. CORS Issues

**Problem:** Browser blocks requests due to CORS policy.

**Solution:**
- Backend already configured for CORS
- Make sure frontend URL matches what's in `backend/server.js`
- For local dev: `http://localhost:3000` or `http://localhost:5173`

### 4. Database File Permissions

**Problem:** Backend can't write to database file.

**Solution:**
1. Check if `backend/data/` directory exists
2. Ensure backend has write permissions
3. On Windows: Right-click `backend/data` folder → Properties → Security → Ensure your user has "Full control"

### 5. Database File Locked

**Problem:** Another process is using the database.

**Solution:**
1. Close all backend server instances
2. Check if database file is open in another program
3. Restart the backend server

### 6. Port Already in Use

**Problem:** Port 5000 is already taken.

**Solution:**
1. Change port in `backend/.env`:
   ```
   PORT=5001
   ```
2. Update `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```
3. Restart both servers

## Quick Diagnostic Steps

### Step 1: Check Backend Status
```bash
cd backend
npm run dev
```

Look for:
- ✅ `🚀 Server running on port 5000`
- ✅ `✅ Database initialized successfully`
- ✅ `📁 Database location: ...`

### Step 2: Test Backend API
Open in browser: `http://localhost:5000/api/health`

Expected response:
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

### Step 3: Check Frontend Configuration
1. Verify `frontend/.env` exists
2. Check `VITE_API_URL` is set correctly
3. Restart frontend dev server after changing `.env`

### Step 4: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors when accessing admin page
4. Go to Network tab
5. Check if `/api/health` request succeeds

## Testing the Connection

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Get Menu
```bash
curl http://localhost:5000/api/menu/2024-12-19
```

### Test 3: Save Menu (requires admin key)
```bash
curl -X POST http://localhost:5000/api/admin/menu \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{"date":"2024-12-19","slots":[]}'
```

## Still Not Working?

1. **Check Backend Logs:**
   - Look at terminal where backend is running
   - Check for error messages

2. **Check Frontend Logs:**
   - Open browser console (F12)
   - Look for network errors or API errors

3. **Verify Database File:**
   ```bash
   cd backend
   ls -la data/eeu-cafe.db  # Linux/Mac
   dir data\eeu-cafe.db     # Windows
   ```

4. **Reset Database (if corrupted):**
   - Stop backend server
   - Delete `backend/data/eeu-cafe.db`
   - Restart backend (will create new database)

## Common Error Messages

### "Network error. Please check if the backend server is running."
- **Fix:** Start the backend server

### "Request timeout"
- **Fix:** Check if backend is responding, increase timeout in code

### "Database health check failed"
- **Fix:** Check database file permissions, ensure backend can write

### "ECONNREFUSED"
- **Fix:** Backend server is not running or wrong port

## Need More Help?

1. Check backend terminal for error messages
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure both frontend and backend are running


