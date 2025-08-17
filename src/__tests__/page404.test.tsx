import { render, screen } from '@testing-library/react';
import Page404 from '@/pages/page404/Page404';

describe('Page404', () => {
  it('рендерит страницу 404', () => {
    render(<Page404 />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('показывает заголовок ошибки', () => {
    render(<Page404 />);
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('показывает описание ошибки', () => {
    render(<Page404 />);
    expect(
      screen.getByText(/It seems you are lost in the space of the Internet/)
    ).toBeInTheDocument();
  });

  it('показывает кнопку назад', () => {
    render(<Page404 />);
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });
});
