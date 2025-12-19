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
        // Custom colors from HTML layout
        'primary': '#36e27b',
        'primary-dark': '#2ab861',
        'muted-orange': '#F6A26B',
        'grassy-green': '#6BBF59',
        'background-light': '#f6f8f7',
        'background-dark': '#112117',
        'surface-dark': '#1c2620',
        'surface-darker': '#111714',
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


