/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fbf7ef',
        paper: '#fffdf9',
        ink: '#302b25',
        muted: '#746d63',
        gold: {
          DEFAULT: '#b58a4b',
          dark: '#8c6836',
          light: '#d2ab6f',
        },
        line: '#e9e0d2',
        soft: '#f3ecdf',
        accentgreen: '#64745b',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

