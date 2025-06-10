/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{html,js,mp4,jpg,png}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      screens: {
        'xs': '360px', // Optional smaller screen support
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/aspect-ratio'), // optional for image blocks
    require('@tailwindcss/forms'),        // optional if you're using any forms
  ],
}
