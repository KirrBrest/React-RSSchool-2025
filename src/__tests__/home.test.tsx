import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '@/pages/home/Home';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
const mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    clear: (): void => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит Search компонент', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('рендерит кнопку Throw Error', () => {
    renderWithRouter(<Home />);
    expect(
      screen.getByRole('button', { name: /throw error/i })
    ).toBeInTheDocument();
  });

  it('кнопка Throw Error вызывает ошибку при клике', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithRouter(<Home />);

    const errorButton = screen.getByRole('button', { name: /throw error/i });
    expect(errorButton).toBeInTheDocument();

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow('This is a test error');

    error.mockRestore();
  });

  it('выполняет поиск Pokemon', async () => {
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

    renderWithRouter(<Home />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    mockFetch.mockRestore();
  });

  it('загружает searchQuery из localStorage при монтировании', async () => {
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

    renderWithRouter(<Home />);

    const searchInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(searchInput.value).toBe('charizard');

    await waitFor(() => {
      expect(screen.getByText('charizard')).toBeInTheDocument();
    });

    mockFetch.mockRestore();
  });

  it('показывает сообщение об отсутствии результатов', async () => {
    renderWithRouter(<Home />);
    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });
});
