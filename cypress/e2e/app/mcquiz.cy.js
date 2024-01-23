/// <reference types="cypress" />

describe("Multiple choice quiz activity", () => {
  beforeEach(() => {
    // Start from chapter 1 multiple choice quiz page
    cy.visit("/");
    cy.getDataTest("sidemenu-button").click();
    cy.get("a").contains("M.C. Quiz").click();

    cy.get("select#chapter").select("Chapter 1");
    cy.get("select#topic").select("Vocabulary");
    cy.getDataTest("submit-button").click();
    cy.wait(1000); // wait for server
  });

  // TODO: figure out how to make test deterministic
  it("press all 4 options", () => {
    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click();
      cy.wait(1);
    }
  });

  it("progress indicator correctly tracks ", () => {
    cy.getDataTest("progress-indicator").should("contain.text", "0/77"); // Checking there is 77 questions for chapter 1 vocabulary

    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click();
      cy.wait(1);
    }

    cy.getDataTest("progress-indicator").should("contain.text", "1/77");

    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click();
      cy.wait(1);
    }

    cy.getDataTest("progress-indicator").should("contain.text", "2/77");
  });

  it("check or x symbol correctly displays, then fades away", () => {
    cy.getDataTest("check-or-x").should("exist");
    cy.getDataTest("check-or-x").should("not.be.visible");

    cy.getDataTest(`mc-option-${0}`).click();
    cy.getDataTest("check-or-x").should("be.visible");

    cy.wait(200);

    cy.getDataTest("check-or-x").should("not.be.visible");
  });
});
