/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'scale-in': 'scaleIn 0.5s ease-out',
        'scale-out': 'scaleOut 0.5s ease-in 1.5s forwards'
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' }
        },
        scaleOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' }
        }
      }
    },
  },
  plugins: [],
}
