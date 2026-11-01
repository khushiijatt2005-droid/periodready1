/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#551D82',
          purpleDark: '#3E1360',
          purpleLight: '#742CAE',
          blush: '#FFF5F3',
          blushAlt: '#FDEDE9',
          accent: '#E05A74',
          accentHover: '#C94761',
          yellow: '#FFD166',
          yellowLight: '#FFE39B'
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(85, 29, 130, 0.08)',
        'soft-lg': '0 14px 40px rgba(85, 29, 130, 0.12)',
        'glow': '0 0 25px rgba(224, 90, 116, 0.35)',
      }
    },
  },
  plugins: [],
}
