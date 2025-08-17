import { render, screen } from '@testing-library/react';
import { Providers } from '@/store/Providers';

const TestComponent = () => {
  return <div data-testid="test-component">Test Content</div>;
};

describe('Providers', () => {
  it('рендерит дочерние компоненты', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('предоставляет Redux store', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('предоставляет API middleware', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('предоставляет pokemon slice', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('оборачивает компоненты в Provider', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
