/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
/// <reference types="cypress" />
import type { App } from 'vue';
import { mount } from '@cypress/vue';
import '@cypress/code-coverage/support';
import './commands';

import './tailwind.css';

import PrimeVue from 'primevue/config';
import Presets from '../../src/preset';
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';

/**
 * A custom commands for mounting Components and plugins.
 */
Cypress.Commands.add('mount', (component: any, options = {}) => {
  options.global = options.global || {};
  options.global.stubs = options.global.stubs || {};
  options.global.stubs['transition'] = false;
  options.global.components = options.global.components || {};
  options.global.plugins = options.global.plugins || [];

  options.global.plugins.push({
    install(app: App) {
      app.use(PrimeVue, {
        unstyled: true,
        pt: Presets,
      });

      app.use(ToastService);
      app.directive('tooltip', Tooltip);
    },
  });

  return mount(component, options);
});

after(() => {
  cy.task('coverageReport');
});
