import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/api';
import pokemonSlice from '@/store/pokemonSlice';
import SearchCard from '@/components/searchcard/SearchCard';
import type { PokemonCardProps } from '@/types/interfaces';

const mockStore = configureStore({
  reducer: {
    pokemon: pokemonSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>);
};

const mockProps: PokemonCardProps = {
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
  name: 'bulbasaur',
  onSelect: vi.fn(),
};

describe('SearchCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит карточку покемона', () => {
    renderWithProviders(<SearchCard {...mockProps} />);
    expect(screen.getByText('Loading bulbasaur...')).toBeInTheDocument();
  });

  it('показывает состояние загрузки', () => {
    renderWithProviders(<SearchCard {...mockProps} />);
    expect(screen.getByText('Loading bulbasaur...')).toBeInTheDocument();
  });
});
