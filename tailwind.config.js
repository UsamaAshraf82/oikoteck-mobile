/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*{js,ts,tsx}'],

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
    },
  },
  plugins: [],
};
