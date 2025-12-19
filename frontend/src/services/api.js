import { supabase } from './supabase.js'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || ''

// Validate admin key
const validateAdminKey = (adminKey) => {
  if (!adminKey || !adminKey.trim()) {
    throw new Error('Admin key is required')
  }
  if (adminKey.trim() !== ADMIN_KEY.trim()) {
    throw new Error('Invalid admin key')
  }
}

// Get menu for a specific date
export const getMenu = async (date) => {
  try {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD')
    }

    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching menu:', error)
      throw new Error('Failed to fetch menu from database')
    }

    // If menu exists, return it
    if (data) {
      return {
        date: data.date,
        slots: data.slots,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    }

    // If no menu exists, return default structure based on day of week
    const menuDate = new Date(date)
    if (isNaN(menuDate.getTime())) {
      throw new Error('Invalid date')
    }

    const dayOfWeek = menuDate.getDay()
    let defaultSlots = []

    // Sunday: Closed
    if (dayOfWeek !== 0) {
      // Default slots for all days (Monday-Saturday)
      defaultSlots = [
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

    return {
      date,
      slots: defaultSlots,
    }
  } catch (error) {
    console.error('Error in getMenu:', error)
    throw error
  }
}

// Save/update menu
export const saveMenu = async (menu, adminKey) => {
  try {
    validateAdminKey(adminKey)

    if (!menu || !menu.date || !menu.slots) {
      throw new Error('Invalid menu data')
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(menu.date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD')
    }

    // Clean menu data - remove empty food items
    const cleanedMenu = {
      date: menu.date,
      slots: menu.slots.map((slot) => ({
        ...slot,
        foods: slot.foods.filter((food) => food.name && food.name.trim() !== ''),
      })),
    }

    // Upsert menu (insert or update)
    const { data, error } = await supabase
      .from('menus')
      .upsert(
        {
          date: cleanedMenu.date,
          slots: cleanedMenu.slots,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'date',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error saving menu:', error)
      throw new Error(`Failed to save menu: ${error.message}`)
    }

    return {
      message: 'Menu saved successfully',
      menu: {
        date: data.date,
        slots: data.slots,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    }
  } catch (error) {
    console.error('Error in saveMenu:', error)
    throw error
  }
}

// Check database connection status
export const checkHealth = async () => {
  try {
    // Test connection by querying menus table
    const { error } = await supabase
      .from('menus')
      .select('id')
      .limit(1)

    if (error) {
      return {
        status: 'error',
        database: {
          type: 'Supabase',
          status: 'error',
          error: error.message,
        },
      }
    }

    return {
      status: 'ok',
      message: 'EEU CAFE API is running',
      database: {
        type: 'Supabase',
        status: 'ok',
        connected: true,
      },
    }
  } catch (error) {
    return {
      status: 'error',
      database: {
        type: 'Supabase',
        status: 'error',
        error: error.message,
      },
    }
  }
}

// Upload image to Supabase Storage
export const uploadImage = async (file, adminKey) => {
  try {
    validateAdminKey(adminKey)

    if (!file) {
      throw new Error('No file provided')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
    const filePath = `menu-images/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath)

    return {
      message: 'Image uploaded successfully',
      imageUrl: urlData.publicUrl,
      filename: fileName,
      path: filePath,
    }
  } catch (error) {
    console.error('Error in uploadImage:', error)
    if (error.message.includes('Admin key')) {
      throw error
    }
    throw new Error(error.message || 'Failed to upload image')
  }
}
