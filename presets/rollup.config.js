import nodeResolver from '@rollup/plugin-node-resolve';

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/wangsvue-presets.system.js',
      format: 'system',
    },
  ],
  plugins: [nodeResolver()],
};
