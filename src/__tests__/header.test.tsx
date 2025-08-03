import { HashRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/header/Header';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<HashRouter>{component}</HashRouter>);
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит логотип Pokemon Explorer', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('рендерит иконку покемона', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('рендерит кнопку Home', () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  });

  it('рендерит кнопку About', () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();
  });

  it('кнопка Home кликабельна', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).not.toBeDisabled();
  });

  it('кнопка About кликабельна', () => {
    renderWithRouter(<Header />);
    const aboutButton = screen.getByRole('button', { name: /about/i });
    expect(aboutButton).not.toBeDisabled();
  });

  it('вызывает handleHomeClick при клике на кнопку Home', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByRole('button', { name: /home/i });

    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('вызывает handleAboutClick при клике на кнопку About', () => {
    renderWithRouter(<Header />);
    const aboutButton = screen.getByRole('button', { name: /about/i });

    fireEvent.click(aboutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });
});
