import { describe, it, expect } from 'vitest';
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

describe('SelectedPokemon', () => {
  it('отображает сообщение когда нет выбранных покемонов', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    expect(screen.getByText('Выбранные покемоны')).toBeInTheDocument();
    expect(screen.getByText('Нет выбранных покемонов')).toBeInTheDocument();
  });

  it('отображает список выбранных покемонов', () => {
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

    expect(screen.getByText('Выбранные покемоны (2)')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('очищает всех покемонов при нажатии кнопки "Очистить все"', () => {
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

    const clearButton = screen.getByText('Очистить все');
    fireEvent.click(clearButton);

    const state = store.getState();
    expect(state.pokemon.selectedPokemons).toHaveLength(0);
  });

  it('отображает кнопку "Очистить все" только когда есть выбранные покемоны', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <SelectedPokemon />
      </Provider>
    );

    expect(screen.queryByText('Очистить все')).not.toBeInTheDocument();
  });
});
