import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@/store/pokemonSlice';
import PokemonCard from '@/components/searchcard/SearchCard';
import type { PokemonCardProps } from '@/types/interfaces';

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

describe('PokemonCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (
    props: PokemonCardProps,
    initialState = { pokemon: { selectedPokemons: [] } }
  ) => {
    const store = createTestStore(initialState);
    return render(
      <Provider store={store}>
        <PokemonCard {...props} />
      </Provider>
    );
  };

  it('отображает имя и спрайт после загрузки', async () => {
    const mockResponse = {
      sprites: {
        front_default: 'https://example.com/sprite.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const sprite = screen.getByAltText('bulbasaur');
    expect(sprite).toBeInTheDocument();
  });

  it('отображает имя и изображение корректно', async () => {
    const mockResponse = {
      sprites: {
        front_default: 'https://example.com/sprite.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const sprite = screen.getByAltText('bulbasaur');
    expect(sprite).toHaveAttribute('src', 'https://example.com/sprite.png');
  });

  it('отображает заглушку если URL отсутствует', async () => {
    const mockResponse = {
      sprites: {
        front_default: null,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      const sprite = screen.getByAltText('bulbasaur');
      expect(sprite).toHaveAttribute('src', '/placeholder-sprite.png');
    });
  });

  it('показывает состояние загрузки когда спрайт не загружен', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('обрабатывает сетевую ошибку при загрузке спрайта', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('обрабатывает неуспешный ответ при загрузке спрайта', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      expect(
        screen.getByText('Error: Network response was not ok')
      ).toBeInTheDocument();
    });
  });

  it('обрабатывает отсутствующие спрайты в ответе', async () => {
    const mockResponse = {
      sprites: {},
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      const sprite = screen.getByAltText('bulbasaur');
      expect(sprite).toHaveAttribute('src', '/placeholder-sprite.png');
    });
  });

  it('вызывает onSelect при клике на карточку', async () => {
    const mockOnSelect = vi.fn();
    const mockResponse = {
      sprites: {
        front_default: 'https://example.com/sprite.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
      onSelect: mockOnSelect,
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const card = screen.getByText('bulbasaur').closest('.pokemon-card');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('не вызывает onSelect когда onSelect не предоставлен', async () => {
    const mockResponse = {
      sprites: {
        front_default: 'https://example.com/sprite.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const card = screen.getByText('bulbasaur').closest('.pokemon-card');
    if (card) {
      fireEvent.click(card);
    }

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('обрабатывает URL без ID покемона', async () => {
    const mockResponse = {
      sprites: {
        front_default: 'https://example.com/sprite.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const mockOnSelect = vi.fn();

    renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/',
      name: 'bulbasaur',
      onSelect: mockOnSelect,
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const card = screen.getByText('bulbasaur').closest('.pokemon-card');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('pokemon');
  });

  it('обрабатывает пустой URL', async () => {
    const mockResponse = {
      sprites: {
        front_default: 'https://example.com/sprite.png',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const mockOnSelect = vi.fn();

    renderWithProvider({
      url: '',
      name: 'bulbasaur',
      onSelect: mockOnSelect,
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const card = screen.getByText('bulbasaur').closest('.pokemon-card');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('');
  });

  it('перезагружает спрайт при изменении URL', async () => {
    const mockResponse1 = {
      sprites: {
        front_default: 'https://example.com/sprite1.png',
      },
    };

    const mockResponse2 = {
      sprites: {
        front_default: 'https://example.com/sprite2.png',
      },
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse1,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse2,
      } as Response);

    const { rerender } = renderWithProvider({
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      name: 'bulbasaur',
    });

    await waitFor(() => {
      const sprite = screen.getByAltText('bulbasaur');
      expect(sprite).toHaveAttribute('src', 'https://example.com/sprite1.png');
    });

    rerender(
      <Provider store={createTestStore()}>
        <PokemonCard
          url="https://pokeapi.co/api/v2/pokemon/2/"
          name="ivysaur"
        />
      </Provider>
    );

    await waitFor(() => {
      const sprite = screen.getByAltText('ivysaur');
      expect(sprite).toHaveAttribute('src', 'https://example.com/sprite2.png');
    });
  });
});
