import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    cssMinify: true,
    minify: true,
    cssCodeSplit: true,
    sourcemap: false,
    outDir: 'dist',
    lib: {
      entry: 'build-entry.ts',
      formats: ['system', 'es'],
      fileName: (format) => `wangsvue.${format}.js`,
    },
    rollupOptions: {
      /*
       * Make sure to externalize deps that should not be bundled
       * into your library
       */
      external: ['vue', 'axios', 'vue-router'],
      output: {
        assetFileNames: (assetInfo): string => {
          if (assetInfo.name === 'build-entry.css') return 'style.css';
          return assetInfo.name ?? '';
        },
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  assetsInclude: ['**/*.lottie'],
  server: {
    port: 8888,
    hmr: {
      overlay: false,
    },
    // Use proxy for temporary only
    proxy: {
      '/api': {
        target: 'https://sonarqube.qwertysystem.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      lib: resolve(__dirname),
    },
  },
  optimizeDeps: {
    include: ['primevue'],
  },
});
