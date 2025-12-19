// Service Worker for EEU CAFE - Handles background notifications

const CACHE_NAME = 'eeu-cafe-v1'
const urlsToCache = [
  '/',
  '/index.html',
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.log('Cache install failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})

// Notification click event - open the app when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Push event - handle incoming push notifications (for future web push)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'EEU CAFE'
  const options = {
    body: data.body || 'New update from EEU CAFE',
    icon: data.icon || 'https://www.eeu.gov.et/images/logo.png',
    badge: 'https://www.eeu.gov.et/images/logo.png',
    data: {
      url: data.url || '/',
    },
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})
