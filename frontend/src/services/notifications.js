// Notification service for serving time alerts

const NOTIFICATION_STORAGE_KEY = 'eeu-cafe-notifications-enabled'
const NOTIFICATION_SENT_KEY = 'eeu-cafe-notification-sent-'

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// Check if notifications are enabled
export const areNotificationsEnabled = () => {
  if (!isNotificationSupported()) {
    return false
  }
  
  if (Notification.permission !== 'granted') {
    return false
  }

  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY)
  return stored === 'true'
}

// Enable notifications
export const enableNotifications = () => {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true')
}

// Disable notifications
export const disableNotifications = () => {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'false')
}

// Get notification status for a specific time slot
const getNotificationKey = (slotKey, date) => {
  const today = date || new Date().toDateString()
  return `${NOTIFICATION_SENT_KEY}${slotKey}-${today}`
}

// Check if notification was already sent for a slot today
export const wasNotificationSent = (slotKey, date) => {
  const key = getNotificationKey(slotKey, date)
  return localStorage.getItem(key) === 'true'
}

// Mark notification as sent
export const markNotificationSent = (slotKey, date) => {
  const key = getNotificationKey(slotKey, date)
  localStorage.setItem(key, 'true')
  
  // Clean up old notifications (older than 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(NOTIFICATION_SENT_KEY)) {
      // Could add timestamp checking here if needed
    }
  })
}

// Get slot label for notifications
const getSlotLabel = (slotKey) => {
  const labels = {
    'morning-meal': 'Morning Meal',
    'morning-tea': 'Morning Tea/Coffee',
    'lunch-meal': 'Lunch Meal',
    'afternoon-meal': 'Afternoon Coffee',
  }
  return labels[slotKey] || 'Meal'
}

// Send notification
export const sendServingNotification = async (slotKey, slotLabel) => {
  if (!areNotificationsEnabled()) {
    return false
  }

  const today = new Date().toDateString()
  
  // Check if already sent today
  if (wasNotificationSent(slotKey, today)) {
    return false
  }

  const label = slotLabel || getSlotLabel(slotKey)
  const icon = 'https://www.eeu.gov.et/images/logo.png'
  
  try {
    // Register service worker if available
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(`🍽️ ${label} is Now Serving!`, {
          body: `It's time for ${label}! Check out what's available at EEU CAFE.`,
          icon: icon,
          badge: icon,
          tag: `serving-${slotKey}`,
          requireInteraction: false,
          vibrate: [200, 100, 200],
          data: {
            url: window.location.origin,
            slotKey: slotKey,
          },
        })
      } catch (swError) {
        console.log('Service worker notification failed, using fallback:', swError)
        // Fallback to regular notification
        new Notification(`🍽️ ${label} is Now Serving!`, {
          body: `It's time for ${label}! Check out what's available at EEU CAFE.`,
          icon: icon,
          tag: `serving-${slotKey}`,
        })
      }
    } else {
      // Fallback to regular notification
      new Notification(`🍽️ ${label} is Now Serving!`, {
        body: `It's time for ${label}! Check out what's available at EEU CAFE.`,
        icon: icon,
        tag: `serving-${slotKey}`,
      })
    }

    markNotificationSent(slotKey, today)
    return true
  } catch (error) {
    console.error('Error sending notification:', error)
    return false
  }
}

// Check if we should send a notification for the current time slot
export const checkAndSendNotification = (currentSlot, slotLabel) => {
  if (!currentSlot) {
    return false
  }

  if (!areNotificationsEnabled()) {
    return false
  }

  return sendServingNotification(currentSlot, slotLabel)
}
