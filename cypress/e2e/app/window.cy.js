/// <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('window is defined', () => {
    cy.window().should('exist')
    cy.window().should('have.property', 'top')
  })

  it('document is defined', () => {
    cy.document().should('exist')
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('page title is "Genki Study Tool"', () => {
    cy.title().should('include', 'Genki Study Tool')
  })
})
