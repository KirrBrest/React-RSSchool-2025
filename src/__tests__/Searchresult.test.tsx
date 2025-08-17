import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchResult from '@/components/searchresult/Searchresult';
import { cleanup } from '@testing-library/react';

vi.mock('@/components/searchcard/SearchCard', () => ({
  default: ({
    name,
    onSelect,
    isSelected,
  }: {
    name: string;
    onSelect: (id: string) => void;
    isSelected?: boolean;
  }) => (
    <div
      data-testid={`search-card-${name}`}
      onClick={() => onSelect(name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(name);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {name} - {isSelected ? 'Selected' : 'Not Selected'}
    </div>
  ),
}));

vi.mock('@/components/validation/validation', () => ({
  validatePokemonName: vi.fn((name: string) => name.length > 0),
}));

vi.mock('@/api', () => ({
  useGetPokemonListQuery: vi.fn(),
  useSearchPokemonQuery: vi.fn(),
  useLazySearchPokemonQuery: vi.fn(),
  createPokemonUrl: vi.fn(
    (id: string | number) => `https://pokeapi.co/api/v2/pokemon/${id}/`
  ),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: vi.fn((state = {}) => state),
    middleware: vi.fn(),
    util: {
      resetApiState: vi.fn(),
    },
  },
}));

const { useGetPokemonListQuery, useLazySearchPokemonQuery } = await import(
  '@/api'
);

const mockStore = configureStore({
  reducer: {
    pokemon: vi.fn((state = { selectedPokemons: [] }) => state),
    pokemonApi: vi.fn((state = {}) => state),
  },
});

const mockPokemonListData = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
    { name: 'wartortle', url: 'https://pokeapi.co/api/v2/pokemon/8/' },
    { name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon/9/' },
    { name: 'caterpie', url: 'https://pokeapi.co/api/v2/pokemon/10/' },
    { name: 'metapod', url: 'https://pokeapi.co/api/v2/pokemon/11/' },
    { name: 'butterfree', url: 'https://pokeapi.co/api/v2/pokemon/12/' },
    { name: 'weedle', url: 'https://pokeapi.co/api/v2/pokemon/13/' },
  ],
  next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
  previous: null,
  count: 13,
};

const mockSearchData = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
  types: [
    {
      slot: 1,
      type: {
        name: 'electric',
        url: 'https://pokeapi.co/api/v2/type/13/',
      },
    },
  ],
};

const renderSearchResult = (searchQuery = '', onClearSearch = vi.fn()) => {
  return render(
    <Provider store={mockStore}>
      <HashRouter>
        <SearchResult searchQuery={searchQuery} onClearSearch={onClearSearch} />
      </HashRouter>
    </Provider>
  );
};

describe('SearchResult', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Object.defineProperty(window, 'dispatchEvent', {
      value: vi.fn(),
      writable: true,
    });
    global.alert = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('отображает список покемонов при успешной загрузке', async () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
      vi.fn(),
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByTestId('search-card-bulbasaur')).toBeInTheDocument();
      expect(screen.getByTestId('search-card-ivysaur')).toBeInTheDocument();
    });
  });

  it('отображает состояние загрузки', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке при неудачном запросе', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('отображает сообщение о пустом результате поиска', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: { results: [], count: 0, next: null, previous: null },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('No Pokemon data available')).toBeInTheDocument();
  });

  it('обрабатывает клик по карточке покемона', async () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      const bulbasaurCard = screen.getByTestId('search-card-bulbasaur');
      fireEvent.click(bulbasaurCard);
    });
  });

  it('отображает пагинацию при наличии следующей страницы', async () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText('▶')).toBeInTheDocument();
    });
  });

  it('отображает состояние поиска', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: true,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult('pikachu');

    expect(
      screen.getByText('Searching for Pokemon "pikachu"...')
    ).toBeInTheDocument();
  });

  it('отображает результат поиска', async () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: mockSearchData,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult('pikachu');

    await waitFor(() => {
      expect(screen.getByTestId('search-card-pikachu')).toBeInTheDocument();
    });
  });

  it('отображает ошибку поиска', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: { message: 'Pokemon not found' },
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult('invalid-pokemon');

    expect(screen.getByText('← Back to List')).toBeInTheDocument();
  });

  it('обрабатывает кнопку "Back to List" при ошибке поиска', () => {
    const mockOnClearSearch = vi.fn();
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: { message: 'Pokemon not found' },
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult('invalid-pokemon', mockOnClearSearch);

    const backButton = screen.getByText('← Back to List');
    fireEvent.click(backButton);

    expect(mockOnClearSearch).toHaveBeenCalled();
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
  });

  it('обрабатывает кнопку Refresh', async () => {
    const mockRefetch = vi.fn();
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      const refreshButton = screen.getByText('🔄 Refresh');
      fireEvent.click(refreshButton);
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('обрабатывает кнопку Clear Cache', async () => {
    const mockRefetch = vi.fn();
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      const clearCacheButton = screen.getByText('🗑️ Clear Cache');
      fireEvent.click(clearCacheButton);
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('обрабатывает кнопку Show Spinners', async () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      const showSpinnersButton = screen.getByText('🐌 Show Spinners');
      fireEvent.click(showSpinnersButton);
    });

    expect(global.alert).toHaveBeenCalledWith(
      '💡 Tip: Open DevTools (F12) → Network tab → Enable "Slow 3G" to see loading spinners!'
    );
  });

  it('отображает background loading при обновлении данных', async () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListData,
      isLoading: false,
      isFetching: true,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        isFetching: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText('🔄 Updating data...')).toBeInTheDocument();
    });
  });

  it('обрабатывает различные типы ошибок', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 'FETCH_ERROR' },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(
      screen.getByText('Network error. Please check your connection.')
    ).toBeInTheDocument();
  });

  it('обрабатывает ошибку 404', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 404 },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
  });

  it('обрабатывает серверную ошибку', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500 },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(
      screen.getByText('Server error. Please try again later.')
    ).toBeInTheDocument();
  });

  it('обрабатывает ошибку с данными', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { data: 'Custom error message' },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();
    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
  });

  it('обрабатывает ошибку с JSON данными', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { data: { message: 'JSON error' } },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
  });

  it('обрабатывает ошибку с сообщением', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Error message' },
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('обрабатывает неизвестную ошибку', () => {
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: {},
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
  });

  it('обрабатывает кнопку Load Pokemon при пустом списке', () => {
    const mockRefetch = vi.fn();
    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: { results: [], count: 0, next: null, previous: null },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    const loadButton = screen.getByText('Load Pokemon');
    fireEvent.click(loadButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('обрабатывает пагинацию с ellipsis', async () => {
    const mockPokemonListDataWithManyPages = {
      ...mockPokemonListData,
      count: 100,
    };

    const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);
    mockUseGetPokemonListQuery.mockReturnValue({
      data: mockPokemonListDataWithManyPages,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetPokemonListQuery>);

    const mockUseLazySearchPokemonQuery = vi.mocked(useLazySearchPokemonQuery);
    mockUseLazySearchPokemonQuery.mockReturnValue([
      vi.fn(),
      {
        data: null,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazySearchPokemonQuery>);

    renderSearchResult();

    await waitFor(() => {
      expect(screen.getByText('...')).toBeInTheDocument();
    });
  });
});
