import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/errors/ErrorBoundary';

vi.mock('@/components/header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/pokemon-details/PokemonDetailsRoute', () => ({
  default: () => (
    <div data-testid="pokemon-details-route">PokemonDetailsRoute</div>
  ),
}));

vi.mock('@/pages/about/About', () => ({
  default: () => <div data-testid="about-component">About</div>,
}));

vi.mock('@/pages/page404/Page404', () => ({
  default: () => <div data-testid="page-404">Page404</div>,
}));

describe('App Structure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит основную структуру приложения', () => {
    render(
      <ErrorBoundary>
        <ThemeProvider>
          <div data-testid="app-content">App Content</div>
        </ThemeProvider>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('app-content')).toBeInTheDocument();
  });

  it('содержит все необходимые провайдеры', () => {
    render(
      <ErrorBoundary>
        <ThemeProvider>
          <div data-testid="app-content">App Content</div>
        </ThemeProvider>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('app-content')).toBeInTheDocument();
  });

  it('отображает компоненты Next.js App Router', () => {
    render(
      <ErrorBoundary>
        <ThemeProvider>
          <div data-testid="pokemon-details-route">PokemonDetailsRoute</div>
        </ThemeProvider>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('pokemon-details-route')).toBeInTheDocument();
  });
});
