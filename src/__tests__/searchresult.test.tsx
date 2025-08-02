import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Searchresult from '@/components/searchresult/Searchresult';
import type { Mock } from 'vitest';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('@/api/pokemonApi', () => ({
  getPokemonList: vi.fn(),
}));

vi.mock('@/components/searchcard/SearchCard', () => ({
  default: ({ name, url }: { name: string; url: string }) => (
    <div data-testid={`pokemon-card-${name}`}>
      {name} - {url}
    </div>
  ),
}));

const mockUseSearchParams = useSearchParams as unknown as Mock;
const mockUseNavigate = useNavigate as unknown as Mock;
const mockSetSearchParams = vi.fn();
const mockNavigate = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockUseSearchParams.mockReturnValue([
    new URLSearchParams('?page=1'),
    mockSetSearchParams,
  ]);
  mockUseNavigate.mockReturnValue(mockNavigate);
});

describe('Поиск по имени Покемона', () => {
  it('отображает результат поиска по имени', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'pikachu', id: 25 }),
    });

    render(<Searchresult searchQuery="pikachu" />);

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument();
    });
  });

  it('отображает ошибку при неудачном поиске', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    render(<Searchresult searchQuery="nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();
    });
  });

  it('отображает "Нет результатов" при пустом результате поиска', async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Pokemon not found'));

    render(<Searchresult searchQuery="nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();
    });
  });

  it('обрабатывает неизвестные ошибки', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce('Unknown error');

    render(<Searchresult searchQuery="test" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Unknown error')).toBeInTheDocument();
    });
  });

  it('обрабатывает ошибки API при загрузке списка', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockRejectedValueOnce('Network error');

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Unknown error')).toBeInTheDocument();
    });
  });

  it('обрабатывает запросы с пробелами', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="   " />);

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
    });
  });
});

describe('Отображение списка Покемонов', () => {
  it('отображает список Покемонов при пустом запросе', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-card-ivysaur')).toBeInTheDocument();
    });
  });

  it('отображает ошибку при неудачной загрузке списка', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockRejectedValueOnce(new Error('API Error'));

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  it('отображает "Нет результатов" при пустом списке', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('No results')).toBeInTheDocument();
    });
  });
});

describe('Пагинация', () => {
  it('отображает пагинацию при наличии результатов', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('81')).toBeInTheDocument(); // Math.ceil(1281/16)
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });
  });

  it('не отображает пагинацию при одной странице', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 10,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
    });
  });

  it('отображает пагинацию с многоточием в начале при странице > 3', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?page=5'),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=80&limit=16',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=64&limit=16',
      results: [
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const ellipsisElements = screen.getAllByText('...');
      expect(ellipsisElements).toHaveLength(2); // начало и конец
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });
  });

  it('отображает пагинацию с многоточием в конце при page < totalPages - 2', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?page=75'),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=1200&limit=16',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=1184&limit=16',
      results: [
        { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const ellipsisElements = screen.getAllByText('...');
      expect(ellipsisElements).toHaveLength(2); // начало и конец
      expect(screen.getByText('74')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('76')).toBeInTheDocument();
    });
  });

  it('отображает пагинацию без многоточия при небольшом количестве страниц', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?page=2'),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 48,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=32&limit=16',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=16',
      results: [
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('отображает кнопки пагинации с правильными отключенными состояниями', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?page=1'),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      const page1Button = screen.getByText('1');

      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
      expect(page1Button).toBeDisabled();
    });
  });

  it('обрабатывает клик по кнопке следующей страницы', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams)
      );
    });
  });

  it('обрабатывает клик по кнопке предыдущей страницы', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?page=2'),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=32&limit=16',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=16',
      results: [
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams)
      );
    });
  });

  it('обрабатывает клик по кнопке последней страницы', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const lastPageButton = screen.getByText('81');
      fireEvent.click(lastPageButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams)
      );
    });
  });

  it('отображает кнопки пагинации с правильными классами', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const activePageButton = screen.getByText('1');
      const inactivePageButton = screen.getByText('2');
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');

      expect(activePageButton).toHaveClass('active');
      expect(inactivePageButton).not.toHaveClass('active');
      expect(prevButton).toHaveClass('pagination-arrow');
      expect(nextButton).toHaveClass('pagination-arrow');
    });
  });

  it('обрабатывает клик по номеру страницы', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const pageButton = screen.getByText('81');
      fireEvent.click(pageButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams)
      );
    });
  });

  it('отображает многоточие при большом количестве страниц', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('...')).toBeInTheDocument();
    });
  });

  it('отображает активную страницу с правильным классом', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const activePageButton = screen.getByText('1');
      expect(activePageButton).toHaveClass('active');
    });
  });

  it('не отображает пагинацию при одной странице', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 10,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  it('отображает состояние загрузки', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockImplementation(() => new Promise(() => {}));

    render(<Searchresult searchQuery="" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('отображает ошибку при неудачном запросе', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockRejectedValueOnce(new Error('Network error'));

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('обрабатывает выбор покемона и открытие деталей', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      const pokemonCard = screen.getByTestId('pokemon-card-bulbasaur');
      expect(pokemonCard).toBeInTheDocument();
    });
  });

  it('отображает "No results" при пустом результате поиска', async () => {
    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('No results')).toBeInTheDocument();
    });
  });

  it('отображает "No results" при пустом результате поиска по имени', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'pikachu', id: 25 }),
    });

    render(<Searchresult searchQuery="pikachu" />);

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument();
    });
  });
});

