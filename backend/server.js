import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import menuRoutes from './routes/menu.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import { db, DB_PATH } from './database/db.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Security Middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By')
  
  next()
})

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL?.split(',') || process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}

app.use(cors(corsOptions))

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/menu', menuRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin', uploadRoutes)

// Serve static files from React app in production
if (NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist')
  app.use(express.static(frontendBuildPath))
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'))
    }
  })
}

// Health check
app.get('/api/health', (req, res) => {
  let dbStatus = 'ok'
  try {
    // Test database connection with a simple query
    db.prepare('SELECT 1').get()
  } catch (error) {
    dbStatus = 'error'
    console.error('Database health check failed:', error.message)
  }
  
  const health = {
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    message: 'EEU CAFE API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    database: {
      type: 'SQLite',
      status: dbStatus,
      path: DB_PATH,
      open: db.open
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  }
  
  res.status(dbStatus === 'ok' ? 200 : 503).json(health)
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  const statusCode = err.statusCode || 500
  const message = NODE_ENV === 'production' 
    ? (err.statusCode ? err.message : 'Internal server error')
    : err.message
  
  res.status(statusCode).json({
    error: message,
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  })
})

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📦 Environment: ${NODE_ENV}`)
  console.log(`💾 Database: SQLite at ${DB_PATH}`)
  if (NODE_ENV === 'production') {
    console.log('✅ Production mode enabled')
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  db.close()
  console.log('SQLite database closed')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  db.close()
  console.log('SQLite database closed')
  process.exit(0)
})

