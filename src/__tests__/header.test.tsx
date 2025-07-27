import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

  it('renders Pokemon logo and title', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows active state for home page', () => {
    mockLocation = { pathname: '/' };
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveClass('active');
  });

  it('shows active state for about page', () => {
    mockLocation = { pathname: '/about' };
    renderWithRouter(<Header />);
    const aboutButton = screen.getByText('About').closest('button');
    expect(aboutButton).toHaveClass('active');
  });

  it('shows no active state for other pages', () => {
    mockLocation = { pathname: '/other' };
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    const aboutButton = screen.getByText('About').closest('button');
    expect(homeButton).not.toHaveClass('active');
    expect(aboutButton).not.toHaveClass('active');
  });

  it('navigates to home page when Home button is clicked', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    if (homeButton) {
      fireEvent.click(homeButton);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }
  });

  it('navigates to about page when About button is clicked', () => {
    renderWithRouter(<Header />);
    const aboutButton = screen.getByText('About').closest('button');
    if (aboutButton) {
      fireEvent.click(aboutButton);
      expect(mockNavigate).toHaveBeenCalledWith('/about');
    }
  });

  it('has correct navigation icons', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('renders header with correct structure', () => {
    renderWithRouter(<Header />);
    const header = screen.getByText('Pokemon Explorer').closest('.header');
    expect(header).toBeInTheDocument();
  });

  it('has correct CSS classes for navigation buttons', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByText('Home').closest('button');
    const aboutButton = screen.getByText('About').closest('button');
    expect(homeButton).toHaveClass('nav-link');
    expect(aboutButton).toHaveClass('nav-link');
  });
});
