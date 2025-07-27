import type { PokemonListResponse } from '@/types/interfaces';

export const getPokemonList = async (
  limit: number,
  offset: number
): Promise<PokemonListResponse> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
};
