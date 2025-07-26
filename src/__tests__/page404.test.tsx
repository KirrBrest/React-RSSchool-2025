import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Page404 from '@/pages/page404/Page404';
import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Page404', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит заголовок 404', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('рендерит подзаголовок ошибки', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('рендерит текст описания', () => {
    renderWithRouter(<Page404 />);
    expect(
      screen.getByText('It seems you are lost in the space of the Internet...')
    ).toBeInTheDocument();
  });

  it('рендерит кнопку Back', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('рендерит космонавта', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByText('👨‍🚀')).toBeInTheDocument();
  });

  it('навигация на главную страницу при клике на кнопку Back', () => {
    renderWithRouter(<Page404 />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('имеет правильную структуру контейнера', () => {
    renderWithRouter(<Page404 />);
    const container = screen.getByText('404').closest('.page404__container');
    expect(container).toBeInTheDocument();
  });

  it('имеет правильную структуру контента', () => {
    renderWithRouter(<Page404 />);
    const content = screen.getByText('404').closest('.page404__content');
    expect(content).toBeInTheDocument();
  });
});
