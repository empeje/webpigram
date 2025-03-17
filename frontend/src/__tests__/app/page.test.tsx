import { render, screen } from '@testing-library/react'
import Page from '@/app/page'
import { fetchEpigrams } from '@/lib/api'

// Mock the API call
jest.mock('@/lib/api', () => ({
  fetchEpigrams: jest.fn(),
}));

// Mock console.error to avoid test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('Home Page', () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  it('renders the main page with fallback data', async () => {
    // Setup the mock to reject
    (fetchEpigrams as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    render(<Page />)
    
    // Assert static elements that we know exist
    expect(screen.getByText('Latest Epigrams')).toBeInTheDocument()
    expect(screen.getByText('Wisdom from the world of programming')).toBeInTheDocument()
    
    // Wait for loading state to resolve and fallback data to appear
    expect(await screen.findByText('Failed to load epigrams. Using fallback data.')).toBeInTheDocument()
  })
})