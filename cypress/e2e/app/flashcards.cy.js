/// <reference types="cypress" />

describe("Flashcards activity", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI",
      {
        fixture: "collection.json",
      },
    ).as("fetchCollection");

    cy.visit("/");
    cy.getDataTest("sidemenu-button").click();
    cy.get("a").contains("Flashcards").click();

    cy.wait("@fetchCollection");

    cy.get("select#chapter").select("Chapter 1");
    cy.get("select#topic").select("Vocabulary");
    cy.getDataTest("submit-button").click();

    cy.wait("@fetchCollection");
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
    cy.get("p#flashcardCounter").should("contain.text", "1/8");

    for (let i = 0; i < 3; i++) {
      cy.getDataTest("flashcard-next-button").click();
      cy.wait(600); // wait for animation
    }
    cy.get("p#flashcardCounter").should("contain.text", "4/8");

    for (let i = 0; i < 2; i++) {
      cy.getDataTest("flashcard-prev-button").click();
      cy.wait(600); // wait for animation
    }
    cy.get("p#flashcardCounter").should("contain.text", "2/8");

    for (let i = 0; i < 3; i++) {
      cy.getDataTest("flashcard-prev-button").click();
      cy.wait(600); // wait for animation
    }
    cy.get("p#flashcardCounter").should("contain.text", "7/8");
  });
});
