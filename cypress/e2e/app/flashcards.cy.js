/// <reference types="cypress" />

describe("Flashcards activity", () => {
  beforeEach(() => {
    // Start from chapter 1 flashcards page
    cy.visit("/");
    cy.getDataTest("sidemenu-button").click();
    cy.get("a").contains("Flashcards").click();

    cy.wait(1000);

    cy.get("select#chapter").select("Chapter 1");
    cy.get("select#topic").select("Vocabulary");
    cy.getDataTest("submit-button").click();
    cy.wait(1000); // wait for server to respond
  });

  it("flashcard can be flipped", () => {
    cy.getDataTest("flashcard-front").should("be.visible");
    cy.getDataTest("flashcard-back").should("not.be.visible");

    cy.getDataTest("flashcard").click();
    cy.wait(500); // wait for animation

    cy.getDataTest("flashcard-front").should("not.be.visible");
    cy.getDataTest("flashcard-back").should("be.visible");

    cy.getDataTest("flashcard").click();
    cy.wait(500); // wait for animation

    cy.getDataTest("flashcard-front").should("be.visible");
    cy.getDataTest("flashcard-back").should("not.be.visible");
  });

  it("flashcard can go back and forth, flashcard counter accurately displays current flashcard number", () => {
    cy.get("p#flashcardCounter").should("contain.text", "1/77"); // Checking there is 77 flashcards for chapter 1 vocabulary

    for (let i = 0; i < 3; i++) {
      cy.getDataTest("flashcard-next-button").click();
      cy.wait(600); // wait for animation
    }
    cy.get("p#flashcardCounter").should("contain.text", "4/77");

    for (let i = 0; i < 2; i++) {
      cy.getDataTest("flashcard-prev-button").click();
      cy.wait(600); // wait for animation
    }
    cy.get("p#flashcardCounter").should("contain.text", "2/77");

    for (let i = 0; i < 3; i++) {
      cy.getDataTest("flashcard-prev-button").click();
      cy.wait(600); // wait for animation
    }
    cy.get("p#flashcardCounter").should("contain.text", "76/77");
  });
});
