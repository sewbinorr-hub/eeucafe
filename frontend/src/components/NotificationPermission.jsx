import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  isNotificationSupported,
  requestNotificationPermission,
  areNotificationsEnabled,
  enableNotifications,
  disableNotifications,
} from '../services/notifications'

export default function NotificationPermission() {
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const supported = isNotificationSupported()
    setIsSupported(supported)
    
    if (supported) {
      const enabled = areNotificationsEnabled()
      setIsEnabled(enabled)
      
      // Show banner if notifications are supported but not enabled
      if (!enabled && Notification.permission === 'default') {
        // Show after a delay to not interrupt initial page load
        const timer = setTimeout(() => {
          setShowBanner(true)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleEnable = async () => {
    setIsRequesting(true)
    const granted = await requestNotificationPermission()
    
    if (granted) {
      enableNotifications()
      setIsEnabled(true)
      setShowBanner(false)
    } else {
      // User denied permission
      setShowBanner(false)
    }
    
    setIsRequesting(false)
  }

  const handleDisable = () => {
    disableNotifications()
    setIsEnabled(false)
  }

  if (!isSupported) {
    return null
  }

  // Show toggle button if permission is already granted/denied
  if (Notification.permission !== 'default') {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          onClick={isEnabled ? handleDisable : handleEnable}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isEnabled
              ? 'bg-primary text-background-dark hover:bg-primary/90'
              : 'bg-surface-dark text-gray-400 border border-white/10 hover:border-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEnabled ? '🔔 Notifications On' : '🔕 Notifications Off'}
        </motion.button>
      </div>
    )
  }

  // Show banner for first-time permission request
  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-surface-dark border border-primary/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔔</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm mb-1">
                  Get Serving Time Notifications
                </h3>
                <p className="text-gray-400 text-xs mb-3">
                  We'll notify you when meals are being served so you never miss out!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleEnable}
                    disabled={isRequesting}
                    className="px-4 py-2 bg-primary text-background-dark rounded-lg text-xs font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    {isRequesting ? 'Enabling...' : 'Enable Notifications'}
                  </button>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="px-4 py-2 bg-[#111714] text-gray-400 rounded-lg text-xs font-medium hover:bg-[#0a0d0b] transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
