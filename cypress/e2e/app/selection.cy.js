/// <reference types="cypress" />

describe("Activity selection page", () => {
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
  });

  it("select chapter 1 vocabulary as the topic", () => {
    cy.get("select#chapter").select("Chapter 1");
    cy.get("select#topic").select("Vocabulary");
    cy.getDataTest("submit-button").click();

    cy.wait("@fetchCollection");

    cy.getDataTest("error-text-box").should("not.exist");
  });

  it("select chapter 2 numbers as the topic", () => {
    cy.get("select#chapter").select("Chapter 2");
    cy.get("select#topic").select("Numbers");
    cy.getDataTest("submit-button").click();

    cy.wait("@fetchCollection");

    cy.getDataTest("error-text-box").should("not.exist");
  });

  it("select chapter 3 kanji as the topic", () => {
    cy.get("select#chapter").select("Chapter 3");
    cy.get("select#topic").select("Kanji");
    cy.getDataTest("submit-button").click();

    cy.wait("@fetchCollection");

    cy.getDataTest("error-text-box").should("not.exist");
  });

  it("opens and closes valid topics modal", () => {
    cy.getDataTest("modal-root").children().should("not.exist");
    cy.getDataTest("topic-status-modal").should("not.exist");

    cy.getDataTest("valid-topics-button").click();

    cy.getDataTest("modal-root").children().should("exist");
    cy.getDataTest("topic-status-modal").should("be.visible");

    cy.getDataTest("modal-close").click();

    cy.getDataTest("modal-root").children().should("not.exist");
    cy.getDataTest("topic-status-modal").should("not.exist");
  });

  it("error text box appears when trying to submit invalid selections", () => {
    cy.getDataTest("error-text-box").should("not.exist");

    cy.get("select#chapter").select("Chapter 1");
    cy.get("select#topic").select("Kanji");
    cy.getDataTest("submit-button").click();

    cy.getDataTest("error-text-box").should("be.visible");
    cy.contains(/error/i).should("exist");

    cy.getDataTest("error-text-box-close").click();

    cy.getDataTest("error-text-box").should("not.exist");
  });
});
