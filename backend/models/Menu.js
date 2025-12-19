import { db, preparedStatements } from '../database/db.js'

class Menu {
  // Validate date format
  static validateDate(date) {
    if (!date || typeof date !== 'string') {
      throw new Error('Date is required and must be a string')
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format')
    }
    return true
  }

  // Validate slots structure
  static validateSlots(slots) {
    if (!Array.isArray(slots)) {
      throw new Error('Slots must be an array')
    }

    const validKeys = ['morning-meal', 'morning-tea', 'lunch-meal', 'afternoon-meal']
    const slotKeys = slots.map(s => s.key)
    const invalidKeys = slotKeys.filter(key => !validKeys.includes(key))
    
    if (invalidKeys.length > 0) {
      throw new Error(`Invalid slot keys: ${invalidKeys.join(', ')}`)
    }

    // Check for duplicate keys
    if (slotKeys.length !== new Set(slotKeys).size) {
      throw new Error('Duplicate slot keys are not allowed')
    }

    // Validate each slot
    slots.forEach((slot, index) => {
      if (!slot.key || !slot.label || !slot.time) {
        throw new Error(`Slot at index ${index} is missing required fields (key, label, time)`)
      }
      
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.time)) {
        throw new Error(`Slot at index ${index} has invalid time format. Must be HH:MM`)
      }

      if (!Array.isArray(slot.foods)) {
        throw new Error(`Slot at index ${index} foods must be an array`)
      }

      slot.foods.forEach((food, foodIndex) => {
        if (!food.name || typeof food.name !== 'string') {
          throw new Error(`Food item at slot ${index}, food ${foodIndex} must have a name`)
        }
        if (food.name.length > 100) {
          throw new Error(`Food item name cannot exceed 100 characters`)
        }
      })
    })

    return true
  }

  // Find menu by date
  static findByDate(date) {
    this.validateDate(date)
    const result = preparedStatements.findMenuByDate.get(date)
    
    if (!result) {
      return null
    }

    return {
      date: result.date,
      slots: JSON.parse(result.slots),
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }
  }

  // Create or update menu (upsert)
  static upsert(date, slots) {
    this.validateDate(date)
    this.validateSlots(slots)

    const slotsJson = JSON.stringify(slots)
    
    try {
      preparedStatements.upsertMenu.run(date, slotsJson)
      return this.findByDate(date)
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`Menu for date ${date} already exists. Use update() instead.`)
      }
      throw new Error(`Database error: ${error.message}`)
    }
  }

  // Update existing menu
  static update(date, slots) {
    this.validateDate(date)
    this.validateSlots(slots)

    const slotsJson = JSON.stringify(slots)
    const result = preparedStatements.updateMenu.run(slotsJson, date)
    
    if (result.changes === 0) {
      throw new Error(`Menu for date ${date} not found`)
    }

    return this.findByDate(date)
  }

  // Get all menus
  static getAll() {
    const results = preparedStatements.getAllMenus.all()
    return results.map(result => ({
      date: result.date,
      slots: JSON.parse(result.slots),
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }))
  }

  // Delete menu by date
  static delete(date) {
    this.validateDate(date)
    const result = preparedStatements.deleteMenu.run(date)
    
    if (result.changes === 0) {
      throw new Error(`Menu for date ${date} not found`)
    }

    return { success: true, message: `Menu for ${date} deleted` }
  }

  // Add food item to a slot
  static addFoodToSlot(date, slotKey, foodItem) {
    const menu = this.findByDate(date)
    if (!menu) {
      throw new Error(`Menu for date ${date} not found`)
    }

    const slot = menu.slots.find(s => s.key === slotKey)
    if (!slot) {
      throw new Error(`Slot with key "${slotKey}" not found`)
    }

    if (!foodItem.name || typeof foodItem.name !== 'string') {
      throw new Error('Food item must have a name')
    }

    slot.foods.push({
      name: foodItem.name,
      image: foodItem.image || ''
    })

    return this.update(date, menu.slots)
  }
}

export default Menu
