/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        canvas: 'var(--canvas)',
        surface: {
          subtle: 'var(--surface-subtle)',
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          base: 'var(--border-base)',
          strong: 'var(--border-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        brand: {
          navy: 'var(--brand-navy)',
          navyHover: 'var(--brand-navy-hover)',
          green: 'var(--brand-green)',
          red: 'var(--brand-red)',
        },
        funnel: {
          hot: 'var(--funnel-hot)',
          hotBg: 'var(--funnel-hot-bg)',
          hotBorder: 'var(--funnel-hot-border)',
          warm: 'var(--funnel-warm)',
          warmBg: 'var(--funnel-warm-bg)',
          warmBorder: 'var(--funnel-warm-border)',
          nurture: 'var(--funnel-nurture)',
          nurtureBg: 'var(--funnel-nurture-bg)',
          nurtureBorder: 'var(--funnel-nurture-border)',
          scope: 'var(--funnel-scope)',
          scopeBg: 'var(--funnel-scope-bg)',
          scopeBorder: 'var(--funnel-scope-border)',
        },
      },
      boxShadow: {
        'elevation-1': 'var(--shadow-elevation-1)',
        'elevation-2': 'var(--shadow-elevation-2)',
        'elevation-3': 'var(--shadow-elevation-3)',
        'glow-hot': 'var(--shadow-glow-hot)',
        'glow-navy': 'var(--shadow-glow-navy)',
        'glow-green': 'var(--shadow-glow-green)',
      },
      borderRadius: {
        'card': '18px',
        'modal': '24px',
        'pill': '9999px',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)' },
          '50%': { boxShadow: '0 0 25px rgba(239, 68, 68, 0.45)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2.5s infinite ease-in-out',
        'shimmer': 'shimmer 1.8s infinite',
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
