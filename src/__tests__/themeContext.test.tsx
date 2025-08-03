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
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

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

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    cleanup();
  });

  afterAll(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    cleanup();
  });

  it('предоставляет светлую тему по умолчанию', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('загружает сохраненную тему из localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('переключает тему при вызове toggleTheme', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('сохраняет тему в localStorage при переключении', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('применяет тему к document.documentElement', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('выбрасывает ошибку при использовании useTheme вне ThemeProvider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('циклически переключает между светлой и темной темой', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });
});
