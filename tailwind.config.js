/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './index.html',
    './{library,playground}/**/*.{vue,js,ts,jsx,tsx}',
    './main.ts',
    './App.vue',
  ],
  theme: {},
  plugins: [],
};
