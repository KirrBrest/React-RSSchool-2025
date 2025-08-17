import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/api';
import pokemonSlice from '@/store/pokemonSlice';
import Home from '@/pages/home/Home';

vi.mock('@/utils/useLocalStorage', () => ({
  default: () => ['', vi.fn(), true],
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

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

describe('Home', () => {
  it('рендерит главную страницу', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });
});
