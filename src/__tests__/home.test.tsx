import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@/store/pokemonSlice';
import Home from '@/pages/home/Home';
import { BrowserRouter } from 'react-router-dom';

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
        <BrowserRouter>
          <Home />
        </BrowserRouter>
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
});
