import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import ErrorBoundary from '../components/errors/ErrorBoundary';
import { vi } from 'vitest';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит инпут поиска, кнопку поиска, кнопку Throw Error и контейнер карточек', async () => {
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /throw error/i })
    ).toBeInTheDocument();

    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });

  it('кнопка Throw Error вызывает ошибку при клике', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    const errorButton = screen.getByRole('button', { name: /throw error/i });
    expect(errorButton).toBeInTheDocument();

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow('This is a test error');

    error.mockRestore();
  });

  it('setSearchQuery обновляет состояние и передает в Main', async () => {
    const mockFetch = vi
      .spyOn(global, 'fetch')
      .mockImplementation((url: RequestInfo | URL) => {
        const urlStr =
          typeof url === 'string'
            ? url
            : url instanceof URL
              ? url.toString()
              : ((url as Request)?.url ?? '');
        if (urlStr.includes('pikachu')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              name: 'pikachu',
              id: 25,
              sprites: { front_default: 'test-url' },
            }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ results: [] }),
        } as Response);
      });

    render(<App />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    fireEvent.click(searchButton);

    expect(await screen.findByText('pikachu')).toBeInTheDocument();

    mockFetch.mockRestore();
  });

  it('throwError устанавливает состояние error в true', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    const errorButton = screen.getByRole('button', { name: /throw error/i });

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow('This is a test error');

    error.mockRestore();
  });

  it('componentDidMount загружает searchQuery из localStorage', async () => {
    localStorage.setItem('searchQuery', 'charizard');

    const mockFetch = vi
      .spyOn(global, 'fetch')
      .mockImplementation((url: RequestInfo | URL) => {
        const urlStr =
          typeof url === 'string'
            ? url
            : url instanceof URL
              ? url.toString()
              : ((url as Request)?.url ?? '');
        if (urlStr.includes('charizard')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              name: 'charizard',
              id: 6,
              sprites: { front_default: 'test-url' },
            }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ results: [] }),
        } as Response);
      });

    render(<App />);

    const searchInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(searchInput.value).toBe('charizard');

    expect(await screen.findByText('charizard')).toBeInTheDocument();

    mockFetch.mockRestore();
  });

  it('ErrorBoundary ловит ошибку в простом компоненте', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
    error.mockRestore();
  });
});
