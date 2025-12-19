/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'accent-orange': '#F57C00',
        'primary-green': '#4CAF50',
        'secondary-light-green': '#6EC56E',
        'white': '#FFFFFF',
        'gray-border': '#D9D9D9',
        'text-gray': '#666666',
        'cyan-highlight': '#00E5FF',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        'display': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


