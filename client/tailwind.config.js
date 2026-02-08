/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        scoreit: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        glow: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        court: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
      dropShadow: {
        'glow-sm': '0 0 10px rgba(249, 115, 22, 0.5)',
        glow: '0 0 20px rgba(249, 115, 22, 0.6)',
        'glow-lg': '0 0 40px rgba(249, 115, 22, 0.8)',
        'glow-yellow': '0 0 30px rgba(251, 191, 36, 0.7)',
      },
      boxShadow: {
        'glow-orange':
          '0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(251, 191, 36, 0.2)',
        'glow-orange-lg':
          '0 0 30px rgba(249, 115, 22, 0.5), 0 0 60px rgba(251, 191, 36, 0.3)',
      },
    },
  },
  plugins: [],
};
