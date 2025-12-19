# EEU CAFE - Modern Cafe Menu Web Application

A modern, responsive web application for displaying daily-changing cafe menus with automatic time-based detection and beautiful 3D UI effects.

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - 3D animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **date-fns** - Date formatting and manipulation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** - Lightweight, file-based database (perfect for daily-changing menu data)
- **better-sqlite3** - Fast, synchronous SQLite3 library

## Features

- ✅ **Live Menu Display** - Automatically detects current time and highlights what's being served
- ✅ **Time-Based Detection** - Shows different statuses (Coffee Time, Lunch Time, Dinner Time)
- ✅ **3D UI Effects** - Interactive cards with parallax tilt, hover lift, and smooth animations
- ✅ **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Admin Editor** - Protected page for staff to update daily menus
- ✅ **Dark Theme** - Modern dark theme with accent colors

## Deployment

### Vercel Deployment (Frontend)

The frontend can be deployed to Vercel for free. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`
5. Deploy

### Production Deployment

For full production deployment including backend, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md).

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- No additional database setup required! SQLite is file-based and works out of the box.

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**

   **Backend** (`backend/.env`):
   ```env
   PORT=5000
   ADMIN_KEY=your-secret-admin-key-change-this
   # Optional: Custom database path (default: backend/data/eeu-cafe.db)
   # DB_PATH=./data/eeu-cafe.db
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on `http://localhost:3000`
   - Backend on `http://localhost:5000`

### Development Commands

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build frontend for production
npm run build
```

## Project Structure

```
eeu-cafe/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── database/           # SQLite database initialization
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── data/               # SQLite database file (created automatically)
│   ├── server.js           # Express server
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

### Public Endpoints

- `GET /api/menu/:date` - Get menu for specific date (format: YYYY-MM-DD)

### Admin Endpoints (Requires Admin Key)

- `POST /api/admin/menu` - Save/update menu
  - Headers: `x-admin-key: your-admin-key`
  - Body: `{ date: "2024-12-18", slots: [...] }`

## Menu Data Structure

```json
{
  "date": "2024-12-18",
  "slots": [
    {
      "key": "morning-tea",
      "label": "Morning Tea",
      "time": "04:00",
      "foods": ["Coffee", "Tea", "Pastries"]
    },
    {
      "key": "morning-meal",
      "label": "Morning Meal",
      "time": "06:00",
      "foods": ["Scrambled Eggs", "Toast", "Fresh Fruit"]
    },
    {
      "key": "afternoon-tea",
      "label": "Afternoon Tea",
      "time": "09:00",
      "foods": ["Coffee", "Tea", "Sandwiches"]
    },
    {
      "key": "afternoon-meal",
      "label": "Afternoon Meal",
      "time": "18:00",
      "foods": ["Grilled Chicken", "Rice", "Vegetables"]
    }
  ]
}
```

## Time Slots

The app automatically detects which meal period is currently active:

- **4:00 AM - 6:00 AM**: Morning Tea (Coffee Time)
- **6:00 AM - 9:00 AM**: Morning Meal (Lunch Time)
- **9:00 AM - 6:00 PM**: Afternoon Tea (Coffee Time)
- **6:00 PM onwards**: Afternoon Meal (Dinner Time)

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `frontend/dist` folder to Vercel or Netlify

3. Set environment variable: `VITE_API_URL` to your backend URL

### Backend (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Deploy the `backend` folder
3. The SQLite database file will be created automatically
4. For production, consider backing up the `data/eeu-cafe.db` file regularly

### Database (SQLite)

- **No setup required!** SQLite is file-based and works automatically
- Database file location: `backend/data/eeu-cafe.db` (created on first run)
- **Backup**: Simply copy the `.db` file to backup your data
- **Why SQLite?** Perfect for daily-changing menu data - simple, fast, reliable, and no separate server needed

## License

© 2024 EEU CAFE. All rights reserved.
