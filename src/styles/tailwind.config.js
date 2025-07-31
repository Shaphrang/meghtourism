/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{html,js,mp4,jpg,png}',
    './components/**/*.{js,ts,jsx,tsx}' // add this if shadcn components live here
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Geist',
          'Inter',
          'Montserrat',
          'Poppins',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        meghGreen: '#166534',
        warmAmber: '#FFC857',
        cloudMist: '#E8F6EF',
        tribalRed: '#C81D25',
        deepIndigo: '#22223B',
        charcoal: '#393E41',
        stoneGray: '#F5F3F4',
      },
      screens: {
        xs: '360px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate') // ✅ Required by shadcn
  ],
}
