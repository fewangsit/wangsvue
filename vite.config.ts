import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  base: '/wangsvue',
  plugins: [vue()],
  resolve: {
    alias: {
      lib: resolve(__dirname, 'library'),
    },
  },
  server: {
    watch: {
      ignored: ['**/dist/**'],
    },
    proxy: {
      '/api': {
        target: 'https://sonarqube.qwertysystem.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  assetsInclude: ['**/*.lottie'],
});
