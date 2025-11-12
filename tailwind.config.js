/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/*.{js,vue,ts}",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Deep Navy Blue
        primary: {
          DEFAULT: '#003366',
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066cc',
          600: '#004d99',
          700: '#003366',
          800: '#002244',
          900: '#001122',
        },
        // Secondary - Electric Blue
        secondary: {
          DEFAULT: '#007AFF',
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99ccff',
          300: '#66b2ff',
          400: '#3399ff',
          500: '#007AFF',
          600: '#0062cc',
          700: '#004999',
          800: '#003166',
          900: '#001933',
        },
        // Action/Alert - Orange
        action: {
          DEFAULT: '#FF9900',
          50: '#fff4e6',
          100: '#ffe9cc',
          200: '#ffd399',
          300: '#ffbd66',
          400: '#ffa733',
          500: '#FF9900',
          600: '#cc7a00',
          700: '#995c00',
          800: '#663d00',
          900: '#331f00',
        },
        // Success - Dark Green
        success: {
          DEFAULT: '#28A745',
          50: '#e8f5eb',
          100: '#d1ebd7',
          200: '#a3d7af',
          300: '#75c387',
          400: '#47af5f',
          500: '#28A745',
          600: '#208637',
          700: '#186529',
          800: '#10431c',
          900: '#08220e',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        'lg': '0 4px 8px 0 rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
