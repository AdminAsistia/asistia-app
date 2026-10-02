import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Atelier Sanitas - Quiet Luxury Aesthetic
        // Primary palette - Neutral elegance
        slate: {
          50: '#FAFBFC',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        // Accent - Warm terracotta / rose
        rose: {
          50: '#FFF5F7',
          100: '#FFE4EC',
          200: '#FCC8D9',
          300: '#FFA3C1',
          400: '#FF85AD',
          500: '#F55A90',
          600: '#EB3B72',
          700: '#C72C5D',
          800: '#A4234D',
          900: '#7D1A3A',
          950: '#5C1229',
        },
        // Complementary - Soft sage
        sage: {
          50: '#F9FDFB',
          100: '#EFF6F1',
          200: '#D7E8DC',
          300: '#B8D6BC',
          400: '#8FB9A0',
          500: '#6B9D84',
          600: '#548B6F',
          700: '#436E5A',
          800: '#365646',
          900: '#273E37',
          950: '#1A2B23',
        },
        // Neutral warm - For backgrounds
        warm: {
          50: '#FFFCF9',
          100: '#FEF8F3',
          200: '#FCF1E8',
          300: '#F9E4D7',
          400: '#F5D1BD',
          500: '#F0B9A0',
          600: '#E89D82',
          700: '#D97F66',
          800: '#C05C42',
          900: '#924630',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Genos', 'serif'],
        serif: ['Crimson Text', 'serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.7' }],
        '2xl': ['24px', { lineHeight: '1.7' }],
        '3xl': ['32px', { lineHeight: '1.8' }],
        '4xl': ['40px', { lineHeight: '1.8' }],
        '5xl': ['48px', { lineHeight: '1.9' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
      },
      borderRadius: {
        none: '0',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        elevation: '0 8px 16px -2px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [forms],
} satisfies Config
