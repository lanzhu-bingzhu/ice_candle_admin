// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        ice: {
          50: '#f0f9ff',
          400: '#38bdf8',
          500: '#0ea5e9',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        dark: {
          DEFAULT: '#0a0f1a',
          800: '#111827',
          900: '#0b1120',
        },
      },
    },
  },
  plugins: [],
}