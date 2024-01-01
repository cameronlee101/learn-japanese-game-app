import { Chapters, Topics, ContentClass, isVocabContent, isKanjiContent, isSelectionValid, getExampleFullObject } from './utils';

test('isVocabContent function', () => {
  expect(isVocabContent({japanese:'テスト', english: 'test'})).toBe(true)
  expect(isVocabContent({japanese:'テスト', alternate: 'テスト', kanji:'テスト', english: 'test', example:'test'})).toBe(true)
  expect(isVocabContent({japanese:'テスト', english: 'test', garbage: 'garbage'})).toBe(true)

  expect(isVocabContent({japanese:'テスト'})).toBe(false)
  expect(isVocabContent({english: 'test'})).toBe(false)
  expect(isVocabContent({})).toBe(false)

  // Not technically correct, but function is not needed to be strict enough to check attribute types
  expect(isVocabContent({japanese: 1, english: 2})).toBe(true)
})

test('isKanjiContent function', () => {
  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト']})).toBe(true)
  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト'], garbage: 'garbage'})).toBe(true)

  expect(isKanjiContent({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test'})).toBe(false)
  expect(isKanjiContent({kanji: 'テスト', english: 'test'})).toBe(false)
  expect(isKanjiContent({})).toBe(false)

  // Not technically correct, but function is not needed to be strict enough to check attribute types
  expect(isKanjiContent({kanji: 1, readings: 2, english: 3, examples: 4})).toBe(true)
})

test('isSelectionValid function', () => {
  expect(isSelectionValid(Chapters.Ch1, Topics.Vocabulary)).toBe(true)
  expect(isSelectionValid(Chapters.Ch1, Topics.Numbers)).toBe(true)
  expect(isSelectionValid(Chapters.Ch2, Topics.Vocabulary)).toBe(true)
  expect(isSelectionValid(Chapters.Ch3, Topics.Kanji)).toBe(true)

  expect(isSelectionValid(Chapters.Ch1, Topics.Kanji)).toBe(false)
  expect(isSelectionValid(Chapters.Ch2, Topics.Kanji)).toBe(false)
  expect(isSelectionValid(Chapters.Ch3, Topics.Numbers)).toBe(false)
  expect(isSelectionValid('garbage', 'garbage')).toBe(false)
})

test('getExampleFullObject function', () => {
  // Should return object of VocabContent type
  expect(getExampleFullObject({japanese: 'テスト', english: 'test'})).toBeDefined()

  // Should return object of KanjiContent type
  expect(getExampleFullObject({kanji: 'テスト', readings: ['テスト', 'テスト'], english: 'test', examples: ['テスト', 'テスト']})).toBeDefined()

  // Should return undefined
  expect(getExampleFullObject({})).toBeUndefined()
})

test('ContentClass class', async () => {
  const data = await new ContentClass().getContent(Chapters.Ch1, Topics.Vocabulary)
  
  expect(data).toBeDefined()
})