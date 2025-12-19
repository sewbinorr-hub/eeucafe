import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Middleware to check admin key
const checkAdminKey = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.headers['X-Admin-Key']
  const validKey = process.env.ADMIN_KEY || 'your-secret-admin-key'

  // Debug logging (remove in production)
  console.log('Received admin key:', adminKey ? '***' : 'missing')
  console.log('Expected admin key:', validKey ? '***' : 'missing')

  if (!adminKey || adminKey.trim() !== validKey.trim()) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' })
  }

  next()
}

// POST /api/admin/upload - Upload image
router.post('/upload', checkAdminKey, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

export default router

