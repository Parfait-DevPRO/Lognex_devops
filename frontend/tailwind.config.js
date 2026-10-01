/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: 'rgb(var(--page) / <alpha-value>)',
          800: 'rgb(var(--surface) / <alpha-value>)',
          700: 'rgb(var(--surface-muted) / <alpha-value>)',
          600: 'rgb(var(--border) / <alpha-value>)',
          500: 'rgb(var(--muted) / <alpha-value>)'
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
}
