/// <reference types="cypress" />

describe('Flashcards activity', () => {
  beforeEach(() => {
    // Start from the flashcards topic selection page
    cy.visit('/')
    cy.getDataTest('sidemenu-button').click()
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

  it('flashcard can be flipped', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
    cy.wait(1000) // wait for server to respond
    
    cy.getDataTest('flashcard-front').should('be.visible')
    cy.getDataTest('flashcard-back').should('not.be.visible')

    cy.getDataTest('flashcard').click()
    cy.wait(500) // wait for animation

    cy.getDataTest('flashcard-front').should('not.be.visible')
    cy.getDataTest('flashcard-back').should('be.visible')

    cy.getDataTest('flashcard').click()
    cy.wait(500) // wait for animation
    
    cy.getDataTest('flashcard-front').should('be.visible')
    cy.getDataTest('flashcard-back').should('not.be.visible')
  })

  it('go next and previous flashcards multiple times', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')

    cy.get('button').click()
    cy.wait(1000) // wait for server to respond
    
    for (let i = 0; i < 2; i++) {
      cy.getDataTest('flashcard-next-button').click()
      cy.wait(600) // wait for animation
    }
    for (let i = 0; i < 4; i++) {
      cy.getDataTest('flashcard-prev-button').click()
      cy.wait(600) // wait for animation
    }
    for (let i = 0; i < 2; i++) {
      cy.getDataTest('flashcard-next-button').click()
      cy.wait(600) // wait for animation
    }
  })

  it('chapter 1 vocabulary has 77 flashcards', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
    cy.wait(1000) // wait for server to respond

    cy.get('p#flashcardCounter').should('contain.text', '1/77')
  })

  it('flashcard counter accurately displays current flashcard number', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.get('button').click()
    cy.wait(1000) // wait for server to respond
    
    for (let i = 0; i < 3; i++) {
      cy.getDataTest('flashcard-next-button').click()
      cy.wait(600) // wait for animation
    }
    cy.get('p#flashcardCounter').should('contain.text', '4/77')

    for (let i = 0; i < 2; i++) {
      cy.getDataTest('flashcard-prev-button').click()
      cy.wait(600) // wait for animation
    }
    cy.get('p#flashcardCounter').should('contain.text', '2/77')

    for (let i = 0; i < 3; i++) {
      cy.getDataTest('flashcard-prev-button').click()
      cy.wait(600) // wait for animation
    }
    cy.get('p#flashcardCounter').should('contain.text', '76/77')
  })
})