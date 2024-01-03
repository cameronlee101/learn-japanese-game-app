/// <reference types="cypress" />

describe('Navigation', () => {
  beforeEach(() => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
  })

  it('sidebar opens and closes when pressing hamburger button', () => {
    cy.get('svg[class*="Sidebar_menuButton"]').should('have.length', 1)

    cy.get('svg[class*="Sidebar_closed"]').should('have.length', 1)
    cy.get('aside[class*="Sidebar_closed"]').should('have.length', 1)
    cy.get('li[class*="Sidebar_closed"]').should('exist')

    cy.get('svg[class*="Sidebar_menuButton"]').click()
    cy.get('svg[class*="Sidebar_closed"]').should('not.exist')
    cy.get('aside[class*="Sidebar_closed"]').should('not.exist')
    cy.get('li[class*="Sidebar_closed"]').should('not.exist')
  })

  it('has a sidebar with 4 links to click', () => {
    cy.get('svg[class*="Sidebar_menuButton"]').click()

    cy.get('aside li').should('have.length', 4)
      .get('aside li').contains('Home').should('have.length', 1)
      .get('aside li').contains('Flashcards').should('have.length', 1)
      .get('aside li').contains('M.C. Quiz').should('have.length', 1)
      .get('aside li').contains('See Contents').should('have.length', 1)
  })

  it('navigate to Home page when on Home page', () => {
    cy.get('svg[class*="Sidebar_menuButton"]').click()

    cy.get('a').contains('Home').click()

    cy.location('pathname').should('not.include', 'selection')
  })

  it('navigate to flashcard activity, and go back and forth in the browser\'s history', () => {
    cy.get('svg[class*="Sidebar_menuButton"]').click()
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

    cy.wait(1000) // wait to give server time between requests

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
    cy.get('svg[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('M.C. Quiz').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'mc-quiz')

    cy.get('button').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'mc-quiz')

    cy.get('svg[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('Home').click()
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'mc-quiz')
  })

  it('navigate to see contents of a chapter and topic, then go back to home', () => {
    cy.get('svg[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('See Contents').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'contents-of')

    cy.get('button').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'contents-of')

    cy.get('svg[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('Home').click()
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'contents-of')
  })
})