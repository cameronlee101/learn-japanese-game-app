/// <reference types="cypress" />

describe('Navigation', () => {
  beforeEach(() => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
  })

  it('navigate to Home page when on Home page', () => {
    cy.get('.menuButton').click()

    cy.get('a').contains('Home').click()

    cy.location('pathname').should('not.include', 'selection')
  })

  it('navigate to flashcard activity, and go back and forth in the browser\'s history', () => {
    cy.get('.menuButton').click()
    cy.get('a').contains('Flashcards').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'flashcards-activity')

    cy.get('button').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'flashcards-activity')

    cy.go('back')
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'flashcards-activity')

    cy.go('back')
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'flashcards-activity')

    cy.wait(1000)

    cy.go('forward')
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'flashcards-activity')

    cy.go('forward')
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'flashcards-activity')
  })

  it('navigate to multiple choice quiz activity, then go back to home', () => {
    cy.get('.menuButton').click()
    cy.get('a').contains('M.C. Quiz').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'mc-quiz')

    cy.get('button').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'mc-quiz')

    cy.get('.menuButton').click()
    cy.get('a').contains('Home').click()
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'mc-quiz')
  })

  it('navigate to see contents of a chapter and topic, then go back to home', () => {
    cy.get('.menuButton').click()
    cy.get('a').contains('See Contents').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'contents-of')

    cy.get('button').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'contents-of')

    cy.get('.menuButton').click()
    cy.get('a').contains('Home').click()
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'contents-of')
  })
})