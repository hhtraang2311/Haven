/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        haven: {
          50: '#f2fbf7',
          100: '#d9f4e8',
          200: '#b6e9d2',
          300: '#8eddbb',
          400: '#66d1a3',
          500: '#45b88a',
          600: '#349771',
          700: '#28785a',
          800: '#1d5a43',
          900: '#123c2d'
        }
      },
      boxShadow: {
        haven: '0 10px 25px -10px rgba(18,60,45,0.25)'
      }
    }
  },
  plugins: []
}
