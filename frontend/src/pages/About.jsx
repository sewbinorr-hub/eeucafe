import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="relative flex flex-col min-h-screen w-full bg-[#112117]">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full pt-20">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-4 md:px-10 py-8 md:py-12">
          <motion.div
            className="flex flex-col gap-8 md:flex-row bg-[#1c2620] rounded-lg p-6 md:p-8 shadow-sm border border-[#29382f]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden bg-gray-800 relative">
              <img 
                src="/nib.jpg"
                alt="EEU CAFE"
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-primary-green font-bold tracking-wider text-sm uppercase">Our Story</span>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  enjoy your break minute with us.
                </h1>
                <p className="text-[#9eb7a8] text-lg leading-relaxed">
                  EEU CAFE serves the community. We believe in  welcoming atmosphere for everyone.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex items-center justify-center rounded-full h-12 px-6 bg-primary-green hover:bg-primary-green/90 transition-colors text-[#112117] text-base font-bold leading-normal"
                >
                  <span className="truncate">View Today's Menu</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-7xl px-4 md:px-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <motion.div
              className="flex flex-col gap-4 rounded-lg bg-[#1c2620] p-6 border border-[#3d5245] shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-primary-green size-12 flex items-center justify-center bg-primary-green/10 rounded-full">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Local Ingredients</h3>
                <p className="text-[#9eb7a8]">We prioritize locally sourced produce and high-quality ingredients for every meal we serve.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="flex flex-col gap-4 rounded-lg bg-[#1c2620] p-6 border border-[#3d5245] shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-primary-green size-12 flex items-center justify-center bg-primary-green/10 rounded-full">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Daily Updates</h3>
                <p className="text-[#9eb7a8]">Never get bored. Our menu changes daily with fresh selections every morning.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="flex flex-col gap-4 rounded-lg bg-[#1c2620] p-6 border border-[#3d5245] shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-primary-green size-12 flex items-center justify-center bg-primary-green/10 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Community</h3>
                <p className="text-[#9eb7a8]">A space designed for staff to relax, eat, and connect.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Info Split Section */}
        <section className="w-full max-w-7xl px-4 md:px-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Operating Hours */}
            <motion.div
              className="rounded-lg bg-[#1c2620] p-6 md:p-8 border border-[#3d5245]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-primary-green text-2xl">🕐</span>
                <h2 className="text-2xl font-bold text-white">Operating Hours</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#29382f]">
                  <span className="text-[#9eb7a8] font-medium">Monday - Saturday</span>
                  <span className="font-bold text-white">2:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[#9eb7a8] font-medium">Sunday</span>
                  <span className="font-bold text-red-400">Closed</span>
                </div>
              </div>
            </motion.div>

            {/* General Notices / Map Placeholder */}
            <div className="flex flex-col gap-6">
              {/* Notice Card */}
              <motion.div
                className="rounded-lg bg-primary-green/10 border border-primary-green/20 p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-primary-green text-xl mt-1">ℹ️</span>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-white">Important Notices</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-[#9eb7a8]">
                      <li>Menu updates daily with fresh selections.</li>
                    
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Location Card */}
              <motion.div
                className="flex-1 rounded-lg bg-[#1c2620] p-6 border border-[#3d5245] flex flex-col justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-primary-green text-2xl">📍</span>
                  <h2 className="text-2xl font-bold text-white">Find Us</h2>
                </div>
                <p className="text-[#9eb7a8] mb-4">
                  Located in the third floor of Nib bank building.
                </p>
                <div className="w-full h-32 rounded-lg bg-gray-800 relative overflow-hidden">
                  <img
                    alt="Map showing location of cafe on campus grounds"
                    className="w-full h-full object-cover opacity-60"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAomPkx-6arrAESD0K0jNmiEAwxcjAWBv6XPFSnCxDIEsju7AqYBKt7B71H6QAIyHog0rp6tXIcfYYNBUZgn1YLOIoxjazYbkyMmUdQ2vfOSWSNpt2sNvSPL3Ktu9WXEmYw8xMQjS7oJM0MO4_7zfFHVYaWhmWAH6kCKbMpKqv72Q2UlOhyX9cktWfIuDL_nR9zfYjbzvUmmFZSPkim588HsQ_jJe6AK0ton4ynF_PSpQQf_RQW3EKMRiDH241E177nOyyw3q0GODE"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-primary-green hover:bg-primary-green/90 text-[#112117] text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Get Directions
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#29382f] bg-[#112117] py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-primary-green">🍽️</span>
            <span className="font-bold text-sm tracking-widest text-gray-400">EEU CAFE</span>
          </div>
          <div className="text-xs text-gray-500">
            © 2024 EEU CAFE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

