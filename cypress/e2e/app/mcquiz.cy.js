/// <reference types="cypress" />

describe('Multiple choice quiz activity', () => {
  beforeEach(() => {
    // Start from the flashcards topic selection page
    cy.visit('http://localhost:3000')
    cy.get('[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('M.C. Quiz').click()
  })

  it('select chapter 1 numbers as the topic for the m.c. quiz', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Numbers')
    cy.get('button').click()
  })

  it('select chapter 2 vocabulary as the topic for the m.c. quiz', () => {
    cy.get('select#chapter').select('Chapter 2')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
  })

  it('select chapter 3 kanji as the topic for the m.c. quiz', () => {
    cy.get('select#chapter').select('Chapter 3')
    cy.get('select#topic').select('Kanji')
    cy.get('button').click()
  })

  // TODO: figure out how to make test deterministic
  it('all 4 options can be pressed', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
    
    cy.wait(1000) // wait for server
    cy.get('[class*="MCOptions_MCOption_"]').eq(0).click()
  })
})