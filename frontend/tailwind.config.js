/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mood-joy': '#FFD700',
        'mood-anger': '#FF003C',
        'mood-fear': '#8A2BE2',
        'mood-surprise': '#00FFFF',
        'mood-sadness': '#4B0082',
        'mood-disgust': '#32CD32',
        'mood-neutral': '#F8F8FF',
        'void-bg': '#050510',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
