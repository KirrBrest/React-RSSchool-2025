import { render, screen, fireEvent } from '@testing-library/react';
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

  it('отображает поле поиска и кнопку', () => {
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('отображает сохраненный поисковый запрос из localStorage при загрузке', () => {
    localStorage.setItem('searchQuery', 'pikachu');
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('pikachu');
  });

  it('показывает пустое поле если нет сохраненного запроса', () => {
    render(<Search onSearch={onSearchMock} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('обновляет значение поля при вводе пользователя', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'charizard' } });
    expect(input).toHaveValue('charizard');
  });

  it('сохраняет поисковый запрос в localStorage и вызывает callback при поиске', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchQuery')).toBe('bulbasaur');
    expect(onSearchMock).toHaveBeenCalledWith('bulbasaur');
  });

  it('убирает пробелы из поискового запроса перед сохранением', () => {
    render(<Search onSearch={onSearchMock} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  charmander  ' } });
    fireEvent.click(button);

    expect(localStorage.getItem('searchQuery')).toBe('charmander');
    expect(onSearchMock).toHaveBeenCalledWith('charmander');
  });

  it('показывает сообщение об ошибке если поисковый запрос содержит пробелы', () => {
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
