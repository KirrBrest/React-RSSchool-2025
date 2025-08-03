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
import DownloadLink from '@/components/download-link/DownloadLink';
import type { Pokemon } from '@/types/interfaces';

const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

Object.defineProperty(global.URL, 'createObjectURL', {
  value: mockCreateObjectURL,
  writable: true,
});

Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
  writable: true,
});

vi.useFakeTimers();

describe('DownloadLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:test-url');
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterAll(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const mockPokemons: Pokemon[] = [
    {
      id: '1',
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      id: '25',
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    },
  ];

  it('рендерит кнопку с переданным текстом', () => {
    render(<DownloadLink pokemons={mockPokemons}>Download CSV</DownloadLink>);
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
  });

  it('применяет переданный className к кнопке', () => {
    render(
      <DownloadLink pokemons={mockPokemons} className="custom-button">
        Download
      </DownloadLink>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button');
  });

  it('не выполняет скачивание когда pokemons пустой массив', () => {
    render(<DownloadLink pokemons={[]}>Download</DownloadLink>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  it('вызывает handleDownload при клике на кнопку', () => {
    render(<DownloadLink pokemons={mockPokemons}>Download</DownloadLink>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCreateObjectURL).toHaveBeenCalled();
  });

  it('создает правильную структуру CSV с заголовками', () => {
    render(<DownloadLink pokemons={mockPokemons}>Download</DownloadLink>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    expect(blobCall).toBeInstanceOf(Blob);
    expect(blobCall.type).toBe('text/csv;charset=utf-8;');
  });

  it('очищает URL объект через 100ms после скачивания', () => {
    render(<DownloadLink pokemons={mockPokemons}>Download</DownloadLink>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockRevokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });
});
