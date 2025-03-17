import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

// Mock the API call
jest.mock('@/lib/api', () => ({
  fetchEpigrams: jest.fn().mockRejectedValue(new Error('API error')),
}));

describe('Home Page', () => {
  it('renders the main page with fallback data', async () => {
    render(<Page />)
    
    // Assert static elements that we know exist
    expect(screen.getByText('Latest Epigrams')).toBeInTheDocument()
    expect(screen.getByText('Wisdom from the world of programming')).toBeInTheDocument()
    
    // Wait for loading state to resolve and fallback data to appear
    expect(await screen.findByText('Failed to load epigrams. Using fallback data.')).toBeInTheDocument()
  })
})