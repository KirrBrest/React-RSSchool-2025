import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
