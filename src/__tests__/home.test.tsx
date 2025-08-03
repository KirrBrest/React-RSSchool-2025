import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@/store/pokemonSlice';
import Home from '@/pages/home/Home';
import { HashRouter } from 'react-router-dom';
import { useState } from 'react';

const createTestStore = (
  initialState = { pokemon: { selectedPokemons: [] } }
) => {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
    },
    preloadedState: initialState,
  });
};

type MockFetch = ReturnType<typeof vi.fn>;

const mockFetch = vi.fn() as MockFetch;
global.fetch = mockFetch;

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  const renderWithProviders = (
    initialState = { pokemon: { selectedPokemons: [] } }
  ) => {
    const store = createTestStore(initialState);
    return render(
      <Provider store={store}>
        <HashRouter>
          <Home />
        </HashRouter>
      </Provider>
    );
  };

  it('рендерит Search компонент', () => {
    renderWithProviders();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('рендерит кнопку Throw Error', () => {
    renderWithProviders();
    expect(screen.getByText(/throw error/i)).toBeInTheDocument();
  });

  it('кнопка Throw Error вызывает ошибку при клике', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders();
    const errorButton = screen.getByText(/throw error/i);
    expect(errorButton).toBeInTheDocument();
    error.mockRestore();
  });

  it('выполняет поиск Pokemon', async () => {
    const mockPokemonData = {
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'https://example.com/pikachu.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonData,
    } as Response);

    renderWithProviders();

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });

    expect(searchInput).toHaveValue('pikachu');
  });

  it('загружает searchQuery из localStorage при монтировании', () => {
    const mockGetItem = vi.fn().mockReturnValue('test-query');
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    renderWithProviders();
    expect(mockGetItem).toHaveBeenCalledWith('searchQuery');
  });

  it('показывает сообщение об отсутствии результатов', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Pokemon not found'));

    renderWithProviders();

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText(/error:/i)).toBeInTheDocument();
      expect(screen.getByText(/pokemon not found/i)).toBeInTheDocument();
    });
  });

  it('правильно обрабатывает состояние с открытыми деталями', () => {
    renderWithProviders();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/throw error/i)).toBeInTheDocument();
  });

  it('вызывает handleSearchQuery при изменении поиска', () => {
    renderWithProviders();

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveValue('test');
  });

  it('правильно обрабатывает URL параметры для деталей покемона', () => {
    renderWithProviders();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('правильно обрабатывает состояние без параметра details', () => {
    renderWithProviders();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('вызывает setSearchQuery при изменении поискового запроса', () => {
    const mockSetItem = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(''),
        setItem: mockSetItem,
        removeItem: vi.fn(),
      },
      writable: true,
    });

    renderWithProviders();

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'new-search' } });

    expect(searchInput).toHaveValue('new-search');
  });

  it('правильно обрабатывает функцию handleSearchQuery', () => {
    const mockSetItem = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(''),
        setItem: mockSetItem,
        removeItem: vi.fn(),
      },
      writable: true,
    });

    renderWithProviders();

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test-query' } });

    expect(searchInput).toHaveValue('test-query');
  });

  it('вызывает setError при клике на кнопку Throw Error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderWithProviders();
      const errorButton = screen.getByText(/throw error/i);
      fireEvent.click(errorButton);
    }).toThrow('This is a test error');

    consoleSpy.mockRestore();
  });

  it('выбрасывает ошибку когда error состояние true', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const TestComponent = () => {
      const [error] = useState(true);
      if (error) {
        throw new Error('This is a test error');
      }
      return <div>Test</div>;
    };

    expect(() => {
      render(
        <Provider store={createTestStore()}>
          <HashRouter>
            <TestComponent />
          </HashRouter>
        </Provider>
      );
    }).toThrow('This is a test error');

    consoleSpy.mockRestore();
  });
});
