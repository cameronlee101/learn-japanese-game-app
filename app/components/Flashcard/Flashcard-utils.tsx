import { ConjugationContent, Content, KanjiContent, VocabContent, isConjugationContent, isKanjiContent, isVocabContent } from '@/app/utils/content-utils';

export const getFlashcardFront = (contents:Content):React.JSX.Element => {
  if (isVocabContent(contents)) {
    const data = contents as VocabContent

    return (<>
      {data.japanese}{data.alternate && ('/' + data.alternate)} {data.kanji && ('(' + data.kanji + ')')}
    </>)
  }
  else if (isKanjiContent(contents)) {
    const data = contents as KanjiContent

    return (<>
      {data.kanji}
    </>)
  }
  else if (isConjugationContent(contents)) {
    const data = contents as ConjugationContent

    return (<>
      <p>{data.dictionary_kanji}</p>
      <p>{data.dictionary_hiragana}</p>
      <p>{data.conjugate_to}</p>
    </>)
  }
  else {
    alert('Error displaying flashcard contents, please return to home.')
    console.error('Error: Unrecognized content type when retrieving flashcard front text.')

    return (<>
      {'Error'}
    </>)
  }
}

export const getFlashcardBack = (contents:Content):React.JSX.Element => {
  if (isVocabContent(contents)) {
    const data = contents as VocabContent

    return (<>
      {data.english}{data.example && (', ex. ' + data.example)}
    </>)
  }
  else if (isKanjiContent(contents)) {
    const data = contents as KanjiContent

    return (<>
      <div>
        <span className='font-semibold'>Meaning</span>: {data.english}
      </div>
      <div>
        <span className='font-semibold'>Readings</span>: {data.readings.join(', ')}
      </div>
      <div>
        <span className='font-semibold'>Examples</span>: <br/>
        {data.examples.map((example) => (
          <span key={example}>{example}<br/></span>
        ))}
      </div>
    </>)
  }
  else if (isConjugationContent(contents)) {
    const data = contents as ConjugationContent

    return (<>
      {data.conjugation}
    </>)
  }
  else {
    alert('Error displaying flashcard contents, please return to home.')
    console.error('Error: Unrecognized content type when retrieving flashcard back text.')  

    return (<>
      {'Error'}
    </>)
  }
}