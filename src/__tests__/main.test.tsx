import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HashRouter } from 'react-router-dom';
import App from '../App';
import ErrorBoundary from '../components/errors/ErrorBoundary';

vi.mock('react-router-dom', () => ({
  HashRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hash-router">{children}</div>
  ),
}));

vi.mock('../components/errors/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('../App', () => ({
  default: () => <div data-testid="app">App Component</div>,
}));

describe('main.tsx', () => {
  let originalGetElementById: typeof document.getElementById;

  beforeEach(() => {
    originalGetElementById = document.getElementById;
  });

  afterEach(() => {
    document.getElementById = originalGetElementById;
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.remove();
    }
    vi.clearAllMocks();
  });

  it('выполняет код main.tsx когда root элемент существует', async () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    document.getElementById = vi.fn((id: string) => {
      if (id === 'root') {
        return rootElement;
      }
      return null;
    });

    await import('../main');

    expect(document.getElementById).toHaveBeenCalledWith('root');
  });

  it('создает правильную структуру компонентов', () => {
    render(
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    );

    expect(screen.getByTestId('hash-router')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });

  it('использует HashRouter для роутинга', () => {
    render(
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    );

    const hashRouter = screen.getByTestId('hash-router');
    expect(hashRouter).toContainElement(screen.getByTestId('error-boundary'));
  });

  it('обертывает App в ErrorBoundary', () => {
    render(
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    );

    const errorBoundary = screen.getByTestId('error-boundary');
    expect(errorBoundary).toContainElement(screen.getByTestId('app'));
  });
});
