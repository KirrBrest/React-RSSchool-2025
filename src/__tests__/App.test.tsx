import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HashRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '@/App';
import { cleanup } from '@testing-library/react';

vi.mock('@/api', () => ({
  pokemonApi: {
    reducer: vi.fn((state = {}) => state),
    middleware: vi.fn(),
    reducerPath: 'pokemonApi',
  },
}));

vi.mock('@/components/header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/home/Home', () => ({
  default: () => <div data-testid="home-component">Home</div>,
}));

vi.mock('@/components/about/About', () => ({
  default: () => <div data-testid="about-component">About</div>,
}));

vi.mock('@/components/pokemon-details/PokemonDetails', () => ({
  default: () => <div data-testid="pokemon-details">PokemonDetails</div>,
}));

vi.mock('@/components/searchresult/Searchresult', () => ({
  default: () => <div data-testid="search-result">SearchResult</div>,
}));

vi.mock('@/components/searchcard/SearchCard', () => ({
  default: () => <div data-testid="search-card">SearchCard</div>,
}));

vi.mock('@/components/search/Search', () => ({
  default: () => <div data-testid="search">Search</div>,
}));

vi.mock('@/components/selected-pokemon/SelectedPokemon', () => ({
  default: () => <div data-testid="selected-pokemon">SelectedPokemon</div>,
}));

vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

vi.mock('@/components/errors/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

describe('App', () => {
  const mockStore = configureStore({
    reducer: {
      pokemonApi: vi.fn((state = {}) => state),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('рендерит основную структуру приложения', () => {
    render(
      <Provider store={mockStore}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('содержит все необходимые провайдеры', () => {
    render(
      <Provider store={mockStore}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('отображает главную страницу', () => {
    render(
      <Provider store={mockStore}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('search-result')).toBeInTheDocument();
    expect(screen.getByTestId('selected-pokemon')).toBeInTheDocument();
  });
});
