import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/wangsvue',
  plugins: [vue()],
  resolve: {
    alias: {
      lib: fileURLToPath(new URL('./library', import.meta.url)),
    },
  },
});
