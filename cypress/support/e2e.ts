import './commands';

after(() => {
  cy.task('coverageReport');
});
