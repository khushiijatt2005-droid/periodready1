/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#443c82',
          dark: '#352e69',
          light: '#564da1',
          50: '#f6f5fc',
          100: '#ece9f9',
          900: '#231d45',
        },
        lavender: {
          DEFAULT: '#fff0f5', // Baby Pink main theme
          alt: '#fdf2f7',
          border: '#f8c9dc',
          deep: '#f3b6cf',
        },
        babypink: {
          DEFAULT: '#fff0f5',
          soft: '#fdeef4',
          border: '#f8c9dc',
          accent: '#f3b6cf',
          deep: '#eb9abf',
        },
        blush: {
          DEFAULT: '#fdebf2',
          border: '#f7b5cf',
          accent: '#fae3ec',
        },
        rose: {
          DEFAULT: '#d6457f',
          dark: '#b93267',
          light: '#e86297',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(214, 69, 127, 0.08), 0 2px 6px -1px rgba(68, 60, 130, 0.04)',
        'lift': '0 12px 28px -4px rgba(214, 69, 127, 0.14), 0 4px 10px -2px rgba(68, 60, 130, 0.06)',
      }
    },
  },
  plugins: [],
}
