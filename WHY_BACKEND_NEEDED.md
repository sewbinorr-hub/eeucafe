# Why Do We Need a Backend Server with SQLite?

## The Confusion
You might think: "SQLite is a file-based database, so why do I need a backend server?"

## The Answer

Even though SQLite is simpler than MongoDB (no separate database server), you **still need a backend server** because:

### 1. **Browser Security Restrictions** 🔒

**The Problem:**
- Your React app runs in the **browser** (client-side)
- The SQLite database file is on the **server's filesystem**
- Browsers **cannot directly access** files on the server for security reasons

**Why?**
- If browsers could access server files directly, any website could read/write files on your computer
- This would be a major security vulnerability

**The Solution:**
- Backend server acts as a **bridge** between browser and database
- Browser → Backend API → SQLite Database

```
┌─────────┐         ┌──────────┐         ┌─────────────┐
│ Browser │  HTTP   │ Backend  │  File   │   SQLite    │
│ (React) │ ──────> │ Server   │ ──────> │  Database   │
│         │ Request │ (Node.js) │ System  │  (File)     │
└─────────┘         └──────────┘         └─────────────┘
   ❌ Cannot          ✅ Can access        📁 backend/data/
   access files       server files         eeu-cafe.db
```

### 2. **File Uploads** 📤

**The Problem:**
- When you upload an image in the admin page, where does it go?
- Browsers cannot save files directly to the server

**The Solution:**
- Backend receives the file via HTTP POST
- Backend saves it to `backend/uploads/` directory
- Backend returns the file URL to frontend

**Code Example:**
```javascript
// Frontend (Browser) - CANNOT save files
const formData = new FormData()
formData.append('image', file)
await axios.post('http://localhost:5000/api/admin/upload', formData)

// Backend (Server) - CAN save files
router.post('/upload', upload.single('image'), (req, res) => {
  // File is saved to backend/uploads/
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ imageUrl })
})
```

### 3. **Authentication & Security** 🔐

**The Problem:**
- Admin key validation must happen on the server
- If done in browser, anyone can see your admin key in the code

**The Solution:**
- Backend validates admin key before allowing operations
- Frontend sends admin key in request headers
- Backend checks it against `ADMIN_KEY` environment variable

**Code Example:**
```javascript
// Backend validates admin key
const checkAdminKey = (req, res, next) => {
  const adminKey = req.headers['x-admin-key']
  const validKey = process.env.ADMIN_KEY
  
  if (adminKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}
```

### 4. **API Endpoints** 🌐

**The Problem:**
- Frontend needs to:
  - Get menu data
  - Save menu data
  - Upload images
  - Check database status

**The Solution:**
- Backend provides REST API endpoints:
  - `GET /api/menu/:date` - Get menu
  - `POST /api/admin/menu` - Save menu
  - `POST /api/admin/upload` - Upload image
  - `GET /api/health` - Check status

### 5. **Data Validation** ✅

**The Problem:**
- Frontend validation can be bypassed
- Need server-side validation for security

**The Solution:**
- Backend validates all data before saving to database
- Prevents invalid data from corrupting database

## What SQLite Simplified

✅ **What SQLite Changed:**
- No separate database server process (like MongoDB)
- No connection strings to manage
- Database is just a file: `backend/data/eeu-cafe.db`
- Easier to backup (just copy the file)

❌ **What SQLite Did NOT Change:**
- Still need backend server to access the database
- Still need API endpoints
- Still need file upload handling
- Still need authentication

## Architecture Comparison

### With MongoDB (Before)
```
Browser → Backend Server → MongoDB Server (separate process)
```

### With SQLite (Now)
```
Browser → Backend Server → SQLite File (on same server)
```

**Key Difference:** SQLite file is on the same server as backend, but you still need the backend!

## Could We Avoid Backend?

### Option 1: Client-Side SQLite (Not Recommended)
- Use SQL.js (SQLite compiled to JavaScript)
- Database stored in browser localStorage/IndexedDB
- ❌ Data only on one device
- ❌ No file uploads
- ❌ No multi-user access
- ❌ Data lost if browser cleared

### Option 2: Serverless Functions (Still Backend)
- Use Vercel/Netlify serverless functions
- Still need backend, just different deployment
- ✅ Simpler deployment
- ❌ Still need backend code

### Option 3: Static Site (No Database)
- Store menu data in JSON files
- ❌ No dynamic updates
- ❌ No admin interface
- ❌ No file uploads

## Summary

**Why Backend is Needed:**
1. ✅ Browsers cannot access server files (security)
2. ✅ File uploads need server to save files
3. ✅ Authentication must be server-side
4. ✅ API endpoints for data operations
5. ✅ Data validation and security

**What SQLite Simplified:**
- ✅ No separate database server
- ✅ Database is just a file
- ✅ Easier to backup
- ✅ No connection management

**Bottom Line:**
SQLite made the **database simpler**, but you still need a **backend server** to:
- Access the database file
- Handle file uploads
- Provide API endpoints
- Handle authentication

The backend server is the **bridge** between your React app (browser) and your SQLite database (server file).


