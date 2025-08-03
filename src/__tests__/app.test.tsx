import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HashRouter } from 'react-router-dom';
import pokemonReducer from '@/store/pokemonSlice';
import App from '@/App';

const createTestStore = () => {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
    },
  });
};

describe('App', () => {
  it('рендерит приложение без ошибок', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    );

    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });
});
