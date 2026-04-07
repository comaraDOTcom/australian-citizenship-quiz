import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Australian national colours
        'au-green': {
          DEFAULT: '#00843D',
          50: '#E6F4EC',
          100: '#C2E5D0',
          500: '#00843D',
          600: '#006B31',
          700: '#005226',
          800: '#003A1A',
          900: '#00210F',
        },
        'au-gold': {
          DEFAULT: '#FFCD00',
          50: '#FFFCE6',
          100: '#FFF6B3',
          200: '#FFEE66',
          300: '#FFE433',
          400: '#FFD900',
          500: '#FFCD00',
          600: '#CCA400',
          700: '#997B00',
          800: '#665200',
          900: '#332900',
        },
        'au-blue': {
          DEFAULT: '#00008B',
          500: '#00008B',
          600: '#000070',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'progress': 'progress 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
