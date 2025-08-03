import { HashRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import Header from '@/components/header/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <HashRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </HashRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('light');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    cleanup();
  });

  afterAll(() => {
    vi.clearAllMocks();
    localStorage.clear();
    cleanup();
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

  it('рендерит кнопку переключения темы', () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
  });

  it('показывает луну и текст "Dark" в светлой теме', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    renderWithRouter(<Header />);

    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('показывает солнце и текст "Light" в темной теме', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    renderWithRouter(<Header />);

    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
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

  it('кнопка переключения темы кликабельна', () => {
    renderWithRouter(<Header />);
    const themeButton = screen.getByRole('button', { name: /dark/i });
    expect(themeButton).not.toBeDisabled();
  });

  it('вызывает handleHomeClick при клике на кнопку Home', () => {
    renderWithRouter(<Header />);
    const homeButton = screen.getByRole('button', { name: /home/i });

    fireEvent.click(homeButton);

    expect(homeButton).toBeInTheDocument();
  });

  it('вызывает handleAboutClick при клике на кнопку About', () => {
    renderWithRouter(<Header />);
    const aboutButton = screen.getByRole('button', { name: /about/i });

    fireEvent.click(aboutButton);

    expect(aboutButton).toBeInTheDocument();
  });

  it('переключает тему при клике на кнопку темы', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    renderWithRouter(<Header />);

    const themeButton = screen.getByRole('button', { name: /dark/i });
    fireEvent.click(themeButton);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
