import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadPokemonCSV } from '@/utils/csvExport';
import type { Pokemon } from '@/types/interfaces';

describe('csvExport', () => {
  beforeEach(() => {
    const mockLink = {
      download: 'test.csv',
      setAttribute: vi.fn(),
      style: { visibility: 'hidden' },
      click: vi.fn(),
    };

    const mockCreateElement = vi.fn(() => mockLink);
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    const mockCreateObjectURL = vi.fn(() => 'blob:test-url');

    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
      writable: true,
    });

    Object.defineProperty(document.body, 'appendChild', {
      value: mockAppendChild,
      writable: true,
    });

    Object.defineProperty(document.body, 'removeChild', {
      value: mockRemoveChild,
      writable: true,
    });

    Object.defineProperty(URL, 'createObjectURL', {
      value: mockCreateObjectURL,
      writable: true,
    });

    vi.clearAllMocks();
  });

  it('не выполняет скачивание когда список пустой', () => {
    const mockLink = {
      download: undefined,
      setAttribute: vi.fn(),
      style: { visibility: 'hidden' },
      click: vi.fn(),
    };

    const mockCreateElement = vi.fn(() => mockLink);

    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
      writable: true,
    });

    downloadPokemonCSV([]);

    expect(mockCreateElement).not.toHaveBeenCalled();
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

    downloadPokemonCSV(pokemons);

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

    downloadPokemonCSV(pokemons);

    expect(document.createElement).toHaveBeenCalledWith('a');
  });
});
