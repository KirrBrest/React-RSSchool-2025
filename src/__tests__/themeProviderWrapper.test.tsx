import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeProviderWrapper from '@/contexts/ThemeProviderWrapper';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProviderWrapper', () => {
  it('предоставляет контекст темы дочерним компонентам', () => {
    render(
      <ThemeProviderWrapper>
        <TestComponent />
      </ThemeProviderWrapper>
    );

    expect(screen.getByTestId('theme')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  it('инициализирует тему по умолчанию', () => {
    render(
      <ThemeProviderWrapper>
        <TestComponent />
      </ThemeProviderWrapper>
    );

    const themeElement = screen.getByTestId('theme');
    expect(themeElement).toHaveTextContent('light');
  });

  it('переключает тему при клике на кнопку', async () => {
    render(
      <ThemeProviderWrapper>
        <TestComponent />
      </ThemeProviderWrapper>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const themeElement = screen.getByTestId('theme');

    expect(themeElement).toHaveTextContent('light');

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(themeElement).toHaveTextContent('dark');
    });
  });

  it('сохраняет тему в localStorage', () => {
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    render(
      <ThemeProviderWrapper>
        <TestComponent />
      </ThemeProviderWrapper>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    toggleButton.click();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('загружает сохраненную тему из localStorage', () => {
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue('dark'),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    render(
      <ThemeProviderWrapper>
        <TestComponent />
      </ThemeProviderWrapper>
    );

    const themeElement = screen.getByTestId('theme');
    expect(themeElement).toHaveTextContent('dark');
  });
});
