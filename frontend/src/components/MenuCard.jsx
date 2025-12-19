import { motion } from 'framer-motion'
import { useState } from 'react'

function getTimeDuration(slotKey) {
  const durations = {
    'morning-meal': '15 min', // Morning Meal (8:00-8:15)
    'morning-tea': '15 min', // Morning Tea/Coffee (10:00-10:15)
    'lunch-meal': '1.5 hours', // Lunch Meal (12:00-13:30)
    'afternoon-meal': '30 min', // Afternoon Coffee (15:00-15:30)
  }
  return durations[slotKey] || ''
}

export default function MenuCard({ slot, isCurrent, isPast, delay = 0 }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const getBadgeColor = () => {
    if (isCurrent) return 'bg-primary-green text-white'
    if (isPast) return 'bg-gray-200 text-text-gray'
    return 'bg-secondary-light-green text-white'
  }

  const getMealTypeColor = (slotKey) => {
    if (slotKey.includes('tea') || slotKey.includes('coffee')) return 'bg-secondary-light-green text-white'
    if (slotKey === 'lunch-meal') return 'bg-primary-green text-white'
    if (slotKey === 'afternoon-meal') return 'bg-accent-orange text-white'
    return 'bg-gray-200 text-text-gray'
  }

  const getIcon = (slotKey) => {
    if (slotKey.includes('tea') || slotKey.includes('coffee')) return '☕'
    if (slotKey.includes('meal')) return '🍽️'
    return '🍛'
  }

  return (
    <div className={`group relative tilt-card ${isCurrent ? 'md:scale-105 md:-translate-y-2 z-20' : ''} h-full`}>
      {/* Glow effect for current card */}
      {isCurrent && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-highlight to-primary-green rounded-[1.2rem] opacity-75 blur-sm group-hover:opacity-100 transition duration-500"></div>
      )}
      
      {/* Dimmer overlay for past events */}
      {isPast && (
        <div className="absolute inset-0 bg-[#1c2620] rounded-2xl opacity-60 z-10"></div>
      )}
      
      <motion.div
        className={`relative h-full flex flex-col bg-[#1c2620] border ${
          isCurrent ? 'border-cyan-highlight/50' : 'border-white/5'
        } rounded-2xl p-5 shadow-lg overflow-hidden ${
          isPast ? 'opacity-60 grayscale hover:grayscale-0' : ''
        } hover:border-white/20 transition-all duration-300`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isCurrent ? 20 : 0}px)`,
        }}
        whileHover={{ scale: isCurrent ? 1.02 : 1.05, y: -10 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            isCurrent 
              ? 'bg-primary-green/20 text-primary-green border border-primary-green/50 animate-pulse flex items-center gap-2'
              : isPast
              ? 'bg-gray-800 text-gray-400'
              : 'bg-[#111714] border border-white/10 text-gray-300'
          }`}>
            {isCurrent && <span className="w-2 h-2 rounded-full bg-primary-green"></span>}
            {isCurrent ? 'Now Serving' : isPast ? 'Ended' : 'Upcoming'}
          </div>
          <span className="text-2xl">{getIcon(slot.key)}</span>
        </div>

        {/* Food Image */}
        {slot.foods[0]?.image && (
          <div className="h-40 w-full rounded-xl bg-cover bg-center mb-4 relative overflow-hidden" style={{
            backgroundImage: `url(${slot.foods[0].image})`
          }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {isCurrent && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/20">Chef's Special</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col grow">
          <h4 className={`${isCurrent ? 'text-2xl' : 'text-xl'} font-bold text-white mb-1`}>
            {slot.label}
          </h4>
          <p className={`text-sm mb-4 font-mono ${
            isCurrent ? 'text-primary-green font-medium' : 'text-gray-400'
          }`}>
            {slot.time} - {getTimeDuration(slot.key) && `(${getTimeDuration(slot.key)})`}
          </p>

          <ul className="space-y-2 text-sm text-gray-300 mt-auto">
            {slot.foods.map((food, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.05 }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isCurrent ? 'bg-primary-green' : isPast ? 'bg-gray-600' : 'bg-accent-orange'
                }`}></span>
                <span>{food.name || food}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

