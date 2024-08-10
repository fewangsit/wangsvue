import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    istanbul({
      include: ['src/**/*', 'src/utils*'],
      exclude: [
        'node_modules',
        'src/**/*.spec.ts',
        'src/**/*.type.ts',
        'src/**/*.dto.ts',
        // 'src/**/*.d.ts',
      ],
      extension: ['.ts', '.vue'],
      requireEnv: false,
    }),
  ],
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    outDir: 'dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/build-entry.ts',
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
      '@': resolve(__dirname, 'src'),
    },
  },
});
