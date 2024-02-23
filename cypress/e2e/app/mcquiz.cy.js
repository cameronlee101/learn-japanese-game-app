/// <reference types="cypress" />

describe("Multiple choice quiz activity", () => {
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
    cy.get("a").contains("M.C. Quiz").click();

    cy.wait("@fetchCollection");

    cy.get("select#chapter").select("Chapter 1");
    cy.get("select#topic").select("Vocabulary");
    cy.getDataTest("submit-button").click();

    cy.wait("@fetchCollection");
  });

  // TODO: figure out how to make test deterministic
  it("press all 4 options", () => {
    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click();
      cy.wait(1);
    }
  });

  it("progress indicator correctly tracks ", () => {
    cy.getDataTest("progress-indicator").should("contain.text", "0/8");

    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click();
      cy.wait(1);
    }

    cy.getDataTest("progress-indicator").should("contain.text", "1/8");

    for (let i = 0; i < 4; i++) {
      cy.getDataTest(`mc-option-${i}`).click();
      cy.wait(1);
    }

    cy.getDataTest("progress-indicator").should("contain.text", "2/8");
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
