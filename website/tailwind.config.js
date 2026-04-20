/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#faf9f6',
        'cream-alt': '#f4f3f1',
        'text-primary': '#1a1c1a',
        'text-secondary': '#54433c',
        terracotta: '#954926',
        orange: '#d87d56',
        gold: '#bd8d27',
        dark: '#1e1a17',
      },
    },
  },
  plugins: [],
}

