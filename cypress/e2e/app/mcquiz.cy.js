/// <reference types="cypress" />

describe('Multiple choice quiz activity', () => {
  beforeEach(() => {
    // Start from the multiple choice quiz topic selection page
    cy.visit('/')
    cy.getDataTest('sidemenu-button').click()
    cy.get('a').contains('M.C. Quiz').click()
  })

  // TODO: figure out how to make test deterministic
  it('all 4 options can be pressed', () => {
    cy.get('select#chapter').select('Chapter 1')
    cy.get('select#topic').select('Vocabulary')
    cy.getDataTest('submit-button').click()
    cy.wait(1000) // wait for server

    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click()
      cy.wait(1)
    }
  })
})