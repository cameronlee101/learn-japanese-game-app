import {
	isOrHasConjugationContent,
	isOrHasKanjiContent,
	isOrHasVocabContent,
} from "@/utils/helper-fns";
import { Content, Side } from "@/utils/types";

// TODO: make the strings that are returned more thorough
export const getText = (content: Content, side: Side): string => {
	if (isOrHasVocabContent(content)) {
		return side == "front" ? content.japanese : content.english;
	} else if (isOrHasKanjiContent(content)) {
		return side == "front" ? content.kanji : content.english;
	} else if (isOrHasConjugationContent(content)) {
		return side == "front"
			? `${content.dictionary_hiragana}\n${content.conjugate_to}`
			: content.conjugation;
	} else {
		console.error(
			"Error: Unrecognized content type when retrieving multiple choice quiz question text."
		);

		return "Error";
	}
};
