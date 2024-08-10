import colors from './src/colors.config.json';
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './{src,playground}/**/*.{vue,js,ts,jsx,tsx}', './main.ts', './App.vue'],
  theme: {
    extend: {
      colors,
      outline: {
        none: 'none',
      },
      boxShadow: {
        panel: '-4px 4px 20px 0px rgba(0, 0, 0, 0.10)',
        hover: '0px 1px 3px 1px #00000033',
      },
    },
  },
  plugins: [],
};
