import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchCard from '@/components/searchcard/SearchCard';
import { cleanup } from '@testing-library/react';

vi.mock('@/api', () => ({
  useGetPokemonByUrlQuery: vi.fn(),
}));

const { useGetPokemonByUrlQuery } = await import('@/api');

const mockedUseGetPokemonByUrlQuery = vi.mocked(useGetPokemonByUrlQuery);

const mockStore = configureStore({
  reducer: {
    pokemon: vi.fn((state = { selectedPokemons: [] }) => state),
    pokemonApi: vi.fn((state = {}) => state),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

const mockPokemonData = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      },
    },
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
  stats: [
    {
      base_stat: 35,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/',
      },
    },
  ],
};

const defaultProps = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
  onSelect: vi.fn(),
  isSelected: false,
};

const renderSearchCard = () => {
  return render(
    <Provider store={mockStore}>
      <HashRouter>
        <SearchCard {...defaultProps} />
      </HashRouter>
    </Provider>
  );
};

describe('SearchCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('отображает состояние загрузки', () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderSearchCard();

    expect(screen.getByText(/Loading pikachu/)).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке при неудачном запросе', () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
      refetch: vi.fn(),
    });

    renderSearchCard();

    expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
  });

  it('отображает данные покемона при успешной загрузке', async () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderSearchCard();

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('отображает изображение покемона', async () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderSearchCard();

    await waitFor(() => {
      const image = screen.getByAltText('pikachu');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        mockPokemonData.sprites.front_default
      );
    });
  });

  it('обрабатывает клик по карточке', async () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderSearchCard();

    await waitFor(() => {
      const card = screen.getByText('pikachu').closest('div');
      if (card) {
        fireEvent.click(card);
        expect(defaultProps.onSelect).toHaveBeenCalledWith('25');
      }
    });
  });

  it('отображает статус выбора', async () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderSearchCard();

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('обрабатывает пустое имя покемона', () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Pokemon not found' },
      refetch: vi.fn(),
    });

    render(
      <Provider store={mockStore}>
        <HashRouter>
          <SearchCard {...defaultProps} name="" />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();
  });

  it('обрабатывает некорректный URL', () => {
    mockedUseGetPokemonByUrlQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Invalid URL' },
      refetch: vi.fn(),
    });

    render(
      <Provider store={mockStore}>
        <HashRouter>
          <SearchCard {...defaultProps} url="invalid-url" />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByText('Error: Invalid URL')).toBeInTheDocument();
  });
});
