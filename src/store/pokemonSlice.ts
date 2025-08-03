import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Pokemon {
  id: string;
  name: string;
  url: string;
}

interface PokemonState {
  selectedPokemons: Pokemon[];
}

const initialState: PokemonState = {
  selectedPokemons: [],
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    selectPokemon: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      const exists = state.selectedPokemons.find((p) => p.id === pokemon.id);
      if (!exists) {
        state.selectedPokemons.push(pokemon);
      }
    },
    unselectPokemon: (state, action: PayloadAction<string>) => {
      const pokemonId = action.payload;
      state.selectedPokemons = state.selectedPokemons.filter(
        (pokemon) => pokemon.id !== pokemonId
      );
    },
    clearSelectedPokemons: (state) => {
      state.selectedPokemons = [];
    },
  },
});

export const { selectPokemon, unselectPokemon, clearSelectedPokemons } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
