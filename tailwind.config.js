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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Core background and surface tokens
        brand: {
          header: 'var(--color-header, #e8e7e4)',
          headerText: 'var(--color-header-text, #0f3f8a)',
          body: 'var(--color-body, #0a1018)',
          panel: 'var(--color-panel, #101823)',
          panelHover: 'var(--color-panel-hover, #162232)',
          panelActive: 'var(--color-panel-active, #1c2b3f)',
          border: 'var(--color-border, #1f2d3f)',
          borderLight: 'var(--color-border-light, #2c3e56)',
          text: 'var(--color-text, #f2f4f7)',
          muted: 'var(--color-muted, #8d99a8)',
          subtle: 'var(--color-subtle, #4b5869)',
        },
        // ColourPlus Brand Colors
        cp: {
          navy: 'var(--color-cp-navy, #0f3f8a)',
          navyHover: 'var(--color-cp-navy-hover, #154fb0)',
          red: 'var(--color-cp-red, #e5373b)',
          green: 'var(--color-cp-green, #2f9e5b)',
        },
        // Funnel Status Colors
        funnel: {
          hot: 'var(--color-hot, #e5373b)',
          hotBg: 'var(--color-hot-bg, rgba(229, 55, 59, 0.12))',
          hotBorder: 'var(--color-hot-border, rgba(229, 55, 59, 0.35))',
          warm: 'var(--color-warm, #f59e0b)',
          warmBg: 'var(--color-warm-bg, rgba(245, 158, 11, 0.12))',
          warmBorder: 'var(--color-warm-border, rgba(245, 158, 11, 0.35))',
          nurture: 'var(--color-nurture, #2f9e5b)',
          nurtureBg: 'var(--color-nurture-bg, rgba(47, 158, 91, 0.12))',
          nurtureBorder: 'var(--color-nurture-border, rgba(47, 158, 91, 0.35))',
          outOfScope: 'var(--color-out-of-scope, #8d99a8)',
          outOfScopeBg: 'var(--color-out-of-scope-bg, rgba(141, 153, 168, 0.12))',
          outOfScopeBorder: 'var(--color-out-of-scope-border, rgba(141, 153, 168, 0.35))',
        }
      },
      borderRadius: {
        'card': 'var(--radius-card, 18px)',
        'pill': 'var(--radius-pill, 9999px)',
      },
      letterSpacing: {
        'tight-hero': 'var(--tracking-hero, -0.05em)',
      }
    },
  },
  plugins: [],
}

