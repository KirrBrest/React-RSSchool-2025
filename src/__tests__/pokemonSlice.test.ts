import { describe, it, expect } from 'vitest';
import pokemonReducer, {
  selectPokemon,
  unselectPokemon,
  clearSelectedPokemons,
} from '@/store/pokemonSlice';

describe('pokemonSlice', () => {
  const initialState = {
    selectedPokemons: [],
  };

  const mockPokemon = {
    id: '1',
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  };

  it('должен возвращать начальное состояние', () => {
    expect(pokemonReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('должен добавлять покемона при выборе', () => {
    const action = selectPokemon(mockPokemon);
    const newState = pokemonReducer(initialState, action);

    expect(newState.selectedPokemons).toHaveLength(1);
    expect(newState.selectedPokemons[0]).toEqual(mockPokemon);
  });

  it('не должен добавлять дубликаты покемонов', () => {
    const stateWithPokemon = {
      selectedPokemons: [mockPokemon],
    };

    const action = selectPokemon(mockPokemon);
    const newState = pokemonReducer(stateWithPokemon, action);

    expect(newState.selectedPokemons).toHaveLength(1);
    expect(newState.selectedPokemons[0]).toEqual(mockPokemon);
  });

  it('должен удалять покемона при отмене выбора', () => {
    const stateWithPokemon = {
      selectedPokemons: [mockPokemon],
    };

    const action = unselectPokemon('1');
    const newState = pokemonReducer(stateWithPokemon, action);

    expect(newState.selectedPokemons).toHaveLength(0);
  });

  it('должен очищать всех выбранных покемонов', () => {
    const stateWithPokemons = {
      selectedPokemons: [
        mockPokemon,
        {
          id: '2',
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/2/',
        },
      ],
    };

    const action = clearSelectedPokemons();
    const newState = pokemonReducer(stateWithPokemons, action);

    expect(newState.selectedPokemons).toHaveLength(0);
  });

  it('должен обрабатывать множественные операции', () => {
    const pokemon2 = {
      id: '2',
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    };
    const pokemon3 = {
      id: '3',
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/',
    };

    let state = pokemonReducer(initialState, selectPokemon(mockPokemon));
    state = pokemonReducer(state, selectPokemon(pokemon2));
    state = pokemonReducer(state, selectPokemon(pokemon3));

    expect(state.selectedPokemons).toHaveLength(3);

    state = pokemonReducer(state, unselectPokemon('2'));

    expect(state.selectedPokemons).toHaveLength(2);
    expect(state.selectedPokemons.find((p) => p.id === '1')).toBeDefined();
    expect(state.selectedPokemons.find((p) => p.id === '3')).toBeDefined();
    expect(state.selectedPokemons.find((p) => p.id === '2')).toBeUndefined();
  });
});
