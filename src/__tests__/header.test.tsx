import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import Header from '@/components/header/Header';

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит логотип Pokemon Explorer', () => {
    render(<Header />);
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument();
  });

  it('рендерит иконку покемона', () => {
    render(<Header />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('рендерит ссылку Home', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('рендерит ссылку About', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('рендерит кнопку переключения темы', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
  });

  it('показывает луну и текст "Dark" в светлой теме', () => {
    render(<Header />);
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('ссылка Home имеет правильный href', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('ссылка About имеет правильный href', () => {
    render(<Header />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('кнопка переключения темы кликабельна', () => {
    render(<Header />);
    const themeButton = screen.getByRole('button', { name: /dark/i });
    expect(themeButton).not.toBeDisabled();
  });
});
