/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0A0E0D',
        surface:  '#0F1614',
        border:   '#182220',
        accent:   '#00D4AA',
        'accent-dim': 'rgba(0,212,170,0.10)',
        'accent-glow': 'rgba(0,212,170,0.06)',
        muted:    '#4A6E67',
        'muted-fg': '#7FA99F',
      },
      fontFamily: {
        sans:     ['DM Sans',      'system-ui', 'sans-serif'],
        heading:  ['Outfit',       'system-ui', 'sans-serif'],
        mono:     ['JetBrains Mono','Fira Code','monospace'],
      },
    },
  },
  plugins: [],
};