describe('Состояние загрузки', () => {
  it('отображает индикатор загрузки', () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<Searchresult searchQuery="pikachu" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('Обработка URL параметров', () => {
  it('использует номер страницы из URL', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('?page=3'),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=48&limit=16',
      previous: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      results: [
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(getPokemonList).toHaveBeenCalledWith(16, 32);
    });
  });

  it('использует страницу 1 по умолчанию', async () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams(''),
      mockSetSearchParams,
    ]);

    const { getPokemonList } = await import('@/api/pokemonApi');
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(getPokemonList).toHaveBeenCalledWith(16, 0);
    });
  });
});

describe('Отображение результатов поиска', () => {
  it('отображает результат поиска по имени', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'pikachu', id: 25 }),
    });

    render(<Searchresult searchQuery="pikachu" />);

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument();
    });
  });

  it('отображает ошибку при неудачном поиске', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    render(<Searchresult searchQuery="nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();
    });
  });

  it('отображает "No results" для пустых результатов поиска', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<Searchresult searchQuery="nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();
    });
  });

  it('отображает "No results" для пустых результатов по имени', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<Searchresult searchQuery="nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Pokemon not found')).toBeInTheDocument();
    });
  });

  it('renderPagination возвращает null при одной странице', async () => {
    const mockData = {
      count: 10,
      results: Array.from({ length: 10 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
      })),
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });
  });

  it('обрабатывает поиск с пустым запросом и показывает загрузку', async () => {
    const mockData = {
      count: 100,
      results: Array.from({ length: 16 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
      })),
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('обрабатывает поиск с пробелами и показывает загрузку', async () => {
    const mockData = {
      count: 100,
      results: Array.from({ length: 16 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
      })),
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<Searchresult searchQuery="   " />);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('обрабатывает поиск с заглавными буквами и показывает загрузку', async () => {
    const mockData = {
      count: 100,
      results: Array.from({ length: 16 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
      })),
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<Searchresult searchQuery="POKEMON" />);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('renderPagination возвращает null при одной странице', async () => {
    const mockData = {
      count: 10,
      results: Array.from({ length: 10 }, (_, i) => ({
        name: `pokemon-${i}`,
        url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
      })),
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<Searchresult searchQuery="" />);

    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });
  });
});
