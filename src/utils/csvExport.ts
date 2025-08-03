import type { Pokemon } from '@/types/interfaces';

export const downloadPokemonCSV = (pokemons: Pokemon[]): void => {
  if (pokemons.length === 0) {
    return;
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
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${pokemons.length}_items.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
