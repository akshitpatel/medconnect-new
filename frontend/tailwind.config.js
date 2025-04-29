/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary color - keeping clean blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Main secondary color - refined teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Updated emergency colors - more professional but still alert-oriented
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Base emergency red
          600: '#dc2626', // Darker for buttons
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Medical-inspired color palette
        medical: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6', // Professional medical blue
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Modern medical teal
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
          },
          mint: {
            50: '#f1fcf8',
            100: '#d3f8e9',
            200: '#a8f0d3',
            300: '#74e4b7',
            400: '#3fd597',
            500: '#20c37e', // Fresh mint for accents
            600: '#17a169',
            700: '#15805a',
            800: '#146646',
            900: '#135436',
            950: '#07291c',
          },
          lavender: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6', // Soft lavender for secondary elements
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065',
          },
          warmGray: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c', // Neutral warm gray for backgrounds
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
            950: '#0c0a09',
          },
        },
        // Theme colors maintained but refined
        theme: {
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
          violet: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        glow: '0 0 15px rgba(255, 255, 255, 0.3)',
        'glow-indigo': '0 0 15px rgba(99, 102, 241, 0.4)',
        'glow-violet': '0 0 15px rgba(139, 92, 246, 0.4)',
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.4)',
        'glow-teal': '0 0 15px rgba(20, 184, 166, 0.4)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
        'glow-mint': '0 0 15px rgba(32, 195, 126, 0.4)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-8px) translateX(5px)' },
          '50%': { transform: 'translateY(0) translateX(10px)' },
          '75%': { transform: 'translateY(8px) translateX(5px)' },
        },
        'float-slow-reverse': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(8px) translateX(-5px)' },
          '50%': { transform: 'translateY(0) translateX(-10px)' },
          '75%': { transform: 'translateY(-8px) translateX(-5px)' },
        },
        'float-random': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(4px, -4px)' },
          '20%': { transform: 'translate(8px, 2px)' },
          '30%': { transform: 'translate(2px, 8px)' },
          '40%': { transform: 'translate(-4px, 4px)' },
          '50%': { transform: 'translate(-8px, -2px)' },
          '60%': { transform: 'translate(-2px, -8px)' },
          '70%': { transform: 'translate(4px, -4px)' },
          '80%': { transform: 'translate(8px, 2px)' },
          '90%': { transform: 'translate(2px, 8px)' },
        },
        'float-random-reverse': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-4px, 4px)' },
          '20%': { transform: 'translate(-8px, -2px)' },
          '30%': { transform: 'translate(-2px, -8px)' },
          '40%': { transform: 'translate(4px, -4px)' },
          '50%': { transform: 'translate(8px, 2px)' },
          '60%': { transform: 'translate(2px, 8px)' },
          '70%': { transform: 'translate(-4px, 4px)' },
          '80%': { transform: 'translate(-8px, -2px)' },
          '90%': { transform: 'translate(-2px, -8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'pulse-medium': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'pulse-fast': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'qr-scan': {
          '0%': { top: '0%', opacity: 0 },
          '10%': { opacity: 0.8 },
          '90%': { opacity: 0.8 },
          '100%': { top: '100%', opacity: 0 },
        },
        'fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-slow-reverse': 'float-slow-reverse 20s ease-in-out infinite',
        'float-random': 'float-random 25s ease-in-out infinite',
        'float-random-reverse': 'float-random-reverse 25s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'pulse-medium': 'pulse-medium 2s ease-in-out infinite',
        'pulse-fast': 'pulse-medium 1s ease-in-out infinite',
        'qr-scan': 'qr-scan 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'spin-slow': 'spin-slow 20s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 5s ease infinite',
      },
      scale: {
        '98': '0.98',
      },
      rotate: {
        'y-180': 'rotateY(180deg)'
      },
      perspective: {
        'DEFAULT': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      backgroundImage: {
        'gradient-theme': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'gradient-theme-animated': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'mesh-pattern': 'radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'mesh-sm': '20px 20px',
        'mesh-md': '30px 30px',
        'mesh-lg': '40px 40px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.perspective': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.active\:scale-98:active': {
          transform: 'scale(0.98)',
        },
        '.gradient-mask-b': {
          '-webkit-mask-image': 'linear-gradient(to bottom, black 50%, transparent 100%)',
          'mask-image': 'linear-gradient(to bottom, black 50%, transparent 100%)',
        },
        '.gradient-mask-t': {
          '-webkit-mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
          'mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
} 