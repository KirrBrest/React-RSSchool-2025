import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from '@/components/main/Main';
import { vi } from 'vitest';

const mockFetch = vi.fn((input: RequestInfo | URL): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();

  if (url.includes('pikachu')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/',
        }),
    } as Response);
  } else if (url.includes('limit=30')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          ],
        }),
    } as Response);
  } else {
    return Promise.reject(new Error('Failed to fetch'));
  }
});

global.fetch = mockFetch as typeof fetch;

describe('Main Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders loading state initially', () => {
    render(<Main searchQuery="" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders no results if search query is empty', async () => {
    render(<Main searchQuery="" />);
    await waitFor(() => {
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });
  });

  it('renders error message if API call fails', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );
    render(<Main searchQuery="invalid" />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders pokemon cards on successful API call', async () => {
    render(<Main searchQuery="pikachu" />);
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });
});
