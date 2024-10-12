import config from './presets/wangsvue/tailwind.config';

/** @type {import('tailwindcss').Config} */
export default {
  ...config,
  content: [
    './index.html',
    './{library,playground,presets}/**/*.{vue,js,ts,jsx,tsx}',
    './main.ts',
    './App.vue',
  ],
};
