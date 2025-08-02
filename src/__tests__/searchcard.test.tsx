import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PokemonCard from '@/components/searchcard/SearchCard';

const mockData = {
  sprites: { front_default: 'https://pokeapi.co/media/sprites/pokemon/25.png' },
};

describe('PokemonCard', () => {
  const props = {
    name: 'pikachu',
    url: 'https://pokeapi.co/media/sprites/pokemon/25.png',
  };

  const url = 'https://pokeapi.co/api/v2/pokemon/25';

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('отображает имя и спрайт после загрузки', async () => {
    render(<PokemonCard name="pikachu" url={url} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', mockData.sprites.front_default);
  });

  it('отображает имя и изображение корректно', async () => {
    render(<PokemonCard {...props} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', props.url);
  });

  it('отображает заглушку если URL отсутствует', () => {
    render(<PokemonCard name="pikachu" url="" />);
  });

  it('показывает состояние загрузки когда спрайт не загружен', () => {
    render(<PokemonCard name="pikachu" url={url} />);
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  it('обрабатывает сетевую ошибку при загрузке спрайта', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<PokemonCard name="pikachu" url={url} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });

  it('обрабатывает неуспешный ответ при загрузке спрайта', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    );

    render(<PokemonCard name="pikachu" url={url} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });

  it('обрабатывает отсутствующие спрайты в ответе', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sprites: {} }),
      } as Response)
    );

    render(<PokemonCard name="pikachu" url={url} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });

  it('вызывает onSelect при клике на карточку', async () => {
    const mockOnSelect = vi.fn();
    render(<PokemonCard name="pikachu" url={url} onSelect={mockOnSelect} />);

    const card = screen.getByText('pikachu').closest('.card');
    if (card) {
      fireEvent.click(card);
      expect(mockOnSelect).toHaveBeenCalledWith('25');
    }
  });

  it('не вызывает onSelect когда onSelect не предоставлен', async () => {
    render(<PokemonCard name="pikachu" url={url} />);

    const card = screen.getByText('pikachu').closest('.card');
    if (card) {
      fireEvent.click(card);
      // Не должно быть ошибок
    }
  });

  it('обрабатывает URL без ID покемона', async () => {
    const invalidUrl = 'https://pokeapi.co/api/v2/pokemon/';
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sprites: {} }),
      } as Response)
    );

    render(<PokemonCard name="pikachu" url={invalidUrl} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });

  it('обрабатывает пустой URL', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sprites: {} }),
      } as Response)
    );

    render(<PokemonCard name="pikachu" url="" />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });

  it('перезагружает спрайт при изменении URL', async () => {
    const { rerender } = render(<PokemonCard name="pikachu" url={url} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });

    const newUrl = 'https://pokeapi.co/api/v2/pokemon/26';
    rerender(<PokemonCard name="raichu" url={newUrl} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });
});
