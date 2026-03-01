// cypress/support/commands.js
Cypress.Commands.add('createProduct', (name, value) => {
  cy.get('[data-cy=btn-new-product]').click();
  cy.get('#p-name').type(name);
  cy.get('#p-value').type(value);
  cy.contains('button', 'Salvar').click();
});

Cypress.Commands.add('createRawMaterial', (name, stock) => {
  cy.get('[data-cy=btn-new-raw-material]').click();
  cy.get('#rm-name').type(name);
  cy.get('#rm-stock').type(stock);
  cy.contains('button', 'Salvar').click();
});
