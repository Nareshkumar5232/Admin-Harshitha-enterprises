/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        'primary-dark': '#1E40AF',
        'primary-light': '#60A5FA',
        secondary: '#06B6D4',
        'secondary-dark': '#0891B2',
        'bg-dark': '#0F172A',
        'bg-darker': '#0A0E27',
        'bg-light': '#F8FAFC',
        'bg-lighter': '#FFFFFF',
        'text-dark': '#1E293B',
        'text-light': '#E2E8F0',
        'border-dark': '#334155',
        'border-light': '#E2E8F0',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
