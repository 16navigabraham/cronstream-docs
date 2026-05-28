/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#080D0F',
        surface:  '#0C1518',
        border:   '#152226',
        accent:   '#22C5D3',
        'accent-dim': 'rgba(34,197,211,0.10)',
        'accent-glow': 'rgba(34,197,211,0.06)',
        muted:    '#3D6878',
        'muted-fg': '#6AAFC0',
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
