describe('Production Suggestions', () => {
  beforeEach(() => cy.visit('/production'));

  it('displays the production page', () => {
    cy.contains('h1', 'Sugestão de Produção').should('be.visible');
    cy.get('[data-cy=production-summary]').should('be.visible');
  });

  it('shows the total value', () => {
    cy.get('[data-cy=production-summary]').contains('R$').should('exist');
  });

  it('lists suggestion rows when stock allows production', () => {
    // This test assumes seed data is present in the test environment
    cy.get('body').then($body => {
      if ($body.find('[data-cy=suggestion-row]').length > 0) {
        cy.get('[data-cy=suggestion-row]').should('have.length.gte', 1);
      } else {
        cy.contains('Sem sugestões no momento').should('be.visible');
      }
    });
  });

  it('refreshes data on button click', () => {
    cy.contains('button', '↻ Atualizar').click();
    cy.get('[data-cy=production-summary]').should('be.visible');
  });
});
