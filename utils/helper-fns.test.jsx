import {
	isOrHasVocabContent,
	isOrHasKanjiContent,
	getFullExampleContentObject,
	isOrHasConjugationContent,
	fetchContent,
	fetchAllContent,
} from "./helper-fns";
import { Chapters, Topics } from "./types";
import mockCollection from "./mockCollection.json";

beforeEach(() => {
	// Stopping the console.error from printing to console during tests
	jest.spyOn(console, "error");
	console.error.mockImplementation(() => {});

	// Mocking the fetch function
	global.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(mockCollection),
		})
	);
});

afterEach(() => {
	console.error.mockRestore();
});

// TODO: test using arrays with object
describe("isOrHasVocabContent function", () => {
	test("returns true when minimum attributes needed are present", () => {
		expect(isOrHasVocabContent({ japanese: "テスト", english: "test" })).toBe(
			true
		);

		expect(
			isOrHasVocabContent({
				japanese: "テスト",
				alternate: "テスト",
				kanji: "テスト",
				english: "test",
				example: "test",
			})
		).toBe(true);
	});

	test("returns false when 1 attribute is missing", () => {
		expect(isOrHasVocabContent({ japanese: "テスト" })).toBe(false);
		expect(isOrHasVocabContent({ english: "test" })).toBe(false);
	});

	test("returns false when attributes are empty", () => {
		expect(isOrHasVocabContent({})).toBe(false);
	});

	test("returns false when attribute types are wrong", () => {
		expect(isOrHasVocabContent({ japanese: 1, english: 2 })).toBe(false);
	});

	test("returns false when there are too many attributes", () => {
		expect(
			isOrHasVocabContent({
				japanese: "テスト",
				english: "test",
				garbage: "garbage",
			})
		).toBe(false);
	});
});

describe("isOrHasKanjiContent function", () => {
	test("returns true when minimum attributes needed are present", () => {
		expect(
			isOrHasKanjiContent({
				kanji: "テスト",
				readings: ["テスト", "テスト"],
				english: "test",
				examples: ["テスト", "テスト"],
			})
		).toBe(true);
	});

	test("returns false when 1 attribute is missing", () => {
		expect(
			isOrHasKanjiContent({
				readings: ["テスト", "テスト"],
				english: "test",
				examples: ["テスト", "テスト"],
			})
		).toBe(false);
		expect(
			isOrHasKanjiContent({
				kanji: "テスト",
				english: "test",
				examples: ["テスト", "テスト"],
			})
		).toBe(false);
		expect(
			isOrHasKanjiContent({
				kanji: "テスト",
				readings: ["テスト", "テスト"],
				examples: ["テスト", "テスト"],
			})
		).toBe(false);
		expect(
			isOrHasKanjiContent({
				kanji: "テスト",
				readings: ["テスト", "テスト"],
				english: "test",
			})
		).toBe(false);
	});

	test("returns false when attributes are empty", () => {
		expect(isOrHasKanjiContent({})).toBe(false);
	});

	test("returns false when attribute types are wrong", () => {
		expect(
			isOrHasKanjiContent({ kanji: 1, readings: 2, english: 3, examples: 4 })
		).toBe(false);
	});

	test("returns false when there are too many attributes", () => {
		expect(
			isOrHasKanjiContent({
				kanji: "テスト",
				readings: ["テスト", "テスト"],
				english: "test",
				examples: ["テスト", "テスト"],
				garbage: "garbage",
			})
		).toBe(false);
	});
});

