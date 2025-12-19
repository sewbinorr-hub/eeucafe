import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getMenu = async (date) => {
  const response = await api.get(`/menu/${date}`)
  return response.data
}

export const saveMenu = async (menu, adminKey, retryCount = 0) => {
  try {
    const response = await api.post(
      '/admin/menu',
      menu,
      {
        headers: {
          'x-admin-key': adminKey,
        },
        timeout: 30000, // 30 second timeout
      }
    )
    return response.data
  } catch (error) {
    // Retry logic for database connection issues
    if (error.response?.status === 503 && error.response?.data?.retry && retryCount < 3) {
      // Exponential backoff: 2s, 4s, 8s
      const delay = 2000 * Math.pow(2, retryCount)
      await new Promise(resolve => setTimeout(resolve, delay))
      return saveMenu(menu, adminKey, retryCount + 1)
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timeout. The database may be connecting. Please try again in a few seconds.')
    } else if (error.response) {
      const errorMsg = error.response.data?.error || error.response.statusText || 'Failed to save menu'
      const details = error.response.data?.details || ''
      
      if (error.response.status === 503) {
        let fullMessage = errorMsg
        if (details) {
          fullMessage += '\n\n' + details
        }
        fullMessage += '\n\nTroubleshooting:\n'
        fullMessage += '1. Check your MongoDB Atlas connection string\n'
        fullMessage += '2. Verify your IP address is whitelisted in MongoDB Atlas\n'
        fullMessage += '3. Check if your MongoDB cluster is running\n'
        fullMessage += '4. Wait a moment and try again (auto-retrying...)'
        throw new Error(fullMessage)
      }
      throw new Error(errorMsg)
    } else if (error.request) {
      throw new Error('Network error. Please check if the backend server is running.')
    } else {
      throw new Error(error.message || 'An error occurred while saving the menu')
    }
  }
}

// Check database connection status
export const checkHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    return { status: 'error', mongodb: { connected: false } }
  }
}

export const uploadImage = async (file, adminKey) => {
  try {
    if (!adminKey || !adminKey.trim()) {
      throw new Error('Admin key is required')
    }

    const formData = new FormData()
    formData.append('image', file)
    
    const response = await axios.post(
      `${API_BASE_URL}/admin/upload`,
      formData,
      {
        headers: {
          'x-admin-key': adminKey.trim(),
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for file uploads
      }
    )
    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Upload timeout. Please try again with a smaller image.')
    } else if (error.response) {
      const errorMsg = error.response.data?.error || error.response.statusText || 'Failed to upload image'
      if (error.response.status === 401) {
        throw new Error('Invalid admin key. Please check your admin key and try again.')
      }
      throw new Error(errorMsg)
    } else if (error.request) {
      throw new Error('Network error. Please check if the backend server is running.')
    } else {
      throw new Error(error.message || 'An error occurred while uploading the image')
    }
  }
}

