/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'text-reveal': 'text-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'text-reveal-delayed': 'text-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.2s',
      },
    },
  },
  plugins: [],
}
