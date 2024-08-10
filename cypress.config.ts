import { defineConfig } from 'cypress';
import Task from '@cypress/code-coverage/task';

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 720,
  env: {
    visualRegressionType: 'regression',
    visualRegressionBaseDirectory: 'cypress/snapshots/base',
    visualRegressionDiffDirectory: 'cypress/snapshots/diff',
    visualRegressionGenerateDiff: 'always',
    visualRegressionFailSilently: false,
  },
  screenshotsFolder: 'cypress/snapshots/actual',
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/tests/**/*.cy.spec.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      Task(on, config);

      return config;
    },
  },
  component: {
    specPattern: 'library/**/*.cy.spec.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    watchForFileChanges: false,
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      Task(on, config);

      return config;
    },
  },
});
