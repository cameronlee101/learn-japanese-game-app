/// <reference types="cypress" />

describe('Flashcards activity', () => {
  beforeEach(() => {
    // Start from the flashcards topic selection page
    cy.visit('http://localhost:3000')
    cy.get('[class*="Sidebar_menuButton"]').click()
    cy.get('a').contains('Flashcards').click()
  })

  it('select chapter 1 numbers as the topic for the flashcards', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Numbers')
    cy.get('button').click()
  })

  it('select chapter 2 vocabulary as the topic for the flashcards', () => {
    cy.get('select#chapter').select('Chapter 2')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
  })

  it('select chapter 3 kanji as the topic for the flashcards', () => {
    cy.get('select#chapter').select('Chapter 3')
    cy.get('select#topic').select('Kanji')
    cy.get('button').click()
  })

  it('flashcard exists, and can be flipped', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
    cy.wait(1000) // wait for server to respond
    
    cy.get('[class*="Flashcard_front"]').should('exist')
    cy.get('[class*="Flashcard_back"]').should('exist')
    cy.get('[class*="Flashcard_flipped"]').should('not.exist')

    cy.get('[class*="Flashcard_flashcard"]').click()
    cy.get('[class*="Flashcard_flipped"]').should('exist')
    cy.wait(500) // wait for animation

    cy.get('[class*="Flashcard_flashcard"]').click()
    cy.get('[class*="Flashcard_flipped"]').should('not.exist')
  })

  it('go next and previous flashcards multiple times', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')

    cy.get('button').click()
    cy.wait(1000) // wait for server to respond
    
    for (let i = 0; i < 2; i++) {
      cy.get('[class*=flashcards-activity_flashcardButton]').eq(1).click()
      cy.wait(600) // wait for animation
    }
    for (let i = 0; i < 4; i++) {
      cy.get('[class*=flashcards-activity_flashcardButton]').eq(0).click()
      cy.wait(600) // wait for animation
    }
    for (let i = 0; i < 2; i++) {
      cy.get('[class*=flashcards-activity_flashcardButton]').eq(1).click()
      cy.wait(600) // wait for animation
    }
  })

  it('flashcard counter accurately displays current flashcard number', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
    cy.wait(1000) // wait for server to respond
    
    for (let i = 0; i < 3; i++) {
      cy.get('[class*=flashcards-activity_flashcardButton]').eq(1).click()
      cy.wait(600) // wait for animation
    }
    cy.get('p#flashcardCounter').should('contain.text', '4/')

    for (let i = 0; i < 2; i++) {
      cy.get('[class*=flashcards-activity_flashcardButton]').eq(0).click()
      cy.wait(600) // wait for animation
    }
    cy.get('p#flashcardCounter').should('contain.text', '2/')
  })
})