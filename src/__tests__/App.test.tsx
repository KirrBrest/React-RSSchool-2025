import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

vi.mock('../components/HomePage/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">HomePage Component</div>,
}));

vi.mock('./App.css', () => ({}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders App container with correct class', () => {
    render(<App />);
    const appContainer = screen.getByTestId('home-page').closest('.App');
    expect(appContainer).toBeInTheDocument();
    expect(appContainer).toHaveClass('App');
  });

  it('renders HomePage component', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByText('HomePage Component')).toBeInTheDocument();
  });

  it('has correct component structure', () => {
    const { container } = render(<App />);

    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();

    const homePage = appDiv?.querySelector('[data-testid="home-page"]');
    expect(homePage).toBeInTheDocument();
  });

  it('renders exactly one HomePage component', () => {
    render(<App />);
    const homePages = screen.getAllByTestId('home-page');
    expect(homePages).toHaveLength(1);
  });
});
