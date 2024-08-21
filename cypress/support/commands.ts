/// <reference types="cypress" />
import 'cypress-real-events';

Cypress.Commands.add('getSection', (section) => {
  cy.get(`[data-wv-section="${section}"]`);
});

Cypress.Commands.add('getByName', (name) => {
  cy.get(`[data-wv-name="${name}"]`);
});

Cypress.Commands.add('getByData', (dataName: string, value: string) => {
  cy.get(`[data-${dataName}="${value}"]`);
});
