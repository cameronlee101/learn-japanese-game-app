import {
  Chapters,
  Topics,
  ContentClass,
  isOrHasVocabContent,
  isOrHasKanjiContent,
  getFullExampleContentObject,
  isOrHasConjugationContent,
} from "./content-utils";

beforeEach(() => {
  jest.spyOn(console, "error");
  console.error.mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

test("isOrHasVocabContent function", () => {
  // minimum attributes needed to be true
  expect(isOrHasVocabContent({ japanese: "テスト", english: "test" })).toBe(
    true,
  );
  // all attributes of the type
  expect(
    isOrHasVocabContent({
      japanese: "テスト",
      alternate: "テスト",
      kanji: "テスト",
      english: "test",
      example: "test",
    }),
  ).toBe(true);

  // missing 1 attribute so returns false
  expect(isOrHasVocabContent({ japanese: "テスト" })).toBe(false);
  expect(isOrHasVocabContent({ english: "test" })).toBe(false);

  // empty, returns false
  expect(isOrHasVocabContent({})).toBe(false);

  // attributes wrong types, returns false
  expect(isOrHasVocabContent({ japanese: 1, english: 2 })).toBe(false);

  // too many attributes, returns false
  expect(
    isOrHasVocabContent({
      japanese: "テスト",
      english: "test",
      garbage: "garbage",
    }),
  ).toBe(false);
});

test("isOrHasKanjiContent function", () => {
  expect(
    isOrHasKanjiContent({
      kanji: "テスト",
      readings: ["テスト", "テスト"],
      english: "test",
      examples: ["テスト", "テスト"],
    }),
  ).toBe(true);

  // missing 1 attribute so returns false
  expect(
    isOrHasKanjiContent({
      readings: ["テスト", "テスト"],
      english: "test",
      examples: ["テスト", "テスト"],
    }),
  ).toBe(false);
  expect(
    isOrHasKanjiContent({
      kanji: "テスト",
      english: "test",
      examples: ["テスト", "テスト"],
    }),
  ).toBe(false);
  expect(
    isOrHasKanjiContent({
      kanji: "テスト",
      readings: ["テスト", "テスト"],
      examples: ["テスト", "テスト"],
    }),
  ).toBe(false);
  expect(
    isOrHasKanjiContent({
      kanji: "テスト",
      readings: ["テスト", "テスト"],
      english: "test",
    }),
  ).toBe(false);

  // empty, returns false
  expect(isOrHasKanjiContent({})).toBe(false);

  // attributes wrong types, returns false
  expect(
    isOrHasKanjiContent({ kanji: 1, readings: 2, english: 3, examples: 4 }),
  ).toBe(false);

  // too many attributes, returns false
  expect(
    isOrHasKanjiContent({
      kanji: "テスト",
      readings: ["テスト", "テスト"],
      english: "test",
      examples: ["テスト", "テスト"],
      garbage: "garbage",
    }),
  ).toBe(false);
});

test("isOrHasConjugationContent function", () => {
  // minimum attributes needed to be true
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: "テスト",
      english: "test",
      conjugate_to: "テスト",
      conjugation: "テスト",
    }),
  ).toBe(true);
  // all attributes of the type
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: "テスト",
      dictionary_kanji: "テスト",
      english: "test",
      conjugate_to: "テスト",
      conjugation: "テスト",
    }),
  ).toBe(true);

  // missing 1 attribute so returns false
  expect(
    isOrHasConjugationContent({
      english: "test",
      conjugate_to: "テスト",
      conjugation: "テスト",
    }),
  ).toBe(false);
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: "テスト",
      conjugate_to: "テスト",
      conjugation: "テスト",
    }),
  ).toBe(false);
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: "テスト",
      english: "test",
      conjugation: "テスト",
    }),
  ).toBe(false);
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: "テスト",
      english: "test",
      conjugate_to: "テスト",
    }),
  ).toBe(false);

  // empty, returns false
  expect(isOrHasConjugationContent({})).toBe(false);

  // attributes wrong types, returns false
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: 1,
      english: 2,
      conjugate_to: 3,
      conjugation: 4,
    }),
  ).toBe(false);

  // too many attributes, returns false
  expect(
    isOrHasConjugationContent({
      dictionary_hiragana: "テスト",
      dictionary_kanji: "テスト",
      english: "test",
      conjugate_to: "テスト",
      conjugation: "テスト",
      garbage: "garbage",
    }),
  ).toBe(false);
});

test("getExampleFullObject function", () => {
  // Should return object of VocabContent type
  expect(
    getFullExampleContentObject({ japanese: "テスト", english: "test" }),
  ).toBeDefined();

  // Should return object of KanjiContent type
  expect(
    getFullExampleContentObject({
      kanji: "テスト",
      readings: ["テスト", "テスト"],
      english: "test",
      examples: ["テスト", "テスト"],
    }),
  ).toBeDefined();

  // Should return object of ConjugationContent type
  expect(
    getFullExampleContentObject({
      dictionary_hiragana: "テスト",
      dictionary_kanji: "テスト",
      english: "test",
      conjugate_to: "テスト",
      conjugation: "テスト",
    }),
  ).toBeDefined();

  // Should return undefined
  expect(getFullExampleContentObject({})).toBeUndefined();
});

test("ContentClass class getContent method", async () => {
  const contentClass = new ContentClass();

  // Testing valid chapter, valid topic, valid combination of both
  const validData1 = await contentClass.getContent(
    Chapters.Ch1,
    Topics.Numbers,
  );
  const validData2 = await contentClass.getContent(
    Chapters.Ch2,
    Topics.Vocabulary,
  );
  const validData3 = await contentClass.getContent(Chapters.Ch3, Topics.Kanji);

  expect(validData1).toBeDefined();
  expect(validData2).toBeDefined();
  expect(validData3).toBeDefined();

  // Testing valid chapter, and valid topic, but not valid combination of both
  const invalidData1 = await contentClass.getContent(
    Chapters.Ch1,
    Topics.Kanji,
  );
  const invalidData2 = await contentClass.getContent(
    Chapters.Ch2,
    Topics.Conjugations,
  );
  const invalidData3 = await contentClass.getContent(
    Chapters.Ch3,
    Topics.Numbers,
  );

  expect(invalidData1).toBeUndefined();
  expect(invalidData2).toBeUndefined();
  expect(invalidData3).toBeUndefined();
});
