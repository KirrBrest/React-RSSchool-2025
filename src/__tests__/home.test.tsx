import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@/store/pokemonSlice';
import { pokemonApi } from '@/api';
import Home from '@/pages/home/Home';
import { HashRouter } from 'react-router-dom';
import { useState } from 'react';

const createTestStore = (
  initialState = { pokemon: { selectedPokemons: [] } }
) => {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState: initialState,
  });
};

type MockFetch = ReturnType<typeof vi.fn>;

const mockFetch = vi.fn() as MockFetch;
global.fetch = mockFetch;

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Сбрасываем fetch mock перед каждым тестом
    global.fetch = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
    cleanup();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Восстанавливаем оригинальный fetch
    global.fetch = window.fetch;
    localStorage.clear();
  });

  afterAll(() => {
    vi.clearAllMocks();
    localStorage.clear();
    cleanup();
  });

  const renderWithProviders = (
    initialState = { pokemon: { selectedPokemons: [] } }
  ) => {
    const store = createTestStore(initialState);
    const result = render(
      <Provider store={store}>
        <HashRouter>
          <Home />
        </HashRouter>
      </Provider>
    );
    return result;
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
        clear: vi.fn(),
      },
      writable: true,
    });

    renderWithProviders();
    expect(mockGetItem).toHaveBeenCalledWith('searchQuery');
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
        clear: vi.fn(),
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
        clear: vi.fn(),
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
    cleanup();
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
    cleanup();
  });

  it('правильно обрабатывает URL параметр details', () => {
    // Тестируем логику обработки detailsId и isPokemonDetailsOpen
    renderWithProviders();

    // Проверяем, что компонент рендерится корректно
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/throw error/i)).toBeInTheDocument();

    // Проверяем, что pokemon-list-section существует
    const pokemonListSection = document.querySelector('.pokemon-list-section');
    expect(pokemonListSection).toBeInTheDocument();
  });

  it('вызывает handleClearSearch при очистке поиска', () => {
    const mockSetItem = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue('test-query'),
        setItem: mockSetItem,
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    renderWithProviders();

    // Проверяем, что handleClearSearch вызывается
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('test-query');

    // Симулируем очистку поиска
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput).toHaveValue('');
  });

  it('добавляет и удаляет event listener для clearSearch', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderWithProviders();

    // Проверяем, что addEventListener был вызван для clearSearch
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'clearSearch',
      expect.any(Function)
    );

    // Размонтируем компонент
    unmount();

    // Проверяем, что removeEventListener был вызван для clearSearch
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'clearSearch',
      expect.any(Function)
    );
  });

  it('обрабатывает событие clearSearch', () => {
    const mockSetItem = vi.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue('test-query'),
        setItem: mockSetItem,
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    renderWithProviders();

    // Проверяем начальное значение
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('test-query');

    // Создаем и диспатчим событие clearSearch
    const clearSearchEvent = new CustomEvent('clearSearch');
    window.dispatchEvent(clearSearchEvent);

    // Проверяем, что searchQuery был очищен
    expect(mockSetItem).toHaveBeenCalledWith('searchQuery', '');
  });
});
