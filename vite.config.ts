import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path, { resolve } from 'path';

const componentsDir = path.resolve(__dirname, './library/components');

const getComponents = (dir: string): string[] => {
  const entries = fs.readdirSync(dir);
  const components = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry);
    const stats = fs.statSync(entryPath);

    if (stats.isDirectory()) {
      components.push(...getComponents(entryPath));
    } else if (stats.isFile() && path.extname(entry) === '.vue') {
      components.push(entryPath);
    }
  }

  return components;
};

const components = getComponents(componentsDir);

const alias = components.reduce(
  (acc, componentPath) => {
    const componentName = path.basename(componentPath, '.vue');
    const relativePath = path.relative(componentsDir, componentPath);
    acc[`wangsvue/${componentName.toLowerCase()}`] = path.resolve(
      componentsDir,
      relativePath,
    );
    return acc;
  },
  {} as Record<string, string>,
);

// Write the alias object to tsconfig.paths.json with relative paths
const paths = Object.entries(alias).reduce(
  (acc, [key, value]) => {
    acc[key] = [path.relative(process.cwd(), value)];
    return acc;
  },
  {} as Record<string, string[]>,
);

fs.writeFileSync(
  path.resolve(__dirname, 'tsconfig.paths.json'),
  JSON.stringify(
    {
      compilerOptions: {
        rootDir: '.',
        paths: {
          'lib/*': ['library/*'],
          ...paths,
        },
      },
    },
    null,
    2,
  ),
);

export default defineConfig({
  base: '/wangsvue',
  plugins: [vue()],
  resolve: {
    alias: {
      lib: resolve(__dirname, 'library'),
      ...alias,
    },
  },
});
