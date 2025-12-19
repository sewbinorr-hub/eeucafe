import { useEffect } from 'react'

export default function ProductionProtection() {
  useEffect(() => {
    // Only enable protection in production
    if (import.meta.env.MODE !== 'production') {
      return
    }

    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Disable common developer tools shortcuts
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+J (Chrome Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault()
        return false
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault()
        return false
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault()
        return false
      }
      // Ctrl+P (Print - can be used to view source)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault()
        return false
      }
    }

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault()
      return false
    }

    // Disable drag
    const handleDragStart = (e) => {
      e.preventDefault()
      return false
    }

    // Anti-debugging: Detect DevTools
    let devtools = { open: false, orientation: null }
    const threshold = 160

    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true
          // Optionally redirect or show warning
          console.clear()
          console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;')
          console.log('%cThis is a browser feature intended for developers.', 'font-size: 16px;')
        }
      } else {
        devtools.open = false
      }
    }

    // Continuous DevTools detection
    const devToolsInterval = setInterval(detectDevTools, 500)

    // Disable console methods
    if (import.meta.env.MODE === 'production') {
      const noop = () => {}
      const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd']
      methods.forEach((method) => {
        console[method] = noop
      })
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)

    // Disable common keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'P'))
      ) {
        e.preventDefault()
        return false
      }
    })

    // Disable image dragging
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      img.setAttribute('draggable', 'false')
      img.addEventListener('dragstart', handleDragStart)
    })

    // Cleanup
    return () => {
      clearInterval(devToolsInterval)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  // Add CSS to prevent text selection
  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      const style = document.createElement('style')
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        input, textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  return null
}
