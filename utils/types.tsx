export enum Chapters {
	Ch1 = "Chapter 1",
	Ch2 = "Chapter 2",
	Ch3 = "Chapter 3",
	Ch4 = "Chapter 4",
	Ch5 = "Chapter 5",
	Ch6 = "Chapter 6",
	Ch7 = "Chapter 7",
	Ch8 = "Chapter 8",
	Ch9 = "Chapter 9",
	Ch10 = "Chapter 10",
	Ch11 = "Chapter 11",
	Ch12 = "Chapter 12",
}

export enum Topics {
	Vocabulary = "Vocabulary",
	Kanji = "Kanji",
	Numbers = "Numbers",
	Conjugations = "Conjugations",
}

export type VocabContent = {
	japanese: string;
	alternate?: string;
	kanji?: string;
	english: string;
	example?: string;
	[key: string]: string | undefined;
};

export type KanjiContent = {
	kanji: string;
	readings: string[];
	english: string;
	examples: string[];
	[key: string]: string | string[];
};

export type ConjugationContent = {
	dictionary_hiragana: string;
	dictionary_kanji?: string;
	english: string;
	conjugate_to: string;
	conjugation: string;
	[key: string]: string | undefined;
};

export type Content = VocabContent | KanjiContent | ConjugationContent;

export type Side = "front" | "back";

export type IndexAndSide = { index: number; side: Side };
