/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js}"
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
