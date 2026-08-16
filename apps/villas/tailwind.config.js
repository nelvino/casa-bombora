/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: 'rgb(var(--gunmetal) / <alpha-value>)',
        'blue-green': 'rgb(var(--blue-green) / <alpha-value>)',
        lion: 'rgb(var(--lion) / <alpha-value>)',
        brown: 'rgb(var(--brown) / <alpha-value>)',
        alabaster: 'rgb(var(--alabaster) / <alpha-value>)',
        moss: 'rgb(var(--moss) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair-display)'],
      },
    },
  },
  plugins: [],
};
