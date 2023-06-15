/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: ['app/**/*.{jsx,tsx,js,ts}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: colors.red,
        yellow: colors.amber,
        blue: colors.blue,
      },
    },
  },
  plugins: [],
};
