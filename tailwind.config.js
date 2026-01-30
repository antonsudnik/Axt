/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.html",          // ADD THIS: scans all HTML files in root
    "./src/**/*.{js,ts,jsx,tsx}", // Scans JS in src
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'lora': ['Lora', 'serif'],
      },
      colors: {
        'deep-blue-black': '#1A232E',
        'bright-aqua': '#00FFFF',
        'dark-aqua': '#00CCCC',
        'light-gray-bg': '#F8F9FA',
        'aqua-promo-bg': '#E0FFFF',
      }
    },
  },
  plugins: [],
}
