import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { getMCQuestionString } from './MCQuiz-utils'

beforeEach(() => {
  jest.spyOn(console, 'error')
  console.error.mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

test('getMCQuestionString function vocab 1', () => {
  const content = { japanese: 'テスト', english: 'test' }
  render(getMCQuestionString(content))

  expect(screen.getByText(`${content.japanese}`)).toBeInTheDocument()
})