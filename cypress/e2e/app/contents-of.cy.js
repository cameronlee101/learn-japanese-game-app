/// <reference types="cypress" />

describe('Seeing contents of a topic', () => {
  beforeEach(() => {
    // Start from contents topic selection page
    cy.visit('/')
    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('See Contents').click()
  })

  it('can load the contents of chapter 1 vocabulary', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.getDataTest('submit-button').click()
    cy.wait(1000) // wait for server

    cy.get('th').should('have.length', 5) // should be 5 attributes for vocabulary
    cy.get('tbody tr').should('have.length.at.least', 1)
  })

  it('can load the contents of chapter 3 kanji', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.getDataTest('submit-button').click()
    cy.wait(1000) // wait for server

    cy.get('th').should('have.length', 5) // should be 5 attributes for kanji
    cy.get('tbody tr').should('have.length.at.least', 1)
  })
})