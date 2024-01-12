import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { getFlashcardBack, getFlashcardFront } from './Flashcard-utils'

beforeEach(() => {
  jest.spyOn(console, 'error')
  console.error.mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

test('getFlashcardFront function vocab 1', () => {
  const content = { japanese: 'テスト', english: 'test' }
  render(getFlashcardFront(content))

  expect(screen.getByText(`${content.japanese}`)).toBeInTheDocument()
})

test('getFlashcardFront function vocab 2', () => {
  const content = { japanese: 'テスト１', alternate: 'テスト２', english: 'test' }
  render(getFlashcardFront(content))

  expect(screen.getByText(`${content.japanese}/${content.alternate}`)).toBeInTheDocument()
})

test('getFlashcardFront function vocab 3', () => {
  const content = { japanese: 'テスト', kanji: '日本語', english: 'test' }
  render(getFlashcardFront(content))

  expect(screen.getByText(`${content.japanese} (${content.kanji})`)).toBeInTheDocument()
})

test('getFlashcardFront function vocab 4', () => {
  const content = { japanese: 'テスト１', alternate: 'テスト２', kanji: '日本語', english: 'test' }
  render(getFlashcardFront(content))

  expect(screen.getByText(`${content.japanese}/${content.alternate} (${content.kanji})`)).toBeInTheDocument()
})

test('getFlashcardFront function kanji 1', () => {
  const content = { kanji: '大', readings: ['だい', 'おお'], english: 'big', examples: ['大学生（だいがくせい）college student', '大きい（おおきい）big']}
  render(getFlashcardFront(content))

  expect(screen.getByText(`${content.kanji}`)).toBeInTheDocument()
})

test('getFlashcardFront function conjugation 1', () => {
  const content = {dictionary_hiragana: "いく", dictionary_kanji: "行く", english: "to go (destination に/へ)", conjugate_to: "present, affirmative", conjugation: "行きます"}
  render(getFlashcardFront(content))

  expect(screen.getByText(`${content.dictionary_kanji}`)).toBeInTheDocument()
  expect(screen.getByText(`${content.dictionary_hiragana}`)).toBeInTheDocument()
  expect(screen.getByText(`${content.conjugate_to}`)).toBeInTheDocument()
})

test('getFlashcardFront function error 1', () => {
  const content = { japanese: 'テスト' }
  render(getFlashcardFront(content))

  expect(screen.getByText('Error')).toBeInTheDocument()
})

test('getFlashcardBack function vocab 1', () => {
  const content = { japanese: 'テスト', english: 'test' }
  render(getFlashcardBack(content))

  expect(screen.getByText(`${content.english}`)).toBeInTheDocument()
})

test('getFlashcardBack function vocab 2', () => {
  const content = { japanese: 'テスト', english: 'test', example: 'testing' }
  render(getFlashcardBack(content))

  expect(screen.getByText(`${content.english}, ex. ${content.example}`)).toBeInTheDocument()
})

test('getFlashcardBack function kanji 1', () => {
  const content = { kanji: '大', readings: ['だい', 'おお'], english: 'big', examples: ['大学生（だいがくせい）college student', '大きい（おおきい）big']}
  render(getFlashcardBack(content))

  expect(screen.getByText(`Meaning:`)).toBeInTheDocument()
  expect(screen.getByText(`${content.english}`)).toBeInTheDocument()
  expect(screen.getByText(`Readings:`)).toBeInTheDocument()
  expect(screen.getByText(`${content.readings.join(', ')}`)).toBeInTheDocument()
  expect(screen.getByText(`Examples:`)).toBeInTheDocument()
  for (const example of content.examples) {
    expect(screen.getByText(`${example}`)).toBeInTheDocument()
  }
})

test('getFlashcardBack function conjugation 1', () => {
  const content = {dictionary_hiragana: "いく", dictionary_kanji: "行く", english: "to go (destination に/へ)", conjugate_to: "present, affirmative", conjugation: "行きます"}
  render(getFlashcardBack(content))

  expect(screen.getByText(`${content.conjugation}`)).toBeInTheDocument()
})

test('getFlashcardBack function error 1', () => {
  const content = { japanese: 'テスト' }
  render(getFlashcardBack(content))

  expect(screen.getByText('Error')).toBeInTheDocument()
})