import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Pokemon, PokemonSliceState } from '@/types/interfaces';

const initialState: PokemonSliceState = {
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