describe("isOrHasConjugationContent function", () => {
	test("returns true when minimum attributes needed are present", () => {
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: "テスト",
				english: "test",
				conjugate_to: "テスト",
				conjugation: "テスト",
			})
		).toBe(true);
	});

	test("returns true when all attributes of the type are present", () => {
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: "テスト",
				dictionary_kanji: "テスト",
				english: "test",
				conjugate_to: "テスト",
				conjugation: "テスト",
			})
		).toBe(true);
	});

	test("returns false when 1 attribute is missing", () => {
		expect(
			isOrHasConjugationContent({
				english: "test",
				conjugate_to: "テスト",
				conjugation: "テスト",
			})
		).toBe(false);
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: "テスト",
				conjugate_to: "テスト",
				conjugation: "テスト",
			})
		).toBe(false);
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: "テスト",
				english: "test",
				conjugation: "テスト",
			})
		).toBe(false);
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: "テスト",
				english: "test",
				conjugate_to: "テスト",
			})
		).toBe(false);
	});

	test("returns false when attributes are empty", () => {
		expect(isOrHasConjugationContent({})).toBe(false);
	});

	test("returns false when attribute types are wrong", () => {
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: 1,
				english: 2,
				conjugate_to: 3,
				conjugation: 4,
			})
		).toBe(false);
	});

	test("returns false when there are too many attributes", () => {
		expect(
			isOrHasConjugationContent({
				dictionary_hiragana: "テスト",
				dictionary_kanji: "テスト",
				english: "test",
				conjugate_to: "テスト",
				conjugation: "テスト",
				garbage: "garbage",
			})
		).toBe(false);
	});
});

describe("getExampleFullObject function", () => {
	test("Should return object of VocabContent type", () => {
		expect(
			isOrHasVocabContent(
				getFullExampleContentObject({ japanese: "テスト", english: "test" })
			)
		).toBe(true);
	});

	test("Should return object of KanjiContent type", () => {
		expect(
			isOrHasKanjiContent(
				getFullExampleContentObject({
					kanji: "テスト",
					readings: ["テスト", "テスト"],
					english: "test",
					examples: ["テスト", "テスト"],
				})
			)
		).toBe(true);
	});

	test("Should return object of ConjugationContent type", () => {
		expect(
			isOrHasConjugationContent(
				getFullExampleContentObject({
					dictionary_hiragana: "テスト",
					dictionary_kanji: "テスト",
					english: "test",
					conjugate_to: "テスト",
					conjugation: "テスト",
				})
			)
		).toBe(true);
	});

	test("Should return undefined", () => {
		expect(getFullExampleContentObject({})).toBeUndefined();
	});
});

describe("fetchContent function", () => {
	it("should fetch chapter 1 vocabulary successfully", async () => {
		const result = await fetchContent(Chapters.Ch1, Topics.Vocabulary);

		expect(fetch).toHaveBeenCalledWith(
			"https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI"
		);

		expect(result).toEqual(mockCollection[0].chapter1.vocabulary);
	});

	it("should fetch chapter 2 numbers successfully", async () => {
		const result = await fetchContent(Chapters.Ch2, Topics.Numbers);

		expect(fetch).toHaveBeenCalledWith(
			"https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI"
		);

		expect(result).toEqual(mockCollection[0].chapter2.numbers);
	});

	it("should fetch chapter 3 kanji successfully", async () => {
		const result = await fetchContent(Chapters.Ch3, Topics.Kanji);

		expect(fetch).toHaveBeenCalledWith(
			"https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI"
		);

		expect(result).toEqual(mockCollection[0].chapter3.kanji);
	});

	it("should throw an error if fetch fails", async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
			})
		);

		try {
			await fetchContent(Chapters.Ch1, Topics.Vocabulary);
		} catch (error) {
			expect(error.message).toBe("Failed to retrieve content from database");
		}
	});
});

describe("fetchAllContent function", () => {
	it("should fetch content successfully", async () => {
		const result = await fetchAllContent();

		expect(fetch).toHaveBeenCalledWith(
			"https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI"
		);

		expect(result).toEqual(mockCollection);
	});

	it("should throw an error if fetch fails", async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: false,
			})
		);

		try {
			await fetchAllContent();
		} catch (error) {
			expect(error.message).toBe("Failed to retrieve content from database");
		}
	});
});
