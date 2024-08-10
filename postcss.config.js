import postcssNested from 'postcss-nested';

export default {
  plugins: {
    'tailwindcss/nesting': postcssNested,
    'tailwindcss': { config: './tailwind.config.js' },
    'autoprefixer': {},
  },
};
