import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonListResponse, PokemonData } from '@/types/interfaces';
import {
  API_CONFIG,
  // POKEMON_API_BASE_URL,
  createPokemonUrl,
  createPokemonListUrl,
} from './constants';

export { createPokemonUrl, createPokemonListUrl };

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
  }),
  tagTypes: ['Pokemon', 'PokemonList'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<
      PokemonListResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) =>
        `${API_CONFIG.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`,
      providesTags: ['PokemonList'],
    }),
    getPokemon: builder.query<PokemonData, string | number>({
      query: (id) => `${API_CONFIG.ENDPOINTS.POKEMON}/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Pokemon', id }],
    }),
    searchPokemon: builder.query<PokemonData, string>({
      query: (name) =>
        `${API_CONFIG.ENDPOINTS.POKEMON}/${encodeURIComponent(name.toLowerCase())}`,
      providesTags: (_result, _error, name) => [{ type: 'Pokemon', id: name }],
    }),
    getPokemonByUrl: builder.query<PokemonData, string>({
      query: (url) => {
        const id = url.split('/').filter(Boolean).pop();
        return `${API_CONFIG.ENDPOINTS.POKEMON}/${id}`;
      },
      providesTags: (_result, _error, url) => {
        const id = url.split('/').filter(Boolean).pop();
        return [{ type: 'Pokemon', id }];
      },
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonQuery,
  useSearchPokemonQuery,
  useLazyGetPokemonQuery,
  useLazySearchPokemonQuery,
  useGetPokemonByUrlQuery,
  useLazyGetPokemonByUrlQuery,
} = pokemonApi;

export const getPokemonList = async (
  limit: number,
  offset: number
): Promise<PokemonListResponse> => {
  const response = await fetch(createPokemonListUrl(limit, offset));
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
};
