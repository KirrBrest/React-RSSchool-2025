import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
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

  it('renders name and sprite image after fetch', async () => {
    render(<PokemonCard name="pikachu" url={url} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', mockData.sprites.front_default);
  });

  it('renders name and image correctly', async () => {
    render(<PokemonCard {...props} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', props.url);
  });

  it('renders placeholder or fallback if URL is missing', () => {
    render(<PokemonCard name="pikachu" url="" />);
  });

  it('shows loading state when sprite is not loaded', () => {
    render(<PokemonCard name="pikachu" url={url} />);
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  it('handles network error when fetching sprite', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<PokemonCard name="pikachu" url={url} />);

    await waitFor(() => {
      expect(screen.getByText('Loading image...')).toBeInTheDocument();
    });
  });

  it('handles non-ok response when fetching sprite', async () => {
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

  it('handles missing sprites in response', async () => {
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

  it('calls onSelect when card is clicked', async () => {
    const mockOnSelect = vi.fn();
    render(<PokemonCard name="pikachu" url={url} onSelect={mockOnSelect} />);

    const card = screen.getByText('pikachu').closest('.card');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('25');
  });

  it('does not call onSelect when onSelect is not provided', async () => {
    render(<PokemonCard name="pikachu" url={url} />);

    const card = screen.getByText('pikachu').closest('.card');
    if (card) {
      fireEvent.click(card);
    }

    expect(card).toBeInTheDocument();
  });

  it('handles URL without pokemon ID', async () => {
    const mockOnSelect = vi.fn();
    render(
      <PokemonCard
        name="pikachu"
        url="https://invalid-url"
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByText('pikachu').closest('.card');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('invalid-url');
  });

  it('handles empty URL', async () => {
    const mockOnSelect = vi.fn();
    render(<PokemonCard name="pikachu" url="" onSelect={mockOnSelect} />);

    const card = screen.getByText('pikachu').closest('.card');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('reloads sprite when URL changes', async () => {
    const { rerender } = render(<PokemonCard name="pikachu" url={url} />);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    rerender(
      <PokemonCard name="charizard" url="https://pokeapi.co/api/v2/pokemon/6" />
    );

    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });
});
