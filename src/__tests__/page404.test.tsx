import { HashRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page404 from '../pages/page404/Page404';

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

describe('Page404', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит заголовок 404', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('рендерит сообщение о том, что страница не найдена', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByText(/oops! page not found/i)).toBeInTheDocument();
  });

  it('рендерит кнопку возврата на главную', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('вызывает navigate при клике на кнопку Back', () => {
    renderWithRouter(<Page404 />);
    const backButton = screen.getByRole('button', { name: /back/i });

    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('рендерит астронавта', () => {
    renderWithRouter(<Page404 />);
    expect(screen.getByText('👨‍🚀')).toBeInTheDocument();
  });

  it('рендерит текст о том, что пользователь заблудился', () => {
    renderWithRouter(<Page404 />);
    expect(
      screen.getByText(/it seems you are lost in the space of the internet/i)
    ).toBeInTheDocument();
  });
});
