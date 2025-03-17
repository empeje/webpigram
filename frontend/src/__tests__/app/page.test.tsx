import { render, screen, waitFor } from '@testing-library/react';
import Page from '@/app/page';
import { EpigramProvider } from '@/contexts/EpigramContext';

// Mock the useEpigramData hook
jest.mock('@/hooks/useEpigramData', () => {
  const mockUseEpigramData = jest.fn();

  // Default implementation for error case
  mockUseEpigramData.mockReturnValue({
    epigrams: [],
    setEpigrams: jest.fn(),
    loading: false,
    error: 'Failed to load epigrams. Using fallback data.',
    hasMore: false,
    loadMoreEpigrams: jest.fn(),
  });

  return { useEpigramData: mockUseEpigramData };
});

// Mock console.error to avoid test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Import the actual mock to manipulate it in tests
import { useEpigramData } from '@/hooks/useEpigramData';

describe('Home Page', () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  it('renders the main page with error message', async () => {
    // Setup mock for error case
    (useEpigramData as jest.Mock).mockReturnValue({
      epigrams: [],
      setEpigrams: jest.fn(),
      loading: false,
      error: 'Failed to load epigrams. Using fallback data.',
      hasMore: false,
      loadMoreEpigrams: jest.fn(),
    });

    render(
      <EpigramProvider>
        <Page />
      </EpigramProvider>
    );

    // Assert static elements that we know exist
    expect(screen.getByText('Latest Epigrams')).toBeInTheDocument();
    expect(screen.getByText('Wisdom from the world of programming')).toBeInTheDocument();

    // Check for the error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load epigrams. Using fallback data.')).toBeInTheDocument();
    });
  });

  it('renders the main page with epigrams', async () => {
    // Setup mock for success case
    const mockEpigrams = [
      {
        id: '1',
        content: 'Test epigram 1',
        author: 'Test Author',
        upvotes: 10,
        downvotes: 2,
        createdAt: '2023-01-01',
        topics: ['testing'],
      },
      {
        id: '2',
        content: 'Test epigram 2',
        author: 'Another Author',
        upvotes: 5,
        downvotes: 1,
        createdAt: '2023-01-02',
        topics: ['jest'],
      },
    ];

    (useEpigramData as jest.Mock).mockReturnValue({
      epigrams: mockEpigrams,
      setEpigrams: jest.fn(),
      loading: false,
      error: null,
      hasMore: true,
      loadMoreEpigrams: jest.fn(),
    });

    render(
      <EpigramProvider>
        <Page />
      </EpigramProvider>
    );

    // Assert static elements
    expect(screen.getByText('Latest Epigrams')).toBeInTheDocument();

    // Check for epigram content
    await waitFor(() => {
      expect(screen.getByText('Test epigram 1')).toBeInTheDocument();
      expect(screen.getByText('Test epigram 2')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Another Author')).toBeInTheDocument();
    });
  });

  it('renders the loading state', async () => {
    // Setup mock for loading case
    (useEpigramData as jest.Mock).mockReturnValue({
      epigrams: [],
      setEpigrams: jest.fn(),
      loading: true,
      error: null,
      hasMore: true,
      loadMoreEpigrams: jest.fn(),
    });

    render(
      <EpigramProvider>
        <Page />
      </EpigramProvider>
    );

    // Assert static elements
    expect(screen.getByText('Latest Epigrams')).toBeInTheDocument();

    // Check for loading message
    await waitFor(() => {
      expect(screen.getByText('Loading epigrams...')).toBeInTheDocument();
    });
  });
});
