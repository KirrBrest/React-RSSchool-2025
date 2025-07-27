import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PokemonDetails from '@/components/pokemon-details/PokemonDetails';

global.fetch = vi.fn();

describe('PokemonDetails', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит компонент с переданным pokemonId', () => {
    render(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    expect(screen.getByText('Loading Pokemon details...')).toBeInTheDocument();
  });

  it('вызывает onClose при клике на кнопку закрытия в состоянии ошибки', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<PokemonDetails pokemonId="999999" onClose={mockOnClose} />);

    await waitFor(() => {
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('отображает кнопку закрытия в состоянии ошибки', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<PokemonDetails pokemonId="999999" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  it('отображает состояние загрузки', async () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    expect(screen.getByText('Loading Pokemon details...')).toBeInTheDocument();
  });

  it('отображает ошибку при неудачном запросе', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<PokemonDetails pokemonId="999999" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to fetch Pokemon details')
      ).toBeInTheDocument();
    });
  });

  it('отображает ошибку при сетевой ошибке', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('отображает ошибку при неизвестной ошибке', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce('Unknown error');

    render(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
    });
  });

  it('отображает детали покемона при успешном запросе', async () => {
    const mockPokemonData = {
      id: 25,
      name: 'pikachu',
      height: 40,
      weight: 60,
      sprites: {
        front_default: 'https://example.com/front.png',
        back_default: 'https://example.com/back.png',
        front_shiny: 'https://example.com/front-shiny.png',
        back_shiny: 'https://example.com/back-shiny.png',
      },
      types: [{ type: { name: 'electric' } }],
      abilities: [
        { ability: { name: 'static' }, is_hidden: false },
        { ability: { name: 'lightning-rod' }, is_hidden: true },
      ],
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
        { base_stat: 40, stat: { name: 'defense' } },
        { base_stat: 50, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 90, stat: { name: 'speed' } },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonData,
    });

    render(<PokemonDetails pokemonId="25" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('#025')).toBeInTheDocument();
      expect(screen.getByText('4m')).toBeInTheDocument();
      expect(screen.getByText('6kg')).toBeInTheDocument();
      expect(screen.getByText('electric')).toBeInTheDocument();
      expect(screen.getByText('static')).toBeInTheDocument();
      expect(screen.getByText('lightning-rod')).toBeInTheDocument();
      expect(screen.getByText('Hidden')).toBeInTheDocument();
      expect(screen.getByText('hp:')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
    });
  });

  it('вызывает onClose при клике на кнопку закрытия в состоянии ошибки', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<PokemonDetails pokemonId="999999" onClose={mockOnClose} />);

    await waitFor(() => {
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('не делает запрос при пустом pokemonId', () => {
    render(<PokemonDetails pokemonId="" onClose={mockOnClose} />);

    expect(fetch).not.toHaveBeenCalled();
  });
});
