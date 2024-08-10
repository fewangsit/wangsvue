/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to mount a Vue component in a Cypress test.
     * @example cy.mount(MyComponent)
     */
    mount(component: any, options?: any): Chainable;
    /**
     * Custom command to select DOM element by data-ts-section attribute.
     * @example cy.getSection('title')
     */
    getSection(value: string): Chainable<Element>;
    /**
     * Custom command to select DOM element by data-ts-name attribute.
     * @example cy.getByName('title')
     */
    getByName(value: string): Chainable<Element>;
    /**
     * Custom command to select DOM element by any data attribute.
     * @example cy.getByData('field-name', 'fieldName')
     */
    getByData(dataName: string, value: string): Chainable<Element>;
    /**
     * Sets user token to localstorage.
     */
    login(): void;
  }
}

declare module 'tsv2-library/src/presets';
