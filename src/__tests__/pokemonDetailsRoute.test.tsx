import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PokemonDetailsRoute from '@/components/pokemon-details/PokemonDetailsRoute';

vi.mock('@/components/pokemon-details/PokemonDetails', () => ({
  default: ({ pokemonId }: { pokemonId: string }) => (
    <div data-testid="pokemon-details" data-pokemon-id={pokemonId}>
      Pokemon Details for {pokemonId}
    </div>
  ),
}));

const mockUseSearchParams = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
  };
});

describe('PokemonDetailsRoute', () => {
  it('рендерит PokemonDetails когда detailsId присутствует', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?details=25'),
      vi.fn(),
    ]);

    render(
      <BrowserRouter>
        <PokemonDetailsRoute />
      </BrowserRouter>
    );

    expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
    expect(screen.getByText('Pokemon Details for 25')).toBeInTheDocument();
  });

  it('возвращает null когда detailsId отсутствует', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(''), vi.fn()]);

    const { container } = render(
      <BrowserRouter>
        <PokemonDetailsRoute />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('возвращает null когда detailsId равен null', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?other=value'),
      vi.fn(),
    ]);

    const { container } = render(
      <BrowserRouter>
        <PokemonDetailsRoute />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('передает правильный pokemonId в PokemonDetails', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?details=150'),
      vi.fn(),
    ]);

    render(
      <BrowserRouter>
        <PokemonDetailsRoute />
      </BrowserRouter>
    );

    const pokemonDetails = screen.getByTestId('pokemon-details');
    expect(pokemonDetails).toHaveAttribute('data-pokemon-id', '150');
  });
});
