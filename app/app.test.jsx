import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home', () => {
  it('has a main element', () => {
    render(<Home/>)

    const main = screen.getByRole('main')

    expect(main).toBeInTheDocument()
  })

  it('has the header "Welcome to the website"', () => {
    render(<Home/>)

    const heading = screen.getByRole('heading')

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Welcome to the website')
  })
})
