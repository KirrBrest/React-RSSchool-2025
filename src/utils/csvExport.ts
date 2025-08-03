import type { Pokemon } from '@/types/interfaces';

export const createPokemonCSV = (
  pokemons: Pokemon[]
): { url: string; filename: string } | null => {
  if (pokemons.length === 0) {
    return null;
  }

  const headers = ['ID', 'Name', 'URL', 'Details URL'];
  const csvContent = [
    headers.join(','),
    ...pokemons.map((pokemon) =>
      [
        pokemon.id,
        pokemon.name,
        pokemon.url,
        `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  return {
    url,
    filename: `${pokemons.length}_items.csv`,
  };
};
