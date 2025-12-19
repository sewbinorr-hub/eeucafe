import express from 'express'
import Menu from '../models/Menu.js'

const router = express.Router()

// Middleware to check admin key
const checkAdminKey = (req, res, next) => {
  const adminKey = req.headers['x-admin-key']
  const validKey = process.env.ADMIN_KEY || 'your-secret-admin-key'

  if (!adminKey || adminKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' })
  }

  next()
}

// POST /api/admin/menu - Save/update menu
router.post('/menu', checkAdminKey, (req, res) => {
  try {
    const { date, slots } = req.body

    if (!date || !slots) {
      return res.status(400).json({ error: 'Date and slots are required' })
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' })
    }

    // Use Menu model's upsert method which handles validation
    const menu = Menu.upsert(date, slots)

    res.json({ message: 'Menu saved successfully', menu })
  } catch (error) {
    console.error('Error saving menu:', error)
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required') || error.message.includes('format')) {
      return res.status(400).json({ error: error.message })
    }
    
    // Handle database errors
    if (error.message.includes('Database error') || error.message.includes('SQLITE')) {
      return res.status(503).json({ 
        error: 'Database error. Please try again.',
        retry: true
      })
    }
    
    res.status(500).json({ error: 'Failed to save menu: ' + error.message })
  }
})

export default router


