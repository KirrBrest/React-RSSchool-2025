import { render, screen } from '@testing-library/react';
import ErrorBoundaryWrapper from '@/components/errors/ErrorBoundaryWrapper';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundaryWrapper', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит дочерние компоненты без ошибок', () => {
    render(
      <ErrorBoundaryWrapper>
        <div>Test content</div>
      </ErrorBoundaryWrapper>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('ловит ошибки в дочерних компонентах', () => {
    render(
      <ErrorBoundaryWrapper>
        <ThrowError />
      </ErrorBoundaryWrapper>
    );

    expect(screen.getByText('ERROR')).toBeInTheDocument();
  });

  it('показывает сообщение об ошибке', () => {
    render(
      <ErrorBoundaryWrapper>
        <ThrowError />
      </ErrorBoundaryWrapper>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('показывает кнопку перезагрузки', () => {
    render(
      <ErrorBoundaryWrapper>
        <ThrowError />
      </ErrorBoundaryWrapper>
    );

    const reloadButton = screen.getByRole('button', { name: /try again/i });
    expect(reloadButton).toBeInTheDocument();
  });
});
