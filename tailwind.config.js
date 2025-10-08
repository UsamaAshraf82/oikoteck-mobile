/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#192234',
        secondary: '#82065e',
        promote: '#5412a1',
        promote_plus: '#398be9',
        gold: '#e6c623',
        platinum: '#ff9c46',
        pending: '#ee932b',
        active: '#28a477',
        expired: '#5412a1',
        deleted: '#5e5e6e',
        rejected: '#cc3f33',

        o_light_gray: '#7D7D7D',
        o_gray: { 200: '#8D95A5' },
      },
      fontFamily: {
        sans: ['LufgaRegular', 'sans-serif'],
        thin: ['LufgaThin', 'sans-serif'],
        extralight: ['LufgaExtraLight', 'sans-serif'],
        light: ['LufgaLight', 'sans-serif'],
        normal: ['LufgaRegular', 'sans-serif'],
        medium: ['LufgaMedium', 'sans-serif'],
        semibold: ['LufgaSemiBold', 'sans-serif'],
        bold: ['LufgaBold', 'sans-serif'],
        extrabold: ['LufgaExtraBold', 'sans-serif'],
        black: ['LufgaBlack', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
