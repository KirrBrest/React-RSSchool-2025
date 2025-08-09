import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonListResponse, PokemonData } from '@/types/interfaces';
import {
  API_CONFIG,
  createPokemonUrl,
  createPokemonListUrl,
} from './constants';

export { createPokemonUrl, createPokemonListUrl };

const cacheMinutesData: number = 60;
const refreshMinutes: number = 30;
const cacheMinutesPokemons: number = 300;
const cacheMinutesPokemonData: number = 600;
const cacheMinutesUnusedData: number = 120;
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
  }),
  tagTypes: ['Pokemon', 'PokemonList', 'Search'],

  keepUnusedDataFor: cacheMinutesData,
  refetchOnMountOrArgChange: refreshMinutes,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getPokemonList: builder.query<
      PokemonListResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) =>
        `${API_CONFIG.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`,
      providesTags: (result, _error, { limit, offset }) => [
        'PokemonList',
        { type: 'PokemonList', id: `${limit}-${offset}` },
        ...(result?.results?.map(({ name }) => ({
          type: 'Pokemon' as const,
          id: name,
        })) || []),
      ],
      keepUnusedDataFor: cacheMinutesPokemons,
    }),
    getPokemon: builder.query<PokemonData, string | number>({
      query: (id) => `${API_CONFIG.ENDPOINTS.POKEMON}/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Pokemon', id },
        { type: 'Pokemon', id: 'LIST' },
      ],
      keepUnusedDataFor: cacheMinutesPokemonData,
    }),
    searchPokemon: builder.query<PokemonData, string>({
      query: (name) =>
        `${API_CONFIG.ENDPOINTS.POKEMON}/${encodeURIComponent(name.toLowerCase())}`,
      providesTags: (_result, _error, name) => [
        { type: 'Pokemon', id: name.toLowerCase() },
        { type: 'Search', id: name.toLowerCase() },
        { type: 'Pokemon', id: 'LIST' },
      ],
      keepUnusedDataFor: cacheMinutesUnusedData,
    }),
    getPokemonByUrl: builder.query<PokemonData, string>({
      query: (url) => {
        const id = url.split('/').filter(Boolean).pop();
        return `${API_CONFIG.ENDPOINTS.POKEMON}/${id}`;
      },
      providesTags: (_result, _error, url) => {
        const id = url.split('/').filter(Boolean).pop();
        return [
          { type: 'Pokemon', id },
          { type: 'Pokemon', id: 'LIST' },
        ];
      },
      keepUnusedDataFor: cacheMinutesPokemonData,
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
  util,
} = pokemonApi;

export const { invalidateTags, resetApiState, updateQueryData } =
  pokemonApi.util;

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
