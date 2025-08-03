import { HashRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Page404 from '../pages/page404/Page404';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<HashRouter>{component}</HashRouter>);
};

describe('Page404', () => {
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
});
