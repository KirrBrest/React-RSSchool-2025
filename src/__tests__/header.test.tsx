import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '@/components/header/Header';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
let mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation = { pathname: '/' };
  });

  it('отображает логотип Pokemon и заголовок', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('отображает навигационные ссылки', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('показывает активное состояние для главной страницы', () => {
    mockLocation = { pathname: '/' };
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveClass('active');
  });

  it('показывает активное состояние для страницы About', () => {
    mockLocation = { pathname: '/about' };
    renderWithRouter(<Header />);
    const aboutButton = screen.getByText('About').closest('button');
    expect(aboutButton).toHaveClass('active');
  });

  it('не показывает активное состояние для других страниц', () => {
    mockLocation = { pathname: '/other' };
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    const aboutButton = screen.getByText('About').closest('button');
    expect(homeButton).not.toHaveClass('active');
    expect(aboutButton).not.toHaveClass('active');
  });

  it('переходит на главную страницу при клике на кнопку Home', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    if (homeButton) {
      fireEvent.click(homeButton);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }
  });

  it('переходит на страницу About при клике на кнопку About', () => {
    renderWithRouter(<Header />);
    const aboutButton = screen.getByText('About').closest('button');
    if (aboutButton) {
      fireEvent.click(aboutButton);
      expect(mockNavigate).toHaveBeenCalledWith('/about');
    }
  });

  it('имеет правильные иконки навигации', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('отображает заголовок с правильной структурой', () => {
    renderWithRouter(<Header />);
    const header = screen.getByText('Pokemon Explorer').closest('.header');
    expect(header).toBeInTheDocument();
  });

  it('имеет правильные CSS классы для навигационных кнопок', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    const aboutButton = screen.getByText('About').closest('button');
    expect(homeButton).toHaveClass('nav-link');
    expect(aboutButton).toHaveClass('nav-link');
  });
});
