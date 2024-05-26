import {
	isOrHasConjugationContent,
	isOrHasKanjiContent,
	isOrHasVocabContent,
} from "@/utils/helper-fns";
import {
	VocabContent,
	KanjiContent,
	ConjugationContent,
	Content,
} from "@/utils/types";

export const getMCQuestionString = (content: Content): string => {
	if (isOrHasVocabContent(content)) {
		return (content as VocabContent).japanese;
	} else if (isOrHasKanjiContent(content)) {
		return (content as KanjiContent).kanji;
	} else if (isOrHasConjugationContent(content)) {
		return (
			(content as ConjugationContent).dictionary_kanji +
			"\n" +
			(content as ConjugationContent).dictionary_hiragana +
			"\n" +
			(content as ConjugationContent).conjugate_to
		);
	} else {
		console.error(
			"Error: Unrecognized content type when retrieving multiple choice quiz question text."
		);

		return "Error";
	}
};

export const getMCOptionString = (content: Content): string => {
	if (isOrHasVocabContent(content)) {
		return (content as VocabContent).english;
	} else if (isOrHasKanjiContent(content)) {
		return (content as KanjiContent).english;
	} else if (isOrHasConjugationContent(content)) {
		return (content as ConjugationContent).conjugation;
	} else {
		console.error(
			"Error: Unrecognized content type when retrieving multiple choice quiz option text."
		);

		return "Error";
	}
};

export const getMCQuestion = (content: Content): JSX.Element => {
	if (isOrHasVocabContent(content)) {
		return <>{(content as VocabContent).japanese}</>;
	} else if (isOrHasKanjiContent(content)) {
		return <>{(content as KanjiContent).kanji}</>;
	} else if (isOrHasConjugationContent(content)) {
		return (
			<>
				<p>{(content as ConjugationContent).dictionary_kanji}</p>
				<p>{(content as ConjugationContent).dictionary_hiragana}</p>
				<p>{(content as ConjugationContent).conjugate_to}</p>
			</>
		);
	} else {
		console.error(
			"Error: Unrecognized content type when retrieving multiple choice quiz question text."
		);

		return <>{"Error"}</>;
	}
};

export const getMCOption = (content: Content): JSX.Element => {
	if (isOrHasVocabContent(content)) {
		return <>{(content as VocabContent).english}</>;
	} else if (isOrHasKanjiContent(content)) {
		return <>{(content as KanjiContent).english}</>;
	} else if (isOrHasConjugationContent(content)) {
		return <>{(content as ConjugationContent).conjugation}</>;
	} else {
		console.error(
			"Error: Unrecognized content type when retrieving multiple choice quiz option text."
		);

		return <>{"Error"}</>;
	}
};
