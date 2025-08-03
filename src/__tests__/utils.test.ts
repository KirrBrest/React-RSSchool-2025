import { renderHook, act } from '@testing-library/react';
import processSearchQuery from '@/utils/validation';
import useLocalStorage from '@/utils/useLocalStorage';
import { afterEach, afterAll } from 'vitest';

describe('validation utils', () => {
  describe('processSearchQuery', () => {
    it('возвращает обрезанную строку без пробелов', () => {
      expect(processSearchQuery('  pikachu  ')).toBe('pikachu');
    });

    it('возвращает null если строка содержит пробелы', () => {
      expect(processSearchQuery('pokemon with space')).toBeNull();
    });

    it('возвращает пустую строку для пустой строки', () => {
      expect(processSearchQuery('')).toBe('');
    });

    it('возвращает пустую строку для строки только с пробелами', () => {
      expect(processSearchQuery('   ')).toBe('');
    });

    it('обрабатывает специальные символы', () => {
      expect(processSearchQuery('pikachu-123')).toBe('pikachu-123');
    });
  });
});

describe('useLocalStorage hook', () => {
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

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('возвращает начальное значение если localStorage пуст', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('загружает значение из localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('saved value'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('saved value');
  });

  it('обновляет значение в localStorage при изменении', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('testKey')).toBe('new value');
  });

  it('обрабатывает объекты', () => {
    const testObject = { name: 'pikachu', id: 25 };
    const { result } = renderHook(() => useLocalStorage('testKey', testObject));

    act(() => {
      result.current[1]({ name: 'charizard', id: 6 });
    });

    expect(result.current[0]).toEqual({ name: 'charizard', id: 6 });
  });

  it('обрабатывает массивы', () => {
    const testArray = ['pikachu', 'charizard'];
    const { result } = renderHook(() => useLocalStorage('testKey', testArray));

    act(() => {
      result.current[1](['bulbasaur', 'squirtle']);
    });

    expect(result.current[0]).toEqual(['bulbasaur', 'squirtle']);
  });

  it('обрабатывает строки без JSON.parse', () => {
    localStorage.setItem('testKey', 'simple string');
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('simple string');
  });

  it('сохраняет строки без JSON.stringify', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1]('simple string');
    });

    expect(result.current[0]).toBe('simple string');
    expect(localStorage.getItem('testKey')).toBe('simple string');
  });

  it('обрабатывает функцию в setValue', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 5));

    act(() => {
      result.current[1]((prevValue: number) => prevValue + 1);
    });

    expect(result.current[0]).toBe(6);
  });

  it('обрабатывает ошибку при чтении из localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => {
          throw new Error('Storage error');
        },
        setItem: () => {},
        clear: () => {},
      },
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('default');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('обрабатывает ошибку при записи в localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => null,
        setItem: () => {
          throw new Error('Storage error');
        },
        clear: () => {},
      },
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('обрабатывает некорректный JSON в localStorage', () => {
    localStorage.setItem('testKey', 'invalid json {');
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('invalid json {');
  });
});
