import { render, screen } from '@testing-library/react';
import App from '../App';
import ErrorBoundary from '../components/errors/ErrorBoundary';
import { vi } from 'vitest';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит инпут поиска, кнопку поиска, кнопку Throw Error и контейнер карточек', async () => {
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /throw error/i })
    ).toBeInTheDocument();

    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });

  it('ErrorBoundary ловит ошибку в простом компоненте', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
    error.mockRestore();
  });
});
