import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NotificationPermission from './components/NotificationPermission'
import ProductionProtection from './components/ProductionProtection'
import Home from './pages/Home'
import About from './pages/About'
import Admin from './pages/Admin'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ProductionProtection />
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f1419] to-[#1a1a1a]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <NotificationPermission />
      </div>
    </Router>
  )
}

export default App


