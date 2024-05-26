import {
	ConjugationContent,
	Content,
	KanjiContent,
	VocabContent,
} from "./types";

// Fetches the array of content for the specified chapter and topic from the database
export async function fetchContent(
	chapter: string,
	topic: string
): Promise<Content[]> {
	const chapterKey = chapter.toLowerCase().replaceAll(" ", "");
	const topicKey = topic.toLowerCase();

	const response = await fetch(
		"https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI"
	);

	if (!response.ok) {
		throw new Error("Failed to retrieve content from database");
	}

	const result = await response.json();

	const chapterContent = result.find((doc: any) => {
		if (doc[chapterKey] && doc[chapterKey][topicKey]) {
			return true;
		}
	});

	if (!chapterContent) {
		throw new Error(
			"Failed to retrieve content for specified chapter and topic"
		);
	} else {
		return chapterContent[chapterKey][topicKey];
	}
}

// Fetches the entire database collection
export async function fetchAllContent(): Promise<Object> {
	const response = await fetch(
		"https://us-east-2.aws.data.mongodb-api.com/app/data-tonat/endpoint/genkiI"
	);

	if (!response.ok) {
		throw new Error("Failed to retrieve content from database");
	}

	return await response.json();
}

// Function used to check if the given object is of type VocabContent or is an array with VocabContent
export function isOrHasVocabContent(obj: any): obj is VocabContent {
	if (Array.isArray(obj) && obj.length > 0) {
		return isOrHasVocabContent(obj[0]);
	} else if (Array.isArray(obj) && obj.length == 0) {
		return false;
	} else {
		const { japanese, english, alternate, kanji, example, ...rest } = obj;

		// Return false if the object has any extra attributes
		if (Object.keys(rest).length > 0) {
			return false;
		}

		return (
			typeof japanese === "string" &&
			typeof english === "string" &&
			(alternate === undefined || typeof alternate === "string") &&
			(kanji === undefined || typeof kanji === "string") &&
			(example === undefined || typeof example === "string")
		);
	}
}
// Function used to check if the given object is of type KanjiContent or is an array with KanjiContent
export function isOrHasKanjiContent(obj: any): obj is KanjiContent {
	if (Array.isArray(obj) && obj.length > 0) {
		return isOrHasKanjiContent(obj[0]);
	} else if (Array.isArray(obj) && obj.length == 0) {
		return false;
	} else {
		const { kanji, readings, english, examples, ...rest } = obj;

		// Return false if the object has any extra attributes
		if (Object.keys(rest).length > 0) {
			return false;
		}

		return (
			typeof kanji === "string" &&
			Array.isArray(readings) &&
			readings.every((reading: any) => typeof reading === "string") &&
			typeof english === "string" &&
			Array.isArray(examples) &&
			examples.every((example: any) => typeof example === "string")
		);
	}
}
// Function used to check if the given object is of type ConjugationContent or is an array with ConjugationContent
export function isOrHasConjugationContent(obj: any): obj is ConjugationContent {
	if (Array.isArray(obj) && obj.length > 0) {
		return isOrHasConjugationContent(obj[0]);
	} else if (Array.isArray(obj) && obj.length === 0) {
		return false;
	} else {
		const {
			dictionary_hiragana,
			dictionary_kanji,
			english,
			conjugate_to,
			conjugation,
			...rest
		} = obj;

		// Return false if the object has any extra attributes
		if (Object.keys(rest).length > 0) {
			return false;
		}

		return (
			typeof dictionary_hiragana === "string" &&
			(dictionary_kanji === undefined ||
				typeof dictionary_kanji === "string") &&
			typeof english === "string" &&
			typeof conjugate_to === "string" &&
			typeof conjugation === "string"
		);
	}
}

// Function used to return an object of the same type as passed in argument that has values for all parameters
// Returned object used to see all types contained in an interface
export function getFullExampleContentObject(obj: any): undefined | Content {
	if (isOrHasVocabContent(obj)) {
		return {
			japanese: "a",
			alternate: "a",
			kanji: "a",
			english: "a",
			example: "a",
		};
	} else if (isOrHasKanjiContent(obj)) {
		return {
			kanji: "a",
			readings: ["a"],
			english: "a",
			examples: ["a"],
		};
	} else if (isOrHasConjugationContent(obj)) {
		return {
			dictionary_hiragana: "a",
			dictionary_kanji: "a",
			english: "a",
			conjugate_to: "a",
			conjugation: "a",
		};
	} else {
		console.error("Error: could not retrieve full example content object");
		return undefined;
	}
}
