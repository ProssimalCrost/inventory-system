describe('Raw Materials CRUD', () => {
  beforeEach(() => cy.visit('/raw-materials'));

  it('displays the raw materials page', () => {
    cy.contains('h1', 'Matérias-Primas').should('be.visible');
    cy.get('[data-cy=btn-new-raw-material]').should('be.visible');
  });

  it('creates a new raw material', () => {
    cy.createRawMaterial('Aço Cypress', '50');
    cy.contains('[data-cy=raw-material-row]', 'Aço Cypress').should('exist');
  });

  it('edits a raw material', () => {
    cy.createRawMaterial('Material Editar', '10');
    cy.contains('[data-cy=raw-material-row]', 'Material Editar')
      .find('[data-cy=btn-edit-rm]').click();
    cy.get('#rm-stock').clear().type('99');
    cy.contains('button', 'Salvar').click();
    cy.contains('[data-cy=raw-material-row]', '99,000').should('exist');
  });

  it('deletes a raw material', () => {
    cy.createRawMaterial('Material Deletar', '5');
    cy.contains('[data-cy=raw-material-row]', 'Material Deletar')
      .find('[data-cy=btn-delete-rm]').click();
    cy.contains('button', 'Confirmar').click();
    cy.contains('[data-cy=raw-material-row]', 'Material Deletar').should('not.exist');
  });
});
