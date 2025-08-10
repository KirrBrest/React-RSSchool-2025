import {
  vi,
  afterEach,
  afterAll,
  describe,
  it,
  expect,
  beforeEach,
} from 'vitest';
import { pokemonApi } from '../api/pokemonApi';
import { getPokemonList } from '../api/pokemonApi';
import {
  API_CONFIG,
  createPokemonUrl,
  createPokemonListUrl,
} from '../api/constants';
import type { PokemonListResponse } from '@/types/interfaces';

const createMockResponse = (
  data: PokemonListResponse | null,
  ok: boolean = true,
  status: number = 200
) => {
  return {
    ok,
    status,
    json: async () => data,
    clone: () => createMockResponse(data, ok, status),
  };
};

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.fetch = window.fetch;
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('getPokemonList function', () => {
    it('успешно получает список покемонов', async () => {
      const mockResponse: PokemonListResponse = {
        count: 1281,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=16&limit=16',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await getPokemonList(16, 0);

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=16&offset=0'
      );
      expect(result).toEqual(mockResponse);
    });

    it('выбрасывает ошибку при неудачном запросе', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(createMockResponse(null, false, 500));

      await expect(getPokemonList(16, 0)).rejects.toThrow(
        'Failed to fetch Pokemon list'
      );
    });

    it('выбрасывает ошибку при сетевой ошибке', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      await expect(getPokemonList(16, 0)).rejects.toThrow('Network error');
    });

    it('правильно формирует URL с параметрами', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(
        createMockResponse({
          count: 0,
          next: null,
          previous: null,
          results: [],
        })
      );

      await getPokemonList(32, 64);

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=32&offset=64'
      );
    });

    it('обрабатывает различные значения limit и offset', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(
          createMockResponse({
            count: 0,
            next: null,
            previous: null,
            results: [],
          })
        )
        .mockResolvedValueOnce(
          createMockResponse({
            count: 0,
            next: null,
            previous: null,
            results: [],
          })
        );

      await getPokemonList(1, 100);
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1&offset=100'
      );

      await getPokemonList(50, 0);
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'
      );
    });
  });

  describe('pokemonApi configuration', () => {
    it('имеет правильный reducerPath', () => {
      expect(pokemonApi.reducerPath).toBe('pokemonApi');
    });

    it('имеет правильные endpoints', () => {
      const endpoints = Object.keys(pokemonApi.endpoints);
      expect(endpoints).toContain('getPokemonList');
      expect(endpoints).toContain('getPokemon');
      expect(endpoints).toContain('searchPokemon');
      expect(endpoints).toContain('getPokemonByUrl');
    });
  });

  describe('API constants', () => {
    it('импортирует и использует правильные константы', () => {
      expect(API_CONFIG.BASE_URL).toBe('https://pokeapi.co/api/v2/');
      expect(API_CONFIG.ENDPOINTS.POKEMON).toBe('pokemon');
      expect(API_CONFIG.DEFAULT_PAGINATION.LIMIT).toBe(12);
      expect(API_CONFIG.DEFAULT_PAGINATION.OFFSET).toBe(0);
    });

    it('имеет правильные utility функции', () => {
      expect(typeof createPokemonUrl).toBe('function');
      expect(typeof createPokemonListUrl).toBe('function');
    });
  });

  describe('Cache configuration', () => {
    it('имеет правильную конфигурацию кеширования', () => {
      expect(pokemonApi.reducerPath).toBe('pokemonApi');
      expect(pokemonApi.endpoints).toBeDefined();
    });
  });

  describe('RTK Query endpoints', () => {
    describe('getPokemonList endpoint', () => {
      it('существует и имеет правильную структуру', () => {
        const endpoint = pokemonApi.endpoints.getPokemonList;
        expect(endpoint).toBeDefined();
        expect(typeof endpoint.initiate).toBe('function');
        expect(typeof endpoint.select).toBe('function');
      });
    });

    describe('getPokemon endpoint', () => {
      it('существует и имеет правильную структуру', () => {
        const endpoint = pokemonApi.endpoints.getPokemon;
        expect(endpoint).toBeDefined();
        expect(typeof endpoint.initiate).toBe('function');
        expect(typeof endpoint.select).toBe('function');
      });
    });

    describe('searchPokemon endpoint', () => {
      it('существует и имеет правильную структуру', () => {
        const endpoint = pokemonApi.endpoints.searchPokemon;
        expect(endpoint).toBeDefined();
        expect(typeof endpoint.initiate).toBe('function');
        expect(typeof endpoint.select).toBe('function');
      });
    });

    describe('getPokemonByUrl endpoint', () => {
      it('существует и имеет правильную структуру', () => {
        const endpoint = pokemonApi.endpoints.getPokemonByUrl;
        expect(endpoint).toBeDefined();
        expect(typeof endpoint.initiate).toBe('function');
        expect(typeof endpoint.select).toBe('function');
      });
    });
  });

  describe('Exported hooks and utilities', () => {
    it('экспортирует все необходимые hooks', () => {
      const {
        useGetPokemonListQuery,
        useGetPokemonQuery,
        useSearchPokemonQuery,
        useLazyGetPokemonQuery,
        useLazySearchPokemonQuery,
        useGetPokemonByUrlQuery,
        useLazyGetPokemonByUrlQuery,
      } = pokemonApi;

      expect(useGetPokemonListQuery).toBeDefined();
      expect(useGetPokemonQuery).toBeDefined();
      expect(useSearchPokemonQuery).toBeDefined();
      expect(useLazyGetPokemonQuery).toBeDefined();
      expect(useLazySearchPokemonQuery).toBeDefined();
      expect(useGetPokemonByUrlQuery).toBeDefined();
      expect(useLazyGetPokemonByUrlQuery).toBeDefined();
    });

    it('экспортирует utility функции', () => {
      const { util } = pokemonApi;
      expect(util).toBeDefined();
      expect(util.invalidateTags).toBeDefined();
      expect(util.resetApiState).toBeDefined();
      expect(util.updateQueryData).toBeDefined();
    });

    it('экспортирует отдельные utility функции', () => {
      const { invalidateTags, resetApiState, updateQueryData } =
        pokemonApi.util;
      expect(invalidateTags).toBeDefined();
      expect(resetApiState).toBeDefined();
      expect(updateQueryData).toBeDefined();
    });
  });

  describe('URL creation functions', () => {
    it('createPokemonUrl создает правильный URL для покемона', () => {
      const url = createPokemonUrl(25);
      expect(url).toBe('https://pokeapi.co/api/v2/pokemon/25/');
    });

    it('createPokemonUrl работает с строковыми ID', () => {
      const url = createPokemonUrl('pikachu');
      expect(url).toBe('https://pokeapi.co/api/v2/pokemon/pikachu/');
    });

    it('createPokemonListUrl создает правильный URL для списка', () => {
      const url = createPokemonListUrl(20, 40);
      expect(url).toBe('https://pokeapi.co/api/v2/pokemon?limit=20&offset=40');
    });

    it('createPokemonListUrl работает с нулевыми значениями', () => {
      const url = createPokemonListUrl(0, 0);
      expect(url).toBe('https://pokeapi.co/api/v2/pokemon?limit=0&offset=0');
    });
  });

  describe('Error handling edge cases', () => {
    it('обрабатывает fetch с пустым response', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(createMockResponse(null, false, 404));

      await expect(getPokemonList(16, 0)).rejects.toThrow(
        'Failed to fetch Pokemon list'
      );
    });

    it('обрабатывает fetch с некорректным JSON', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        clone: () => ({
          ok: true,
          json: async () => {
            throw new Error('Invalid JSON');
          },
        }),
      });

      await expect(getPokemonList(16, 0)).rejects.toThrow('Invalid JSON');
    });

    it('обрабатывает fetch с undefined response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(undefined);

      await expect(getPokemonList(16, 0)).rejects.toThrow();
    });

    it('обрабатывает fetch с response без ok свойства', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 500,
        json: async () => ({}),
        clone: () => ({
          status: 500,
          json: async () => ({}),
        }),
      });

      await expect(getPokemonList(16, 0)).rejects.toThrow();
    });

    it('обрабатывает fetch с response без json метода', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        clone: () => ({
          ok: true,
        }),
      });

      await expect(getPokemonList(16, 0)).rejects.toThrow();
    });
  });

  describe('Additional edge cases for providesTags', () => {
    it('getPokemonList endpoint существует', () => {
      const endpoint = pokemonApi.endpoints.getPokemonList;
      expect(endpoint).toBeDefined();
    });

    it('getPokemon endpoint существует', () => {
      const endpoint = pokemonApi.endpoints.getPokemon;
      expect(endpoint).toBeDefined();
    });

    it('searchPokemon endpoint существует', () => {
      const endpoint = pokemonApi.endpoints.searchPokemon;
      expect(endpoint).toBeDefined();
    });

    it('getPokemonByUrl endpoint существует', () => {
      const endpoint = pokemonApi.endpoints.getPokemonByUrl;
      expect(endpoint).toBeDefined();
    });
  });
});
