/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEF3F9',
          100: '#D5E1EF',
          200: '#ABBFE0',
          300: '#7F9ECF',
          400: '#537DBF',
          500: '#2B5C9E',
          600: '#1E3A5F',
          700: '#163050',
          800: '#0E2440',
          900: '#071830',
        },
        accent: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA6A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
