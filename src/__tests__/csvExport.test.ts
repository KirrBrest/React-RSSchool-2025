import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPokemonCSV } from '@/utils/csvExport';
import type { Pokemon } from '@/types/interfaces';

describe('csvExport', () => {
  beforeEach(() => {
    const mockCreateObjectURL = vi.fn(() => 'blob:test-url');

    Object.defineProperty(URL, 'createObjectURL', {
      value: mockCreateObjectURL,
      writable: true,
    });

    vi.clearAllMocks();
  });

  it('не выполняет скачивание когда список пустой', () => {
    const result = createPokemonCSV([]);
    expect(result).toBeNull();
  });

  it('создает правильный CSV контент', () => {
    const pokemons: Pokemon[] = [
      {
        id: '1',
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
      {
        id: '2',
        name: 'ivysaur',
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
      },
    ];

    const mockBlob = vi.fn();
    global.Blob = mockBlob;

    const result = createPokemonCSV(pokemons);

    expect(result).not.toBeNull();
    expect(result?.filename).toBe('2_items.csv');
    expect(mockBlob).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('ID,Name,URL,Details URL'),
        expect.stringContaining(
          '1,bulbasaur,https://pokeapi.co/api/v2/pokemon/1/,https://pokeapi.co/api/v2/pokemon/1/'
        ),
        expect.stringContaining(
          '2,ivysaur,https://pokeapi.co/api/v2/pokemon/2/,https://pokeapi.co/api/v2/pokemon/2/'
        ),
      ]),
      { type: 'text/csv;charset=utf-8;' }
    );
  });

  it('устанавливает правильное имя файла', () => {
    const pokemons: Pokemon[] = [
      {
        id: '1',
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
    ];

    const mockBlob = vi.fn();
    global.Blob = mockBlob;

    const result = createPokemonCSV(pokemons);

    expect(result?.filename).toBe('1_items.csv');
    expect(result?.url).toBe('blob:test-url');
  });
});
