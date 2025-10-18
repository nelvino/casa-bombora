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
        'gunmetal': '#1C232C',
        'blue-green': '#445464',
        'lion': '#C89C7E',
        'moss-green': '#7C7A53',
        'brown': '#8C5031',
        'alabaster': '#DCD2BC',
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
