import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/api';
import pokemonSlice from '@/store/pokemonSlice';
import PokemonDetails from '@/components/pokemon-details/PokemonDetails';

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

describe('PokemonDetails', () => {
  it('рендерит компонент деталей покемона', () => {
    renderWithProviders(<PokemonDetails />);
    expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
  });
});
