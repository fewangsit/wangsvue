// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

// Get the version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const { version } = packageJson;

// Change directory to 'dist'
process.chdir('dist');

// Create a new package.json with the dynamic version
const newPackageJson = {
  name: 'wangsvue',
  version,
  author: 'fewangsit',
  description: 'Wangsit VueJS Component Library',
  module: './wangsvue.es.js',
  types: './main.d.ts',
  exports: {
    '.': './wangsvue.es.js',
    './style.css': './style.css',
    './types': './types',
    './event-bus': './event-bus',
    './utils': './utils',
    './colors.config.json': './colors.config.json',
  },
};

fs.writeFileSync('package.json', JSON.stringify(newPackageJson, null, 2));

// Change back to the original directory
process.chdir('../');
