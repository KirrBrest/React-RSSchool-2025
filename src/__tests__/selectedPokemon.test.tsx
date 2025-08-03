import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@/store/pokemonSlice';
import SelectedPokemon from '@/components/selected-pokemon/SelectedPokemon';
import type { RootState } from '@/store/store';

const createTestStore = (
  initialState: Partial<RootState> = { pokemon: { selectedPokemons: [] } }
) => {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
    },
    preloadedState: initialState as RootState,
  });
};

vi.mock('@/utils/csvExport', () => ({
  downloadPokemonCSV: vi.fn(),
}));

describe('SelectedPokemon', () => {
  it('не отображается когда нет выбранных покемонов', () => {
    const store = createTestStore();

    const { container } = render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('отображает количество выбранных элементов', () => {
    const initialState = {
      pokemon: {
        selectedPokemons: [
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
        ],
      },
    };

    const store = createTestStore(initialState);

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    expect(screen.getByText('2 items are selected')).toBeInTheDocument();
  });

  it('отображает правильный текст для одного элемента', () => {
    const initialState = {
      pokemon: {
        selectedPokemons: [
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        ],
      },
    };

    const store = createTestStore(initialState);

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    expect(screen.getByText('1 item is selected')).toBeInTheDocument();
  });

  it('очищает всех покемонов при нажатии кнопки "Unselect all"', () => {
    const initialState = {
      pokemon: {
        selectedPokemons: [
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        ],
      },
    };

    const store = createTestStore(initialState);

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    const unselectButton = screen.getByText('Unselect all');
    fireEvent.click(unselectButton);

    const state = store.getState();
    expect(state.pokemon.selectedPokemons).toHaveLength(0);
  });

  it('вызывает функцию скачивания при нажатии кнопки "Download"', async () => {
    const { downloadPokemonCSV } = await import('@/utils/csvExport');
    const mockDownload = vi.mocked(downloadPokemonCSV);

    const initialState = {
      pokemon: {
        selectedPokemons: [
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        ],
      },
    };

    const store = createTestStore(initialState);

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    expect(mockDownload).toHaveBeenCalledWith(
      initialState.pokemon.selectedPokemons
    );
  });

  it('отображает кнопки "Unselect all" и "Download"', () => {
    const initialState = {
      pokemon: {
        selectedPokemons: [
          {
            id: '1',
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        ],
      },
    };

    const store = createTestStore(initialState);

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
});
