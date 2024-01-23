import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import {
  getMCQuestion,
  getMCOption,
  getMCQuestionString,
  getMCOptionString,
} from "./MCQuiz-utils";

beforeEach(() => {
  jest.spyOn(console, "error");
  console.error.mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

// getMCQuestionString
test("getMCQuestionString function vocab 1", () => {
  const content = { japanese: "テスト", english: "test" };

  expect(getMCQuestionString(content)).toEqual(`${content.japanese}`);
});

test("getMCQuestionString function kanji 1", () => {
  const content = {
    kanji: "大",
    readings: ["だい", "おお"],
    english: "big",
    examples: [
      "大学生（だいがくせい）college student",
      "大きい（おおきい）big",
    ],
  };

  expect(getMCQuestionString(content)).toEqual(`${content.kanji}`);
});

test("getMCQuestionString function conjugation 1", () => {
  const content = {
    dictionary_hiragana: "いく",
    dictionary_kanji: "行く",
    english: "to go (destination に/へ)",
    conjugate_to: "present, affirmative",
    conjugation: "行きます",
  };

  expect(getMCQuestionString(content)).toEqual(
    `${content.dictionary_kanji}\n${content.dictionary_hiragana}\n${content.conjugate_to}`,
  );
});

test("getMCQuestionString function error 1", () => {
  const content = { japanese: "テスト" };

  expect(getMCQuestionString(content)).toEqual(`Error`);
});

// getMCOptionString
test("getMCOptionString function vocab 1", () => {
  const content = { japanese: "テスト", english: "test" };

  expect(getMCOptionString(content)).toEqual(`${content.english}`);
});

test("getMCOptionString function kanji 1", () => {
  const content = {
    kanji: "大",
    readings: ["だい", "おお"],
    english: "big",
    examples: [
      "大学生（だいがくせい）college student",
      "大きい（おおきい）big",
    ],
  };

  expect(getMCOptionString(content)).toEqual(`${content.english}`);
});

test("getMCOptionString function conjugation 1", () => {
  const content = {
    dictionary_hiragana: "いく",
    dictionary_kanji: "行く",
    english: "to go (destination に/へ)",
    conjugate_to: "present, affirmative",
    conjugation: "行きます",
  };

  expect(getMCOptionString(content)).toEqual(`${content.conjugation}`);
});

test("getMCQuestionString function error 1", () => {
  const content = { japanese: "テスト" };

  expect(getMCOptionString(content)).toEqual(`Error`);
});

// getMCQuestion
test("getMCQuestion function vocab 1", () => {
  const content = { japanese: "テスト", english: "test" };
  render(getMCQuestion(content));

  expect(screen.getByText(`${content.japanese}`)).toBeInTheDocument();
});

test("getMCQuestion function kanji 1", () => {
  const content = {
    kanji: "大",
    readings: ["だい", "おお"],
    english: "big",
    examples: [
      "大学生（だいがくせい）college student",
      "大きい（おおきい）big",
    ],
  };
  render(getMCQuestion(content));

  expect(screen.getByText(`${content.kanji}`)).toBeInTheDocument();
});

test("getMCQuestion function conjugation 1", () => {
  const content = {
    dictionary_hiragana: "いく",
    dictionary_kanji: "行く",
    english: "to go (destination に/へ)",
    conjugate_to: "present, affirmative",
    conjugation: "行きます",
  };
  render(getMCQuestion(content));

  expect(screen.getByText(`${content.dictionary_kanji}`)).toBeInTheDocument();
  expect(
    screen.getByText(`${content.dictionary_hiragana}`),
  ).toBeInTheDocument();
  expect(screen.getByText(`${content.conjugate_to}`)).toBeInTheDocument();
});

test("getMCQuestionString function error 1", () => {
  const content = { japanese: "テスト" };
  render(getMCQuestion(content));

  expect(screen.getByText(`Error`)).toBeInTheDocument();
});

// getMCOption
test("getMCOption function vocab 1", () => {
  const content = { japanese: "テスト", english: "test" };
  render(getMCOption(content));

  expect(screen.getByText(`${content.english}`)).toBeInTheDocument();
});

test("getMCOption function kanji 1", () => {
  const content = {
    kanji: "大",
    readings: ["だい", "おお"],
    english: "big",
    examples: [
      "大学生（だいがくせい）college student",
      "大きい（おおきい）big",
    ],
  };
  render(getMCOption(content));

  expect(screen.getByText(`${content.english}`)).toBeInTheDocument();
});

test("getMCOption function conjugation 1", () => {
  const content = {
    dictionary_hiragana: "いく",
    dictionary_kanji: "行く",
    english: "to go (destination に/へ)",
    conjugate_to: "present, affirmative",
    conjugation: "行きます",
  };
  render(getMCOption(content));

  expect(screen.getByText(`${content.conjugation}`)).toBeInTheDocument();
});

test("getMCQuestionString function error 1", () => {
  const content = { japanese: "テスト" };
  render(getMCOption(content));

  expect(screen.getByText(`Error`)).toBeInTheDocument();
});
