import {
  ConjugationContent,
  Content,
  KanjiContent,
  VocabContent,
  isOrHasConjugationContent,
  isOrHasKanjiContent,
  isOrHasVocabContent,
} from "@/app/utils/content-utils";

export const getFlashcardFront = (contents: Content): React.JSX.Element => {
  if (isOrHasVocabContent(contents)) {
    const data = contents as VocabContent;

    return (
      <>
        {data.japanese}
        {data.alternate && "/" + data.alternate}{" "}
        {data.kanji && "(" + data.kanji + ")"}
      </>
    );
  } else if (isOrHasKanjiContent(contents)) {
    const data = contents as KanjiContent;

    return <>{data.kanji}</>;
  } else if (isOrHasConjugationContent(contents)) {
    const data = contents as ConjugationContent;

    return (
      <>
        <p>{data.dictionary_kanji}</p>
        <p>{data.dictionary_hiragana}</p>
        <p>{data.conjugate_to}</p>
      </>
    );
  } else {
    console.error(
      "Error: Unrecognized content type when retrieving flashcard front text.",
    );

    return <>{"Error"}</>;
  }
};

export const getFlashcardBack = (contents: Content): React.JSX.Element => {
  if (isOrHasVocabContent(contents)) {
    const data = contents as VocabContent;

    return (
      <>
        {data.english}
        {data.example && ", ex. " + data.example}
      </>
    );
  } else if (isOrHasKanjiContent(contents)) {
    const data = contents as KanjiContent;

    return (
      <>
        <p>
          <span className="font-semibold">Meaning:</span> {data.english}
        </p>
        <p>
          <span className="font-semibold">Readings:</span>{" "}
          {data.readings.join(", ")}
        </p>
        <p>
          <span className="font-semibold">Examples:</span>
          <br />
          {data.examples.map((example) => (
            <span key={example}>
              {example}
              <br />
            </span>
          ))}
        </p>
      </>
    );
  } else if (isOrHasConjugationContent(contents)) {
    const data = contents as ConjugationContent;

    return <>{data.conjugation}</>;
  } else {
    console.error(
      "Error: Unrecognized content type when retrieving flashcard back text.",
    );

    return <>{"Error"}</>;
  }
};
