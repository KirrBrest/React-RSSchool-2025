import { render, screen } from '@testing-library/react';
import About from '@/pages/about/About';

describe('About', () => {
  it('рендерит About страницу', () => {
    render(<About />);
    expect(screen.getByText(/about/i)).toBeInTheDocument();
  });

  it('имеет правильную структуру', () => {
    render(<About />);
    const aboutElement = screen.getByText(/about/i).closest('div');
    expect(aboutElement).toBeInTheDocument();
  });
});
