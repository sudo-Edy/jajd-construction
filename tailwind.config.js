/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Refined goldenrod — a deeper, more confident gold that reads
        // "established trade" rather than bright/soft yellow.
        brand: {
          50: '#fbf6ea',
          100: '#f4e6c1',
          200: '#e9cd86',
          300: '#dcb14e',
          400: '#cf9a26', // primary accent — serious goldenrod
          500: '#b27d18',
          600: '#8f6115',
          700: '#704b16',
        },
        // Deep ink navy with a touch of warmth
        navy: {
          DEFAULT: '#0b1220',
          800: '#18212f',
          900: '#0b1220',
          950: '#05080f',
        },
      },
      animation: {
        marquee: 'marquee 50s linear infinite',
        'fade-up': 'fadeUp 0.7s ease-out both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 4px 12px rgba(15, 23, 42, 0.1), 0 16px 40px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
