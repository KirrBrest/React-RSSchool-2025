export const API_CONFIG = {
  BASE_URL: 'https://pokeapi.co/api/v2/',
  ENDPOINTS: {
    POKEMON: 'pokemon',
    POKEMON_SPECIES: 'pokemon-species',
    TYPE: 'type',
    ABILITY: 'ability',
  },
  DEFAULT_PAGINATION: {
    LIMIT: 12,
    OFFSET: 0,
  },
} as const;

export const createPokemonUrl = (id: string | number): string =>
  `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/${id}/`;

export const createPokemonListUrl = (limit: number, offset: number): string =>
  `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`;

export const POKEMON_API_BASE_URL = API_CONFIG.BASE_URL;
