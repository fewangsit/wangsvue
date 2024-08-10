import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    outDir: 'dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'build-entry.ts',
      formats: ['es'],
      fileName: 'wangsvue.es',
    },
    rollupOptions: {
      /*
       * Make sure to externalize deps that should not be bundled
       * into your library
       */
      external: ['vue'],
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
  server: {
    port: 8888,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      lib: resolve(__dirname),
    },
  },
});
