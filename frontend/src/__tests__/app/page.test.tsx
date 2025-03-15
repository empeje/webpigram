import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

describe('Home Page', () => {
  it('renders the main page', () => {
    render(<Page />)
    
    // Test for the "Get started" text that exists in the default template
    const startedText = screen.getByText(/Get started by editing/i)
    expect(startedText).toBeInTheDocument()
    
    // Test for the Next.js logo
    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })
})