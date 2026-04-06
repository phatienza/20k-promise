/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        navy: {
          DEFAULT: '#0D1F3C',
          light: '#1B3A6B',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#F0CC7A',
        },
      },
    },
  },
  plugins: [],
}
