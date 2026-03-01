describe('Products CRUD', () => {
  beforeEach(() => cy.visit('/products'));

  it('displays the products page', () => {
    cy.contains('h1', 'Produtos').should('be.visible');
    cy.get('[data-cy=btn-new-product]').should('be.visible');
  });

  it('creates a new product', () => {
    cy.createProduct('Produto Cypress', '250');
    cy.contains('[data-cy=product-row]', 'Produto Cypress').should('exist');
  });

  it('edits an existing product', () => {
    cy.createProduct('Produto Editar', '100');
    cy.contains('[data-cy=product-row]', 'Produto Editar')
      .find('[data-cy=btn-edit-product]').click();
    cy.get('#p-name').clear().type('Produto Atualizado');
    cy.contains('button', 'Salvar').click();
    cy.contains('[data-cy=product-row]', 'Produto Atualizado').should('exist');
  });

  it('deletes a product', () => {
    cy.createProduct('Produto Deletar', '75');
    cy.contains('[data-cy=product-row]', 'Produto Deletar')
      .find('[data-cy=btn-delete-product]').click();
    cy.contains('button', 'Confirmar').click();
    cy.contains('[data-cy=product-row]', 'Produto Deletar').should('not.exist');
  });

  it('expands raw materials panel on row click', () => {
    cy.createProduct('Produto Panel', '90');
    cy.contains('[data-cy=product-row]', 'Produto Panel').click();
    cy.contains('Matérias-Primas Utilizadas').should('be.visible');
  });
});
