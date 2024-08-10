import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import istanbul from 'vite-plugin-istanbul';
import buildEntries from './src/components/buildEntries';

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
      entry: buildEntries.map((entry) => resolve(__dirname, entry)),
      formats: ['es'],
      fileName: (format, name) => `${name}.js`,
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
