/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-black': '#0a0a0f',
        'legal-dark': '#0f1420',
        'legal-card': '#141824',
        'legal-border': 'rgba(245, 158, 11, 0.2)',
        'legal-silver': '#94a3b8',
        'legal-light': '#f8fafc',
        'legal-accent': '#f59e0b',
        'legal-accent2': '#3b82f6',
        'legal-gold': '#f59e0b',
        'legal-gold-dark': '#d97706',
        'legal-blue': '#3b82f6',
        'legal-green': '#22c55e',
        'legal-red': '#ef4444',
        'legal-orange': '#fb923c',
      },
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'heading': ['Playfair Display', 'Georgia', 'serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(245, 158, 11, 0.15)',
        'glow-lg': '0 0 60px rgba(245, 158, 11, 0.25)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245,158,11,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'gradient-card': 'linear-gradient(135deg, rgba(20,24,36,0.8) 0%, rgba(20,24,36,0.4) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
