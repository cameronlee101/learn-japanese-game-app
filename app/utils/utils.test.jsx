import { Chapters, Topics, ContentClass, isVocabContent, isKanjiContent, isSelectionValid, getExampleFullObject, isConjugationContent } from './utils';

test('isVocabContent function', () => {
  // minimum attributes needed to be true
  expect(isVocabContent({japanese:'テスト', english: 'test'})).toBe(true) 
  // all attributes of the type
  expect(isVocabContent({japanese:'テスト', alternate: 'テスト', kanji:'テスト', english: 'test', example:'test'})).toBe(true)

  // missing 1 attribute so returns false
  expect(isVocabContent({japanese:'テスト'})).toBe(false)
  expect(isVocabContent({english: 'test'})).toBe(false)

  // empty, returns false
  expect(isVocabContent({})).toBe(false)

  // Not technically correct, but function is not needed to be strict enough to check attribute types
  expect(isVocabContent({japanese: 1, english: 2})).toBe(true)

  // Not technically correct, but function only checks it has the minimum attribute to be tgat type
  expect(isVocabContent({japanese:'テスト', english: 'test', garbage: 'garbage'})).toBe(true)
})

test('isKanjiContent function', () => {
  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト']})).toBe(true)

  // missing 1 attribute so returns false
  expect(isKanjiContent({readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト']})).toBe(false)
  expect(isKanjiContent({kanji: 'テスト', english: 'test', examples: ['テスト', 'テスト']})).toBe(false)
  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], examples: ['テスト', 'テスト']})).toBe(false)
  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test'})).toBe(false)
  
  // empty, returns false
  expect(isKanjiContent({})).toBe(false)

  // Not technically correct, but function is not needed to be strict enough to check attribute types
  expect(isKanjiContent({kanji: 1, readings: 2, english: 3, examples: 4})).toBe(true)

  // Not technically correct, but function only checks it has the minimum attribute to be tgat type
  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト'], garbage: 'garbage'})).toBe(true)
})

test('isConjugationContent function', () => {
  // minimum attributes needed to be true
  expect(isConjugationContent({dictionary_hiragana: 'テスト', english: 'test', conjugate_to: 'テスト', conjugation: 'テスト'})).toBe(true) 
  // all attributes of the type
  expect(isConjugationContent({dictionary_hiragana: 'テスト', dictionary_kanji: 'テスト', english: 'test', conjugate_to: 'テスト', conjugation: 'テスト'})).toBe(true) 

  // missing 1 attribute so returns false
  expect(isConjugationContent({english: 'test', conjugate_to: 'テスト', conjugation: 'テスト',})).toBe(false)
  expect(isConjugationContent({dictionary_hiragana: 'テスト', conjugate_to: 'テスト', conjugation: 'テスト'})).toBe(false)
  expect(isConjugationContent({dictionary_hiragana: 'テスト', english: 'test', conjugation: 'テスト'})).toBe(false)
  expect(isConjugationContent({dictionary_hiragana: 'テスト', english: 'test', conjugate_to: 'テスト'})).toBe(false)

  // empty, returns false
  expect(isConjugationContent({})).toBe(false)

  // Not technically correct, but function is not needed to be strict enough to check attribute types
  expect(isConjugationContent({dictionary_hiragana: 1, english: 2, conjugate_to: 3, conjugation: 4})).toBe(true)

  // Not technically correct, but function only checks it has the minimum attribute to be tgat type
  expect(isConjugationContent({dictionary_hiragana: 'テスト', dictionary_kanji: 'テスト', english: 'test', conjugate_to: 'テスト', conjugation: 'テスト', garbage: 'garbage'})).toBe(true)
})

test('isSelectionValid function', () => {
  // All possible true inputs
  expect(isSelectionValid(Chapters.Ch1, Topics.Vocabulary)).toBe(true)
  expect(isSelectionValid(Chapters.Ch1, Topics.Numbers)).toBe(true)
  expect(isSelectionValid(Chapters.Ch2, Topics.Vocabulary)).toBe(true)
  expect(isSelectionValid(Chapters.Ch3, Topics.Vocabulary)).toBe(true)
  expect(isSelectionValid(Chapters.Ch3, Topics.Kanji)).toBe(true)
  expect(isSelectionValid(Chapters.Ch3, Topics.Conjugations)).toBe(true)

  // 1 false input for each chapter
  expect(isSelectionValid(Chapters.Ch1, Topics.Kanji)).toBe(false)
  expect(isSelectionValid(Chapters.Ch2, Topics.Kanji)).toBe(false)
  expect(isSelectionValid(Chapters.Ch3, Topics.Numbers)).toBe(false)

  // garbage values, return false
  expect(isSelectionValid('garbage', 'garbage')).toBe(false)
})

test('getExampleFullObject function', () => {
  // Should return object of VocabContent type
  expect(getExampleFullObject({japanese: 'テスト', english: 'test'})).toBeDefined()

  // Should return object of KanjiContent type
  expect(getExampleFullObject({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト']})).toBeDefined()

  // Should return object of ConjugationContent type
  expect(getExampleFullObject({dictionary_hiragana: 'テスト', dictionary_kanji: 'テスト', english: 'test', conjugate_to: 'テスト', conjugation: 'テスト',})).toBeDefined()

  // Should return undefined
  expect(getExampleFullObject({})).toBeUndefined()
})

// TODO: expand test case
test('ContentClass class getContent method', async () => {
  const data = await new ContentClass().getContent(Chapters.Ch1, Topics.Vocabulary)
  
  expect(data).toBeDefined()
})