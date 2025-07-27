import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '@/components/search/Search';
import { vi } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    clear: (): void => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Search Component', () => {
  const onSearchMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    onSearchMock.mockClear();
  });

  it('renders search input and button', () => {
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays saved search query from localStorage on mount', () => {
    localStorage.setItem('searchQuery', 'pikachu');
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('pikachu');
  });

  it('shows empty input if no saved term exists', () => {
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates input value when user types', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'charizard' } });
    expect(input).toHaveValue('charizard');
  });

  it('saves search query to localStorage and triggers callback on search', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchQuery')).toBe('bulbasaur');
    expect(onSearchMock).toHaveBeenCalledWith('bulbasaur');
  });

  it('trims spaces from search query before saving', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  charmander  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchQuery')).toBe('charmander');
    expect(onSearchMock).toHaveBeenCalledWith('charmander');
  });

  it('shows error message if search query contains spaces', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'pokemon with space' } });
    fireEvent.click(button);

    expect(
      screen.getByText(/The field must not contain spaces/i)
    ).toBeInTheDocument();
  });
});
