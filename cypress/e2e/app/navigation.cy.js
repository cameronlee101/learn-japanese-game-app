/// <reference types="cypress" />

describe('Navigation (sidebar)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('sidebar exists', () => {
    cy.getDataTest('sidemenu-button').should('have.length', 1)
    cy.getDataTest('sidemenu').should('have.length', 1)
  })

  it('sidebar opens and closes when pressing hamburger button', () => {
    cy.getDataTest('sidemenu-button').should('be.visible')
    cy.getDataTest('sidemenu').should('not.be.visible')
    cy.get('aside li').should('not.be.visible')

    cy.getDataTest('sidemenu-button').click()

    cy.getDataTest('sidemenu-button').should('be.visible')
    cy.getDataTest('sidemenu').should('be.visible')
    cy.get('aside li').should('be.visible')

    cy.getDataTest('sidemenu-button').click()

    cy.getDataTest('sidemenu-button').should('be.visible')
    cy.getDataTest('sidemenu').should('not.be.visible')
    cy.get('aside li').should('not.be.visible')

  })

  it('has a sidebar with 4 specific links to click', () => {
    cy.getDataTest('sidemenu-button').click()

    cy.get('aside li').should('have.length', 4)
      .get('aside li').contains('Home').should('have.length', 1)
      .get('aside li').contains('Flashcards').should('have.length', 1)
      .get('aside li').contains('M.C. Quiz').should('have.length', 1)
      .get('aside li').contains('See Contents').should('have.length', 1)
  })

  it('navigate to Home page when on Home page', () => {
    cy.getDataTest('sidemenu-button').click()

    cy.get('a').contains('Home').click()

    cy.location('pathname').should('equal', '/')
  })

  it('navigate to flashcard activity, and go back and forth in the browser\'s history', () => {
    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('Flashcards').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'flashcards-activity')

    cy.get('button').contains(/submit/i).click()
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
    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('M.C. Quiz').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'mc-quiz')

    cy.get('button').contains(/submit/i).click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'mc-quiz')

    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('Home').click()
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'mc-quiz')
  })

  it('navigate to see contents of a chapter and topic, then go back to home', () => {
    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('See Contents').click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('include', 'selection')
      .location('pathname').should('include', 'contents-of')

    cy.get('button').contains(/submit/i).click()
    cy.location('pathname').should('include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('include', 'contents-of')

    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('Home').click()
    cy.location('pathname').should('not.include', 'pages')
      .location('pathname').should('not.include', 'selection')
      .location('pathname').should('not.include', 'contents-of')
  })
})