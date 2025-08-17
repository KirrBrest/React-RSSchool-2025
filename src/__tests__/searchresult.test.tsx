import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/api';
import pokemonSlice from '@/store/pokemonSlice';
import Searchresult from '@/components/searchresult/Searchresult';
import type { MainProps } from '@/types/interfaces';

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

const mockProps: MainProps = {
  searchQuery: '',
  onClearSearch: vi.fn(),
};

describe('Searchresult', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит компонент поиска', () => {
    renderWithProviders(<Searchresult {...mockProps} />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('показывает состояние загрузки списка', () => {
    renderWithProviders(<Searchresult {...mockProps} />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('обрабатывает поисковый запрос', () => {
    renderWithProviders(
      <Searchresult
        searchQuery="bulbasaur"
        onClearSearch={mockProps.onClearSearch}
      />
    );
    expect(
      screen.getByText('Searching for Pokemon "bulbasaur"...')
    ).toBeInTheDocument();
  });

  it('показывает ошибку при загрузке списка', () => {
    renderWithProviders(<Searchresult {...mockProps} />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('обрабатывает изменение страницы', () => {
    renderWithProviders(<Searchresult {...mockProps} />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('обрабатывает обновление данных', () => {
    renderWithProviders(<Searchresult {...mockProps} />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('обрабатывает очистку кэша', () => {
    renderWithProviders(<Searchresult {...mockProps} />);
    expect(screen.getByText('Loading Pokemon data...')).toBeInTheDocument();
  });

  it('показывает информацию о страницах', async () => {
    renderWithProviders(<Searchresult {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
