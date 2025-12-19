import express from 'express'
import Menu from '../models/Menu.js'

const router = express.Router()

// Helper function to get default menu slots based on day of week
function getDefaultSlots(dayOfWeek) {
  // Sunday: Closed
  if (dayOfWeek === 0) {
    return []
  }

  // Default slots for all days (Monday-Saturday)
  return [
    {
      key: 'morning-meal',
      label: '🍽️ Morning Meal',
      time: '08:00',
      foods: [
        { name: 'Breakfast Items', image: '' },
        { name: 'Toast', image: '' },
        { name: 'Eggs', image: '' },
      ],
    },
    {
      key: 'morning-tea',
      label: '☕ Morning Tea/Coffee',
      time: '10:00',
      foods: [
        { name: 'Coffee', image: '' },
        { name: 'Tea', image: '' },
        { name: 'Pastries', image: '' },
      ],
    },
    {
      key: 'lunch-meal',
      label: '🍛 Lunch Meal',
      time: '12:00',
      foods: [
        { name: 'Main Course', image: '' },
        { name: 'Rice', image: '' },
        { name: 'Vegetables', image: '' },
      ],
    },
    {
      key: 'afternoon-meal',
      label: '☕ Afternoon Coffee',
      time: '15:00',
      foods: [
        { name: 'Coffee', image: '' },
        { name: 'Tea', image: '' },
        { name: 'Snacks', image: '' },
      ],
    },
  ]
}

// GET /api/menu/:date - Get menu for specific date
router.get('/:date', (req, res) => {
  try {
    const { date } = req.params
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' })
    }

    // Try to fetch from database
    let menu = null
    try {
      menu = Menu.findByDate(date)
    } catch (dbError) {
      console.error('Database query error:', dbError.message)
      // Continue to return default menu
    }

    // If no menu exists, return default structure based on day of week
    if (!menu) {
      const menuDate = new Date(date)
      if (isNaN(menuDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date' })
      }
      
      const dayOfWeek = menuDate.getDay()
      const defaultSlots = getDefaultSlots(dayOfWeek)

      menu = {
        date,
        slots: defaultSlots,
      }
    }

    res.json(menu)
  } catch (error) {
    console.error('Error fetching menu:', error)
    res.status(500).json({ error: 'Failed to fetch menu: ' + error.message })
  }
})

export default router

