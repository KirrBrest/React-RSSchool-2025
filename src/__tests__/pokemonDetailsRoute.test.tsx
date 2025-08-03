import { describe, it, expect, vi, afterEach, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
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
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('рендерит PokemonDetails когда detailsId присутствует', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?details=25'),
      vi.fn(),
    ]);
    render(
      <HashRouter>
        <PokemonDetailsRoute />
      </HashRouter>
    );
    expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
    expect(screen.getByText('Pokemon Details for 25')).toBeInTheDocument();
  });

  it('не рендерит PokemonDetails когда detailsId отсутствует', () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams(''), vi.fn()]);
    render(
      <HashRouter>
        <PokemonDetailsRoute />
      </HashRouter>
    );
    expect(screen.queryByTestId('pokemon-details')).not.toBeInTheDocument();
  });

  it('правильно передает pokemonId в PokemonDetails', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?details=150'),
      vi.fn(),
    ]);
    render(
      <HashRouter>
        <PokemonDetailsRoute />
      </HashRouter>
    );
    const detailsElement = screen.getByTestId('pokemon-details');
    expect(detailsElement).toHaveAttribute('data-pokemon-id', '150');
  });

  it('обрабатывает null значение detailsId', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?details='),
      vi.fn(),
    ]);
    render(
      <HashRouter>
        <PokemonDetailsRoute />
      </HashRouter>
    );
    expect(screen.queryByTestId('pokemon-details')).not.toBeInTheDocument();
  });
});
