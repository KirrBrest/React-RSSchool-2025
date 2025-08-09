import { describe, it, expect } from 'vitest';
import { store } from '@/store/store';
import type { RootState, AppDispatch } from '@/store/store';

describe('store', () => {
  it('должен иметь правильную структуру состояния', () => {
    const state = store.getState();
    expect(state).toHaveProperty('pokemon');
    expect(state.pokemon).toHaveProperty('selectedPokemons');
    expect(Array.isArray(state.pokemon.selectedPokemons)).toBe(true);
  });

  it('должен экспортировать правильные типы', () => {
    const mockState: Partial<RootState> = {
      pokemon: {
        selectedPokemons: [],
      },
    };

    expect(mockState).toHaveProperty('pokemon');
    expect(mockState.pokemon).toHaveProperty('selectedPokemons');

    const mockDispatch: AppDispatch = store.dispatch;
    expect(typeof mockDispatch).toBe('function');
  });

  it('должен инициализироваться с пустым состоянием', () => {
    const initialState = store.getState();
    expect(initialState.pokemon.selectedPokemons).toEqual([]);
  });

  it('должен иметь правильную конфигурацию store', () => {
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });
});
