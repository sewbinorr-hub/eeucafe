import { useState, useEffect } from 'react'
import { format, parseISO, addDays, subDays } from 'date-fns'
import { Link } from 'react-router-dom'
import { getMenu, saveMenu, uploadImage, checkHealth } from '../services/api'

export default function Admin() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [lastSync, setLastSync] = useState(new Date())
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true })

  useEffect(() => {
    loadMenu()
    checkDatabaseStatus()
    
    // Check database status every 10 seconds
    const statusInterval = setInterval(checkDatabaseStatus, 10000)
    
    return () => clearInterval(statusInterval)
  }, [selectedDate])

  const checkDatabaseStatus = async () => {
    try {
      const health = await checkHealth()
      setDbStatus({
        connected: health.mongodb?.connected || false,
        checking: false
      })
    } catch (error) {
      setDbStatus({ connected: false, checking: false })
    }
  }

  const loadMenu = async () => {
    setLoading(true)
    try {
      const data = await getMenu(selectedDate)
      setMenu(data)
    } catch (error) {
      console.error('Error loading menu:', error)
      // Initialize empty menu based on day of week
      const menuDate = new Date(selectedDate)
      const dayOfWeek = menuDate.getDay()
      
      let defaultSlots = []
      
      if (dayOfWeek === 0) {
        // Sunday - closed
        defaultSlots = []
      } else {
        // All days (Monday-Saturday) have the same schedule
        defaultSlots = [
          { key: 'morning-meal', label: '☕ Morning Tea', time: '02:00', foods: [{ name: '', image: '' }] },
          { key: 'morning-tea', label: '🍽️ Morning Meal', time: '04:00', foods: [{ name: '', image: '' }] },
          { key: 'afternoon-tea', label: '🍛 Afternoon Meal', time: '09:00', foods: [{ name: '', image: '' }] },
          { key: 'afternoon-meal', label: '☕ Afternoon Tea', time: '18:00', foods: [{ name: '', image: '' }] },
        ]
      }
      
      setMenu({
        date: selectedDate,
        slots: defaultSlots,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFoodChange = (slotKey, index, field, value) => {
    setMenu((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.key === slotKey
          ? {
              ...slot,
              foods: slot.foods.map((food, i) =>
                i === index ? { ...food, [field]: value } : food
              ),
            }
          : slot
      ),
    }))
  }

  const handleTimeChange = (slotKey, newTime) => {
    setMenu((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.key === slotKey ? { ...slot, time: newTime } : slot
      ),
    }))
  }

  const handleDeleteFoodItem = (slotKey, index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenu((prev) => ({
        ...prev,
        slots: prev.slots.map((slot) =>
          slot.key === slotKey
            ? { ...slot, foods: slot.foods.filter((_, i) => i !== index) }
            : slot
        ),
      }))
    }
  }

  const handleImageUpload = async (slotKey, index, file) => {
    if (!file) return
    
    if (!adminKey) {
      alert('Please enter admin key first')
      return
    }

    try {
      const result = await uploadImage(file, adminKey)
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const baseUrl = API_BASE_URL.replace('/api', '')
      // If imageUrl already includes the full URL, use it as is, otherwise prepend baseUrl
      const imageUrl = result.imageUrl.startsWith('http') 
        ? result.imageUrl 
        : `${baseUrl}${result.imageUrl}`
      handleFoodChange(slotKey, index, 'image', imageUrl)
    } catch (error) {
      alert('Error uploading image: ' + error.message)
    }
  }

  const addFoodItem = (slotKey) => {
    setMenu((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.key === slotKey ? { ...slot, foods: [...slot.foods, { name: '', image: '' }] } : slot
      ),
    }))
  }

  const removeFoodItem = (slotKey, index) => {
    setMenu((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.key === slotKey
          ? { ...slot, foods: slot.foods.filter((_, i) => i !== index) }
          : slot
      ),
    }))
  }

  const handleSave = async () => {
    if (!adminKey) {
      alert('Please enter admin key')
      return
    }

    if (!menu) {
      alert('No menu data to save')
      return
    }

    try {
      setLoading(true)
      const cleanedMenu = {
        ...menu,
        slots: menu.slots.map((slot) => ({
          ...slot,
          foods: slot.foods.filter((food) => food.name && food.name.trim() !== ''),
        })),
      }
      await saveMenu(cleanedMenu, adminKey)
      setSaved(true)
      setLastSync(new Date())
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving menu: ' + (error.message || 'Unknown error. Please check your connection and try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (direction) => {
    const currentDate = parseISO(selectedDate)
    const newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1)
    setSelectedDate(format(newDate, 'yyyy-MM-dd'))
  }

  const getSlotColor = (slotKey) => {
    if (slotKey.includes('tea') || slotKey === 'morning-meal') return 'secondary-light-green'
    return 'accent-orange'
  }

  const getSlotColorClass = (slotKey) => {
    if (slotKey.includes('tea') || slotKey === 'morning-meal') return 'bg-secondary-light-green'
    return 'bg-accent-orange'
  }

  const getSlotTextColorClass = (slotKey) => {
    if (slotKey.includes('tea') || slotKey === 'morning-meal') return 'text-secondary-light-green'
    return 'text-accent-orange'
  }

  const getSlotRingColorClass = (slotKey) => {
    if (slotKey.includes('tea') || slotKey === 'morning-meal') return 'focus:ring-secondary-light-green'
    return 'focus:ring-accent-orange'
  }

  const getSlotIcon = (slotKey) => {
    if (slotKey.includes('tea') || slotKey === 'morning-meal') return '☕'
    return '🍽️'
  }

  const formatDisplayDate = (dateString) => {
    return format(parseISO(dateString), 'MMMM d, yyyy')
  }

  const formatDisplayDateShort = (dateString) => {
    return format(parseISO(dateString), 'MMM d, yyyy')
  }

  if (loading && !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#112117]">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#112117] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#29382f] bg-[#111714]/80 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary-green/20 text-primary-green shrink-0">
              <span className="text-xl sm:text-2xl">🍽️</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-tight truncate">EEU CAFE — Admin</h1>
              <p className="text-gray-400 text-xs font-medium hidden sm:block">Daily Menu Editor</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className={`flex items-center text-xs font-bold px-2 sm:px-3 py-1.5 rounded-full ${
              dbStatus.connected 
                ? 'text-secondary-light-green bg-secondary-light-green/10' 
                : 'text-red-400 bg-red-400/10'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${
                dbStatus.connected 
                  ? 'bg-secondary-light-green animate-pulse' 
                  : 'bg-red-400'
              }`}></span>
              <span className="truncate text-xs">
                {dbStatus.checking ? 'Checking...' : dbStatus.connected ? 'DB Connected' : 'DB Disconnected'}
              </span>
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer overflow-hidden rounded-full h-9 sm:h-10 px-3 sm:px-5 bg-[#29382f] hover:bg-[#3d5245] transition-colors text-white text-xs sm:text-sm font-bold"
              >
                <span className="text-base sm:text-lg">👁️</span>
                <span className="hidden sm:inline truncate">Live View</span>
                <span className="sm:hidden">View</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={!adminKey || loading || !dbStatus.connected}
                className="flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer overflow-hidden rounded-full h-9 sm:h-10 px-3 sm:px-6 bg-primary-green hover:bg-primary-green/90 transition-all text-[#112117] text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(76,175,80,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                title={!dbStatus.connected ? 'Database not connected. Cannot save changes.' : ''}
              >
                <span className="text-base sm:text-lg">📤</span>
                <span className="hidden sm:inline truncate">Publish Changes</span>
                <span className="sm:hidden">Publish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-7xl flex flex-col gap-4 sm:gap-6 md:gap-8">
          {/* Headline & Date Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-4 border-b border-[#29382f]">
            <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                Menu for <span className="text-primary-green break-words">{formatDisplayDate(selectedDate)}</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base font-medium">Editing active schedule</p>
            </div>
            <div className="flex items-center bg-[#1c2620] rounded-full p-1 sm:p-1.5 shadow-sm border border-[#29382f] shrink-0">
              <button
                onClick={() => handleDateChange('prev')}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#29382f] text-gray-300 transition-colors"
                aria-label="Previous day"
              >
                <span className="text-base sm:text-lg">←</span>
              </button>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 cursor-pointer group">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="hidden"
                  id="date-picker"
                />
                <label htmlFor="date-picker" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                  <span className="text-gray-400 group-hover:text-primary-green transition-colors text-sm sm:text-base">📅</span>
                  <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">{formatDisplayDateShort(selectedDate)}</span>
                </label>
              </div>
              <button
                onClick={() => handleDateChange('next')}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#29382f] text-gray-300 transition-colors"
                aria-label="Next day"
              >
                <span className="text-base sm:text-lg">→</span>
              </button>
            </div>
          </div>

          {/* Admin Key Input & Status */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key to enable editing"
                className="flex-1 px-3 sm:px-4 py-2 bg-[#1c2620] border border-[#3d5245] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            {!dbStatus.connected && !dbStatus.checking && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-red-400 text-lg sm:text-xl shrink-0">⚠️</span>
                  <div className="min-w-0">
                    <h4 className="text-red-400 font-bold text-xs sm:text-sm mb-1">Database Connection Issue</h4>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-2">
                      Cannot connect to MongoDB. Changes cannot be saved until connection is restored.
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                      <li>Check your MongoDB Atlas connection string in backend/.env</li>
                      <li>Verify your IP address is whitelisted in MongoDB Atlas</li>
                      <li>Ensure your MongoDB cluster is running</li>
                      <li>The server will automatically retry connection</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {saved && (
              <div className="p-2.5 sm:p-3 bg-primary-green/20 border border-primary-green rounded-lg text-primary-green text-sm sm:text-base">
                Menu saved successfully!
              </div>
            )}
          </div>

          {/* Grid Layout for Menu Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {menu?.slots.map((slot) => {
              const slotColorClass = getSlotColorClass(slot.key)
              const slotTextColorClass = getSlotTextColorClass(slot.key)
              const slotRingColorClass = getSlotRingColorClass(slot.key)
              const isTea = slot.key.includes('tea') || slot.key === 'morning-meal'
              const firstFood = slot.foods[0] || { name: '', image: '' }
              
              return (
                <div
                  key={slot.key}
                  className="group/card flex flex-col bg-[#1c2620] rounded-xl p-4 sm:p-5 md:p-6 border border-[#29382f] hover:shadow-lg transition-all relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${slotColorClass}`}></div>
                  
                  <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className={`${slotTextColorClass} text-lg sm:text-xl shrink-0`}>{getSlotIcon(slot.key)}</span>
                      <h3 className="text-white text-base sm:text-lg font-bold truncate">{slot.label.replace(/[☕🍽️🍛]/g, '').trim()}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e) => handleTimeChange(slot.key, e.target.value)}
                        className="text-xs font-medium text-white bg-[#29382f] border border-[#3d5245] px-1.5 sm:px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green w-20 sm:w-auto"
                        title="Edit serving time"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 flex-1">
                    {isTea ? (
                      <div className="space-y-3 sm:space-y-4">
                        {slot.foods.map((food, index) => (
                          <div key={index} className="flex flex-col gap-2 p-2.5 sm:p-3 bg-[#111714] rounded-lg border border-[#3d5245]">
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Item {index + 1}</span>
                              {slot.foods.length > 1 && (
                                <button
                                  onClick={() => handleDeleteFoodItem(slot.key, index)}
                                  className="text-red-400 hover:text-red-300 text-xs sm:text-sm px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors shrink-0"
                                  title="Delete item"
                                >
                                  <span className="hidden sm:inline">🗑️ Delete</span>
                                  <span className="sm:hidden">🗑️</span>
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={food.name || ''}
                              onChange={(e) => handleFoodChange(slot.key, index, 'name', e.target.value)}
                              className={`w-full bg-[#1c2620] border border-[#3d5245] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${slotRingColorClass} focus:border-transparent transition-all font-medium text-sm sm:text-base`}
                              placeholder="e.g., Butter Croissant"
                            />
                            <div className="flex flex-col gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleImageUpload(slot.key, index, e.target.files[0])
                                  }
                                }}
                                className="hidden"
                                id={`image-${slot.key}-${index}`}
                              />
                              <label
                                htmlFor={`image-${slot.key}-${index}`}
                                className="w-full bg-[#1c2620] border border-[#3d5245] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white cursor-pointer hover:bg-[#29382f] transition-colors text-xs sm:text-sm text-center"
                              >
                                {food.image ? 'Change Image' : 'Upload Image'}
                              </label>
                              {food.image && (
                                <div className="relative">
                                  <img src={food.image} alt={food.name} className="w-full h-24 sm:h-32 object-cover rounded-lg mt-2" />
                                  <button
                                    onClick={() => handleFoodChange(slot.key, index, 'image', '')}
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500/80 hover:bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addFoodItem(slot.key)}
                          className="w-full px-3 sm:px-4 py-2 border-2 border-dashed border-[#3d5245] hover:border-primary-green text-gray-400 hover:text-primary-green rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        >
                          + Add Item
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {slot.foods.map((food, index) => (
                          <div key={index} className="flex flex-col gap-2 p-2.5 sm:p-3 bg-[#111714] rounded-lg border border-[#3d5245]">
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                {index === 0 ? 'Main Dish' : index === 1 ? 'Side / Snack' : 'Beverage'}
                              </span>
                              <button
                                onClick={() => handleDeleteFoodItem(slot.key, index)}
                                className="text-red-400 hover:text-red-300 text-xs sm:text-sm px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors shrink-0"
                                title="Delete item"
                              >
                                🗑️
                              </button>
                            </div>
                            <input
                              type="text"
                              value={food.name || ''}
                              onChange={(e) => handleFoodChange(slot.key, index, 'name', e.target.value)}
                              className={`w-full bg-[#1c2620] border border-[#3d5245] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${slotRingColorClass} focus:border-transparent transition-all font-medium text-sm sm:text-base`}
                              placeholder={index === 0 ? 'e.g., Grilled Salmon' : index === 1 ? 'e.g., Quinoa Salad' : 'e.g., Lemon Iced Tea'}
                            />
                            {food.image && (
                              <div className="relative">
                                <img src={food.image} alt={food.name} className="w-full h-20 sm:h-24 object-cover rounded-lg mt-2" />
                                <button
                                  onClick={() => handleFoodChange(slot.key, index, 'image', '')}
                                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleImageUpload(slot.key, index, e.target.files[0])
                                }
                              }}
                              className="hidden"
                              id={`image-${slot.key}-${index}`}
                            />
                            <label
                              htmlFor={`image-${slot.key}-${index}`}
                              className="w-full bg-[#1c2620] border border-[#3d5245] rounded-lg px-3 py-2 text-white cursor-pointer hover:bg-[#29382f] transition-colors text-xs text-center"
                            >
                              {food.image ? 'Change Image' : 'Upload Image'}
                            </label>
                          </div>
                        ))}
                        <button
                          onClick={() => addFoodItem(slot.key)}
                          className="w-full px-3 sm:px-4 py-2 border-2 border-dashed border-[#3d5245] hover:border-accent-orange text-gray-400 hover:text-accent-orange rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        >
                          + Add Item
                        </button>
                      </div>
                    )}

                    <div className="mt-auto pt-3 sm:pt-4 border-t border-[#29382f] flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-400">Status</span>
                      <label className="inline-flex items-center cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          checked={slot.foods.some(f => f.name && f.name.trim() !== '')}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className={`relative w-10 h-5 sm:w-11 sm:h-6 rounded-full peer ${
                          slot.foods.some(f => f.name && f.name.trim() !== '')
                            ? slotColorClass 
                            : 'bg-gray-700'
                        }`}>
                          <div className={`absolute top-[2px] start-[2px] bg-white rounded-full h-4 w-4 sm:h-5 sm:w-5 transition-all ${
                            slot.foods.some(f => f.name && f.name.trim() !== '') ? 'translate-x-full' : ''
                          }`}></div>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">
                          {slot.foods.some(f => f.name && f.name.trim() !== '') ? 'Available' : 'Empty'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Warning/Note Section */}
          <div className="w-full bg-accent-orange/10 border border-accent-orange/20 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 md:gap-4 mt-4">
            <span className="text-accent-orange shrink-0 mt-0.5 text-lg sm:text-xl">ℹ️</span>
            <div className="min-w-0">
              <h4 className="text-accent-orange font-bold text-xs sm:text-sm mb-1">Editor Note</h4>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Changes made here update the public display immediately after clicking "Publish Changes". Ensure all allergen information is accurately reflected.
              </p>
            </div>
          </div>

          <footer className="mt-auto py-4 sm:py-6 text-center text-gray-400 text-xs">
            <p className="break-words">© 2024 EEU CAFE System. Last synced: <span className="text-primary-green font-mono">{format(lastSync, 'HH:mm:ss')}</span></p>
          </footer>
        </div>
      </main>
    </div>
  )
}

