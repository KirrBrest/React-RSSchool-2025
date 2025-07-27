import { vi } from 'vitest';
import { getPokemonList } from '@/api/pokemonApi';

global.fetch = vi.fn();

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('успешно получает список покемонов', async () => {
    const mockResponse = {
      count: 1281,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getPokemonList(16, 0);

    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=16&offset=0'
    );
    expect(result).toEqual(mockResponse);
  });

  it('выбрасывает ошибку при неудачном запросе', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(getPokemonList(16, 0)).rejects.toThrow(
      'Failed to fetch Pokemon list'
    );
  });

  it('выбрасывает ошибку при сетевой ошибке', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    await expect(getPokemonList(16, 0)).rejects.toThrow('Network error');
  });

  it('правильно формирует URL с параметрами', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ count: 0, next: null, previous: null, results: [] }),
    });

    await getPokemonList(32, 64);

    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=32&offset=64'
    );
  });
});
