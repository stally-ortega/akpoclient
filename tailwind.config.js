/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a', // Corporate Dark Blue
        secondary: '#334155',
        accent: '#3b82f6', // Bright Blue
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
