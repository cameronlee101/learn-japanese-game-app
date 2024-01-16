/// <reference types="cypress" />

// TODO: implement e2e tests for selection page
describe('Activity selection page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('Flashcards').click()
  })
})