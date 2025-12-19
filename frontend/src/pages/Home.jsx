import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import MenuCard from '../components/MenuCard'
import { getMenu } from '../services/api'
import { checkAndSendNotification } from '../services/notifications'

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const lastNotifiedSlot = useRef(null)

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Update date every minute
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    // Load menu
    loadMenu()

    return () => {
      clearInterval(timeInterval)
      clearInterval(dateInterval)
    }
  }, [])

  const loadMenu = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const data = await getMenu(today)
      setMenu(data)
    } catch (error) {
      console.error('Error loading menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentTimeSlot = () => {
    const dayOfWeek = currentTime.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const currentTimeMinutes = hours * 60 + minutes

    // Closed on Sunday (day 0)
    if (dayOfWeek === 0) {
      return null
    }

    // Saturday is half day - only morning meal and morning tea, closes at 12:00 PM
    if (dayOfWeek === 6) {
      // Morning Meal: 8:00 AM - 8:15 AM (15 minutes)
      if (currentTimeMinutes >= 8 * 60 && currentTimeMinutes < 8 * 60 + 15) {
        return 'morning-meal'
      }
      // Morning Tea/Coffee: 10:00 AM - 10:15 AM (15 minutes)
      else if (currentTimeMinutes >= 10 * 60 && currentTimeMinutes < 10 * 60 + 15) {
        return 'morning-tea'
      }
      // Closed after 12:00 PM on Saturday
      return null
    }

    // Monday-Friday schedule:
    // Morning Meal: 8:00 AM - 8:15 AM (15 minutes)
    if (currentTimeMinutes >= 8 * 60 && currentTimeMinutes < 8 * 60 + 15) {
      return 'morning-meal'
    }
    // Morning Tea/Coffee: 10:00 AM - 10:15 AM (15 minutes)
    else if (currentTimeMinutes >= 10 * 60 && currentTimeMinutes < 10 * 60 + 15) {
      return 'morning-tea'
    }
    // Lunch Meal: 12:00 PM - 1:30 PM (90 minutes)
    else if (currentTimeMinutes >= 12 * 60 && currentTimeMinutes < 13 * 60 + 30) {
      return 'lunch-meal'
    }
    // Afternoon Coffee: 3:00 PM - 3:15 PM (15 minutes)
    else if (currentTimeMinutes >= 15 * 60 && currentTimeMinutes < 15 * 60 + 15) {
      return 'afternoon-meal'
    }

    // Not currently serving
    return null
  }

  const getStatusText = (slot) => {
    if (!slot) {
      const dayOfWeek = currentTime.getDay()
      const hours = currentTime.getHours()
      const minutes = currentTime.getMinutes()
      const currentTimeMinutes = hours * 60 + minutes
      
      if (dayOfWeek === 0) {
        return '🔒 Closed (Sunday)'
      }
      // Saturday - closed after 12:00 PM
      if (dayOfWeek === 6 && currentTimeMinutes >= 12 * 60) {
        return '🔒 Closed (Saturday - Half Day)'
      }
      return '⏸️ Not Currently Serving'
    }
    const statusMap = {
      'morning-meal': '🍽️ Morning Meal',
      'morning-tea': '☕ Morning Tea/Coffee',
      'lunch-meal': '🍛 Lunch Meal',
      'afternoon-meal': '☕ Afternoon Coffee'
    }
    return statusMap[slot] || '⏸️ Not Currently Serving'
  }

  const getNextServingTime = () => {
    const dayOfWeek = currentTime.getDay()
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const currentTimeMinutes = hours * 60 + minutes

    // Sunday - closed
    if (dayOfWeek === 0) {
      return 'Monday 8:00 AM (Morning Meal)'
    }

    // Saturday is half day - only morning meal and morning tea
    if (dayOfWeek === 6) {
      if (currentTimeMinutes < 8 * 60) {
        return '8:00 AM (Morning Meal)'
      } else if (currentTimeMinutes >= 8 * 60 + 15 && currentTimeMinutes < 10 * 60) {
        return '10:00 AM (Morning Tea/Coffee)'
      } else if (currentTimeMinutes >= 10 * 60 + 15 && currentTimeMinutes < 12 * 60) {
        return 'Closed at 12:00 PM (Half Day)'
      } else {
        // After 12:00 PM on Saturday
        return 'Monday 8:00 AM (Morning Meal)'
      }
    }

    // Monday-Friday schedule
    if (currentTimeMinutes < 8 * 60) {
      return '8:00 AM (Morning Meal)'
    } else if (currentTimeMinutes >= 8 * 60 + 15 && currentTimeMinutes < 10 * 60) {
      return '10:00 AM (Morning Tea/Coffee)'
    } else if (currentTimeMinutes >= 10 * 60 + 15 && currentTimeMinutes < 12 * 60) {
      return '12:00 PM (Lunch Meal)'
    } else if (currentTimeMinutes >= 13 * 60 + 30 && currentTimeMinutes < 15 * 60) {
      return '3:00 PM (Afternoon Coffee)'
    } else if (currentTimeMinutes >= 15 * 60 + 15) {
      const nextDay = dayOfWeek === 5 ? 'Monday' : 'Tomorrow'
      return `${nextDay} 8:00 AM (Morning Meal)`
    }
    return null
  }

  const currentSlot = getCurrentTimeSlot()
  const statusText = getStatusText(currentSlot)
  const nextServing = getNextServingTime()

  // Check and send notifications when serving time starts
  useEffect(() => {
    // Only send notification when a new slot starts (not on every render)
    if (currentSlot && currentSlot !== lastNotifiedSlot.current) {
      checkAndSendNotification(currentSlot, statusText)
      lastNotifiedSlot.current = currentSlot
    } else if (!currentSlot) {
      // Reset when no slot is active
      lastNotifiedSlot.current = null
    }
  }, [currentSlot, statusText])

  const formatTime = (date) => {
    return format(date, 'hh:mm:ss a')
  }

  const formatDate = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy')
  }

  return (
    <div className="min-h-screen bg-[#112117]">
      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-12 px-4 md:px-8 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-primary-green/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="mx-auto max-w-[960px] relative z-10">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            {/* Status Pill */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c2620]/80 backdrop-blur-md border border-white/10 shadow-lg mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  currentSlot ? 'bg-primary-green' : 'bg-gray-500'
                } opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  currentSlot ? 'bg-primary-green' : 'bg-gray-500'
                }`}></span>
              </span>
              <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">
                {formatDate(currentDate)}
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              WEL-COME TO<br/>EEU CAFE MENU.
            </motion.h2>
            
            <motion.p 
              className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Check out today's special selections. From morning energy boosts to hearty afternoon meals.
            </motion.p>
            
            {/* NOW SERVING Status Panel */}
            <motion.div 
              className="mt-4 flex flex-col items-center gap-3 w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-r from-primary-green/20 via-accent-orange/20 to-primary-green/20"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <div className={`w-full bg-[#1c2620] rounded-xl p-4 border ${
                currentSlot ? 'border-cyan-highlight/50 shadow-[0_0_20px_rgba(0,229,255,0.3)]' : 'border-white/5'
              } flex items-center justify-between gap-4 shadow-xl`}>
                <div className="flex flex-col text-left">
                  <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                    currentSlot ? 'text-accent-orange' : 'text-gray-400'
                  }`}>
                    {currentSlot ? 'Now Serving' : 'Status'}
                  </span>
                  <span className="text-xl font-bold text-white">{statusText}</span>
                  {!currentSlot && nextServing && (
                    <span className="text-xs text-gray-400 mt-1">
                      Next: <span className="text-primary-green">{nextServing}</span>
                    </span>
                  )}
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  currentSlot ? 'bg-cyan-highlight shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-gray-600'
                } text-[#112117]`}>
                  <span className="text-lg">↓</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Menu Cards Section */}
      <main className="w-full px-4 md:px-8 pb-24 relative z-10">
        <div className="mx-auto max-w-[960px]">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-primary-green">🍽️</span>
              {currentSlot ? 'Now Serving' : 'Live Menu'}
            </h3>
            <div className="text-sm text-gray-400 font-mono hidden sm:block">
              {formatTime(currentTime)}
            </div>
          </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-gray">Loading menu...</p>
          </div>
        ) : menu ? (
          (() => {
            // Filter to show only the current serving slot
            const currentSlotData = menu.slots.find(slot => slot.key === currentSlot)
            
            if (!currentSlotData) {
              // Beautiful card for "not currently serving" state
              return (
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      {/* Glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600/20 via-gray-500/20 to-gray-600/20 rounded-[1.2rem] opacity-50 blur-sm group-hover:opacity-75 transition duration-500"></div>
                      
                      <div className="relative flex flex-col bg-[#1c2620] border border-white/10 rounded-2xl p-8 shadow-xl overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                          {/* Icon */}
                          <motion.div
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-white/10 flex items-center justify-center mb-6"
                            animate={{ 
                              scale: [1, 1.05, 1],
                              opacity: [0.7, 0.9, 0.7]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <span className="text-4xl">⏸️</span>
                          </motion.div>
                          
                          {/* Status Badge */}
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-white/10 text-gray-300 mb-4">
                            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Not Currently Serving</span>
                          </div>
                          
                          {/* Status Text */}
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {statusText}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            {currentSlot 
                              ? 'Menu item not found for current time slot.' 
                              : 'We are currently closed. Please check back during our serving hours.'}
                          </p>
                          
                          {/* Next Serving Time */}
                          {nextServing && (
                            <motion.div
                              className="w-full p-4 rounded-xl bg-gradient-to-r from-primary-green/10 via-accent-orange/10 to-primary-green/10 border border-primary-green/20"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-primary-green text-lg">⏰</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Next Serving</span>
                              </div>
                              <p className="text-lg font-bold text-primary-green">
                                {nextServing}
                              </p>
                            </motion.div>
                          )}
                          
                          {/* Decorative elements */}
                          <div className="mt-6 flex gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )
            }
            
            return (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <MenuCard
                    key={currentSlotData.key}
                    slot={{
                      ...currentSlotData,
                      foods: normalizeFoods(currentSlotData.foods || []),
                    }}
                    isCurrent={true}
                    isPast={false}
                    delay={0.1}
                  />
                </div>
              </div>
            )
          })()
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600/20 via-gray-500/20 to-gray-600/20 rounded-[1.2rem] opacity-50 blur-sm"></div>
                <div className="relative flex flex-col bg-[#1c2620] border border-white/10 rounded-2xl p-8 shadow-xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 border border-white/10 flex items-center justify-center mb-4">
                      <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Menu Available</h3>
                    <p className="text-gray-400 text-sm">Menu data is not available for today.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-[#1c2620]/50">
        <div className="mx-auto max-w-[960px] px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h5 className="text-white font-bold text-sm">EEU CAFE</h5>
            <p className="text-gray-500 text-xs mt-1">Serving fresh meals daily for the community.</p>
          </div>
          <div className="text-gray-600 text-xs">
            © 2024 EEU CAFE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
function isSlotPast(slot, currentTime) {
  const [hours, minutes] = slot.time.split(':').map(Number)
  const slotTime = hours * 60 + minutes
  const currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
  
  // Define slot durations
  const slotDurations = {
    'morning-meal': 15, // Morning Meal: 15 minutes (8:00-8:15)
    'morning-tea': 15, // Morning Tea/Coffee: 15 minutes (10:00-10:15)
    'lunch-meal': 90, // Lunch Meal: 90 minutes (12:00-13:30)
    'afternoon-meal': 15, // Afternoon Coffee: 15 minutes (15:00-15:15)
  }
  
  const duration = slotDurations[slot.key] || 15
  return currentTimeMinutes > slotTime + duration
}

// Helper to normalize food items (handle both old string format and new object format)
function normalizeFoods(foods) {
  return foods.map((food) => {
    if (typeof food === 'string') {
      return { name: food, image: '' }
    }
    return food
  })
}


