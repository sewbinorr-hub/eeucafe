import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
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

    return () => {
      clearInterval(timeInterval)
      clearInterval(dateInterval)
    }
  }, [])

  const getCurrentTimeSlot = () => {
    const dayOfWeek = currentTime.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const currentTimeMinutes = hours * 60 + minutes

    // Closed on Sunday (day 0)
    if (dayOfWeek === 0) {
      return null
    }

    // All days (Monday-Saturday) have the same schedule:
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
    // Afternoon Coffee: 3:00 PM - 3:30 PM (30 minutes)
    else if (currentTimeMinutes >= 15 * 60 && currentTimeMinutes < 15 * 60 + 30) {
      return 'afternoon-meal'
    }

    // Not currently serving
    return null
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

    // All days have the same schedule
    if (currentTimeMinutes < 8 * 60) {
      return '8:00 AM (Morning Meal)'
    } else if (currentTimeMinutes >= 8 * 60 + 15 && currentTimeMinutes < 10 * 60) {
      return '10:00 AM (Morning Tea/Coffee)'
    } else if (currentTimeMinutes >= 10 * 60 + 15 && currentTimeMinutes < 12 * 60) {
      return '12:00 PM (Lunch Meal)'
    } else if (currentTimeMinutes >= 13 * 60 + 30 && currentTimeMinutes < 15 * 60) {
      return '3:00 PM (Afternoon Coffee)'
    } else if (currentTimeMinutes >= 15 * 60 + 30) {
      const nextDay = dayOfWeek === 6 ? 'Monday' : 'Tomorrow'
      return `${nextDay} 8:00 AM (Morning Meal)`
    }
    return null
  }

  const currentSlot = getCurrentTimeSlot()
  const nextServing = getNextServingTime()

  const getStatusText = (slot) => {
    if (!slot) {
      const dayOfWeek = currentTime.getDay()
      if (dayOfWeek === 0) {
        return '🔒 Closed (Sunday)'
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

  const statusText = getStatusText(currentSlot)

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

  const formatDate = (date) => {
    return format(date, 'EEEE, MMM d')
  }

  const formatDateFull = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy')
  }

  // Tilt card effect
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    if (window.matchMedia("(hover: hover)").matches) {
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = ((y - centerY) / centerY) * -5
          const rotateY = ((x - centerX) / centerX) * 5
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        })
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
        })
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-12 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="mx-auto max-w-[960px] relative z-10">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-dark border border-white/10 shadow-lg mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-500"></span>
              </span>
              <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">{formatDate(currentDate)}</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-[1.1]">
              FRESH MENU<br/>EVERY DAY.
            </h2>
            
            <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
              Check out today's special selections. From morning energy boosts to hearty afternoon meals.
            </p>
            
            {/* Status Panel */}
            <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-r from-surface-dark via-gray-800 to-surface-dark border border-white/5">
              <div className="w-full bg-surface-dark rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4 shadow-xl">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</span>
                  <span className="text-xl font-bold text-gray-400">Currently Not Serving</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-surface-darker border border-white/10 flex items-center justify-center text-gray-500 shadow-inner">
                  <span className="material-symbols-outlined">block</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 pb-24 relative z-10">
        <div className="mx-auto max-w-[960px]">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-500">storefront</span>
              Cafe Status
            </h3>
            <div className="text-sm text-gray-400 font-mono hidden sm:block">updated just now</div>
          </div>
          
          <div className="flex justify-center w-full">
            <div className="w-full max-w-lg">
              <div className="group relative tilt-card md:scale-105 z-20">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-[1.2rem] opacity-50 blur-sm group-hover:opacity-75 transition duration-500"></div>
                <div className="relative h-full flex flex-col bg-surface-dark rounded-2xl p-6 shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gray-800 text-gray-400 border border-white/10 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Cafe Closed
                    </div>
                    <div className="bg-white/5 p-2 rounded-full">
                      <span className="material-symbols-outlined text-gray-500">door_front</span>
                    </div>
                  </div>
                  
                  <div 
                    className="h-64 w-full rounded-xl bg-cover bg-center mb-6 relative shadow-inner grayscale opacity-75" 
                    data-alt="Cafe interior"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCB6Xwcwj-tECncYk3y99D2Z6xz4N30c0syVE4gQ3bh6Ydf7PBPBEuyaBF-5Lpib-uA-g1CnjnvskeE-Hy2d1MRZPSeJ1NWXSRz_aGtfAgrgzlPmbpUWTA0L6V5i8-XZuzAODyTsB3FQjzL_oDdKYJ-VMV_8it1YBtspKgAUpnSJEJF9x5YDeIwOCws3aQ2cSHewD4hV9Fp4prm2TpIKSFE-PRM9OcfMNzvgfCIBu40FASrzZQ-alXNMNi-_YCk_EMTQaZ9LkB-qfc')" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-4"></div>
                  </div>
                  
                  <div className="flex flex-col grow tilt-card-content">
                    <h4 className="text-3xl font-bold text-white mb-2">See you soon!</h4>
                    <p className="text-gray-400 text-sm mb-6 font-mono font-medium">We are currently closed for the day.</p>
                    
                    <div className="space-y-4 mt-auto">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">schedule</span>
                        <div>
                          <p className="text-white font-medium text-lg">Next Opening</p>
                          <p className="text-gray-500 text-sm">{nextServing || 'Tomorrow at 08:00 AM'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">restaurant_menu</span>
                        <div>
                          <p className="text-white font-medium text-lg">Tomorrow's Menu</p>
                          <p className="text-gray-500 text-sm">Available starting 07:30 AM</p>
                        </div>
                      </div>
                    </div>
                    
                    <button className="mt-8 w-full py-4 bg-surface-dark border border-white/10 hover:bg-white/5 text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:border-primary/50">
                      <span>Check Opening Hours</span>
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mt-20 border-t border-white/5 pt-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-16">
              <div className="w-full">
                <details className="group/details" open>
                  <summary className="list-none cursor-pointer focus:outline-none mb-6 [&::-webkit-details-marker]:hidden group/summary select-none rounded-xl">
                    <h3 className="text-2xl font-bold text-white flex items-center justify-between">
                      <div className="flex items-center gap-3 transition-colors group-hover/summary:text-white/90">
                        <span className="material-symbols-outlined text-primary text-3xl">chat_bubble</span>
                        <span>Have your say</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-surface-dark border border-white/5 flex items-center justify-center group-hover/summary:border-primary/30 group-hover/summary:bg-white/5 transition-all shadow-lg">
                        <span className="material-symbols-outlined text-gray-400 transition-transform duration-300 group-open/details:rotate-180 group-hover/summary:text-primary">expand_more</span>
                      </div>
                    </h3>
                  </summary>
                  <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                    <form>
                      <div className="mb-5">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                          Name <span className="text-gray-600 normal-case font-normal">(Optional)</span>
                        </label>
                        <input 
                          className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                          placeholder="e.g. Foodie123" 
                          type="text"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Comment</label>
                        <textarea 
                          className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" 
                          placeholder="Share your thoughts on today's meal..." 
                          rows="4"
                        ></textarea>
                      </div>
                      <button 
                        className="w-full bg-white text-background-dark font-bold py-3.5 px-6 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5 hover:shadow-primary/20" 
                        type="button"
                      >
                        Submit Comment
                        <span className="material-symbols-outlined text-sm">send</span>
                      </button>
                    </form>
                  </div>
                </details>
              </div>
              
              <div className="w-full">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-muted-orange">forum</span>
                    Recent Comments
                  </h3>
                  <span className="text-sm font-mono text-gray-500 bg-surface-dark px-3 py-1 rounded-full border border-white/5">Latest</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-surface-dark/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 flex gap-4 hover:bg-surface-dark/60 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-muted-orange/20 text-muted-orange flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">person</span>
                    </div>
                    <div className="grow">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-white font-bold text-sm">Alex M.</span>
                        <span className="text-xs text-gray-600 font-mono">10m ago</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">The portion sizes are perfect today. Really enjoyed the dhal! The spicy kick was just right.</p>
                    </div>
                  </div>
                  
                  <div className="bg-surface-dark/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 flex gap-4 hover:bg-surface-dark/60 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">restaurant</span>
                    </div>
                    <div className="grow">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-white font-bold text-sm">Anonymous</span>
                        <span className="text-xs text-gray-600 font-mono">45m ago</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">Can we have the spicy chicken again tomorrow? It's the best thing on the menu.</p>
                    </div>
                  </div>
                  
                  <div className="bg-surface-dark/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 flex gap-4 hover:bg-surface-dark/60 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">person</span>
                    </div>
                    <div className="grow">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-white font-bold text-sm">Sarah Jenkins</span>
                        <span className="text-xs text-gray-600 font-mono">1h ago</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">Loved the fresh salad garnish, adds a nice crunch!</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="text-sm text-gray-500 hover:text-primary transition-colors font-medium flex items-center justify-center gap-1 mx-auto">
                    View all comments
                    <span className="material-symbols-outlined text-xs">expand_more</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-surface-dark/50">
        <div className="mx-auto max-w-[960px] px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h5 className="text-white font-bold text-sm">EEU CAFE</h5>
            <p className="text-gray-500 text-xs mt-1">Serving fresh meals daily for the community.</p>
          </div>
          <div className="flex gap-4">
            <a className="text-gray-500 hover:text-white text-xs transition-colors" href="#">Privacy Policy</a>
            <a className="text-gray-500 hover:text-white text-xs transition-colors" href="#">Terms of Service</a>
            <a className="text-gray-500 hover:text-white text-xs transition-colors" href="#">Contact</a>
          </div>
          <div className="text-gray-600 text-xs">
            © 2023 EEU Cafe.
          </div>
        </div>
      </footer>
    </div>
  )
}
