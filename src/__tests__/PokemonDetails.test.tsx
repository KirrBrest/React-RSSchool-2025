import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PokemonDetails from '@/components/pokemon-details/PokemonDetails';
import { cleanup } from '@testing-library/react';

vi.mock('@/api', () => ({
  useGetPokemonQuery: vi.fn(),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: vi.fn((state = {}) => state),
    middleware: vi.fn(),
    util: {
      resetApiState: vi.fn(),
    },
  },
}));

const { useGetPokemonQuery } = await import('@/api');

const mockStore = configureStore({
  reducer: {
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
    back_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
    front_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png',
    back_shiny:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/25.png',
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
  abilities: [
    {
      ability: {
        name: 'static',
        url: 'https://pokeapi.co/api/v2/ability/9/',
      },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: {
        name: 'lightning-rod',
        url: 'https://pokeapi.co/api/v2/ability/31/',
      },
      is_hidden: true,
      slot: 3,
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
  pokemonId: '25',
  onClose: vi.fn(),
};

const renderPokemonDetails = () => {
  return render(
    <Provider store={mockStore}>
      <HashRouter>
        <PokemonDetails {...defaultProps} />
      </HashRouter>
    </Provider>
  );
};

describe('PokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('отображает состояние загрузки', () => {
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderPokemonDetails();

    expect(screen.getByText('Loading Pokemon details...')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке при неудачном запросе', () => {
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
      refetch: vi.fn(),
    });

    renderPokemonDetails();

    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('отображает изображение покемона', async () => {
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPokemonDetails();

    await waitFor(() => {
      const image = screen.getByAltText('pikachu front');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        mockPokemonData.sprites.front_default
      );
    });
  });

  it('обрабатывает клик по кнопке закрытия', async () => {
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPokemonDetails();

    await waitFor(() => {
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('обрабатывает клик по кнопке обновления', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderPokemonDetails();

    await waitFor(() => {
      const refreshButton = screen.getByText('🔄');
      fireEvent.click(refreshButton);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('обрабатывает пустое имя покемона', () => {
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Pokemon not found' },
      refetch: vi.fn(),
    });

    render(
      <Provider store={mockStore}>
        <HashRouter>
          <PokemonDetails {...defaultProps} pokemonId="" />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
  });

  it('обрабатывает некорректный ID покемона', () => {
    vi.mocked(useGetPokemonQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Invalid ID' },
      refetch: vi.fn(),
    });

    render(
      <Provider store={mockStore}>
        <HashRouter>
          <PokemonDetails {...defaultProps} pokemonId="invalid" />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByText('Invalid ID')).toBeInTheDocument();
  });
});
