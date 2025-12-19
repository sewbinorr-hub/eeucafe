import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isCurrentlyServing, setIsCurrentlyServing] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { scrollY } = useScroll()

  const isActive = (path) => location.pathname === path

  // Handle scroll to hide/show navbar
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const currentScrollY = latest
    
    // Show navbar at the top of the page
    if (currentScrollY < 50) {
      setIsVisible(true)
    } 
    // Hide when scrolling down, show when scrolling up
    else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false)
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true)
    }
    
    setLastScrollY(currentScrollY)
  })

  useEffect(() => {
    const checkServingStatus = () => {
      const now = new Date()
      const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTimeMinutes = hours * 60 + minutes

      // Closed on Sunday
      if (dayOfWeek === 0) {
        setIsCurrentlyServing(false)
        return
      }

      // Check if currently in a serving time slot
      const isServing = 
        (currentTimeMinutes >= 8 * 60 && currentTimeMinutes < 8 * 60 + 15) || // Morning Meal: 8:00 AM - 8:15 AM
        (currentTimeMinutes >= 10 * 60 && currentTimeMinutes < 10 * 60 + 15) || // Morning Tea/Coffee: 10:00 AM - 10:15 AM
        (currentTimeMinutes >= 12 * 60 && currentTimeMinutes < 13 * 60 + 30) || // Lunch Meal: 12:00 PM - 1:30 PM
        (currentTimeMinutes >= 15 * 60 && currentTimeMinutes < 15 * 60 + 30)   // Afternoon Coffee: 3:00 PM - 3:30 PM

      setIsCurrentlyServing(isServing)
    }

    // Check immediately
    checkServingStatus()

    // Update every minute
    const interval = setInterval(checkServingStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  // Close mobile menu when navbar hides
  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false)
    }
  }, [isVisible])

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8"
      initial={{ y: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div className="mx-auto max-w-[960px] bg-[#1c2620]/80 backdrop-blur-md border border-white/5 rounded-full px-6 py-3 shadow-lg flex items-center justify-between transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
          <img 
            src="https://www.eeu.gov.et/images/logo.png" 
            alt="EEU Logo" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-white font-bold tracking-tight text-lg hidden sm:block">EEU CAFE</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-white' : 'text-gray-400 hover:text-primary-green'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors ${
              isActive('/about') ? 'text-white' : 'text-gray-400 hover:text-primary-green'
            }`}
          >
            About
          </Link>
          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block"></div>
          <span className={`text-xs font-mono hidden sm:block ${
            isCurrentlyServing 
              ? 'text-primary-green animate-pulse' 
              : 'text-gray-500'
          }`}>
            {isCurrentlyServing ? 'OPEN' : 'CLOSED'}
          </span>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
            <span className={`block h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && isVisible && (
        <motion.div 
          className="md:hidden fixed top-[70px] left-4 right-4 bg-[#1c2620]/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl z-40"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Link 
            to="/" 
            className={`text-base font-medium transition-colors ${
              isActive('/') ? 'text-primary-green' : 'text-gray-400 hover:text-primary-green'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-base font-medium transition-colors ${
              isActive('/about') ? 'text-primary-green' : 'text-gray-400 hover:text-primary-green'
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </motion.div>
      )}
    </motion.nav>
  )
}


