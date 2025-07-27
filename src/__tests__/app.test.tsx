import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import ErrorBoundary from '../components/errors/ErrorBoundary';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
const mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ErrorBoundary>{component}</ErrorBoundary>
    </BrowserRouter>
  );
};

const ThrowError = () => {
  throw new Error('Test error');
};

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит Header компонент', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('рендерит навигационные ссылки в Header', () => {
    renderWithRouter(<App />);
    const homeLink = screen.getByText('Home');
    const aboutLink = screen.getByText('About');
    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });

  it('показывает активное состояние для текущей страницы', () => {
    renderWithRouter(<App />);
    const homeLink = screen.getByText('Home').closest('button');
    expect(homeLink).toHaveClass('active');
  });

  it('рендерит главную страницу по умолчанию', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('ErrorBoundary ловит ошибку в компоненте', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
    error.mockRestore();
  });

  it('Header содержит Pokemon логотип', () => {
    renderWithRouter(<App />);
    const logo = screen.getByText('⚡');
    expect(logo).toBeInTheDocument();
  });

  it('Header содержит правильный заголовок', () => {
    renderWithRouter(<App />);
    const title = screen.getByText('Pokemon Explorer');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });
});
