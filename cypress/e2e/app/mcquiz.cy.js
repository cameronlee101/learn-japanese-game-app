/// <reference types="cypress" />

describe('Multiple choice quiz activity', () => {
  beforeEach(() => {
    // Start from the flashcards topic selection page
    cy.visit('http://localhost:3000')
    cy.get('[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('M.C. Quiz').click()
  })
})