/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gunmetal': '#1D2632',
        'blue-green': '#009CBC',
        'lion': '#BF9880',
        'moss-green': '#949665',
        'brown': '#994A18',
        'alabaster': '#EEEAE0',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair-display)'],
        cursive: ['var(--font-dancing-script)'], // Updated to a more legible cursive font
      },
    },
  },
  plugins: [],
}
