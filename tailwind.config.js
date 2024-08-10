import colors from './src/colors.config.json';
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './main.ts', './App.vue'],
  theme: {
    extend: {
      colors: {
        'surface-0': 'rgb(var(--surface-0))',
        'surface-50': 'rgb(var(--surface-50))',
        'surface-100': 'rgb(var(--surface-100))',
        'surface-200': 'rgb(var(--surface-200))',
        'surface-300': 'rgb(var(--surface-300))',
        'surface-400': 'rgb(var(--surface-400))',
        'surface-500': 'rgb(var(--surface-500))',
        'surface-600': 'rgb(var(--surface-600))',
        'surface-700': 'rgb(var(--surface-700))',
        'surface-800': 'rgb(var(--surface-800))',
        'surface-900': 'rgb(var(--surface-900))',
        'surface-950': 'rgb(var(--surface-950))',

        ...colors,
      },
      outline: {
        none: 'none',
      },
      boxShadow: {
        panel: '-4px 4px 20px 0px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [],
};
