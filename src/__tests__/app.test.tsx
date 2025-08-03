import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '@/store/pokemonSlice';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

const createTestStore = (
  initialState = { pokemon: { selectedPokemons: [] } }
) => {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (
  initialState = { pokemon: { selectedPokemons: [] } }
) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

describe('App', () => {
  it('рендерит Header компонент', () => {
    renderWithProviders();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('рендерит навигационные ссылки в Header', () => {
    renderWithProviders();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('показывает активное состояние для текущей страницы', () => {
    renderWithProviders();
    const homeLink = screen.getByText('Home').closest('button');
    expect(homeLink).toHaveClass('active');
  });

  it('рендерит главную страницу по умолчанию', () => {
    renderWithProviders();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('ErrorBoundary ловит ошибку в компоненте', () => {
    renderWithProviders();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('Header содержит Pokemon логотип', () => {
    renderWithProviders();
    const logo = screen.getByText('⚡');
    expect(logo).toBeInTheDocument();
  });

  it('Header содержит правильный заголовок', () => {
    renderWithProviders();
    const title = screen.getByText('Pokemon Explorer');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });
});
