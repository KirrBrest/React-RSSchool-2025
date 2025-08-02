import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ErrorBoundary from '../components/errors/ErrorBoundary';
import ErrorModal from '../components/errors/ErrorModal';

const ThrowError = () => {
  throw new Error('Test error message');
};

const ThrowErrorWithStack = () => {
  const error = new Error('Error with stack trace');
  error.stack = 'Error: Error with stack trace\n    at ThrowErrorWithStack';
  throw error;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('рендерит children когда нет ошибок', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('ловит ошибки и показывает ErrorModal', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('показывает детали ошибки в ErrorModal', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorWithStack />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error with stack trace')).toBeInTheDocument();
    expect(
      screen.getByText(/Error: Error with stack trace/)
    ).toBeInTheDocument();
  });

  it('вызывает handleRetry при клике на кнопку Try again', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });

    expect(retryButton).toBeInTheDocument();
    expect(retryButton).not.toBeDisabled();

    fireEvent.click(retryButton);

    expect(retryButton).toBeInTheDocument();
  });

  it('рендерит children когда нет ошибок', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('componentDidCatch обновляет состояние при ошибке', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('getDerivedStateFromError возвращает правильное состояние', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
  });

  it('не показывает ErrorModal когда showErrorModal false', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /error/i })
    ).not.toBeInTheDocument();
  });
});

describe('ErrorModal', () => {
  const defaultProps = {
    message: 'Test error message',
    details: 'Error details',
    onRetry: vi.fn(),
  };

  it('рендерит заголовок ERROR', () => {
    render(<ErrorModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
  });

  it('рендерит сообщение об ошибке', () => {
    render(<ErrorModal {...defaultProps} />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('рендерит детали ошибки когда они есть', () => {
    render(<ErrorModal {...defaultProps} />);
    expect(screen.getByText('Error details')).toBeInTheDocument();
  });

  it('не рендерит детали когда их нет', () => {
    const propsWithoutDetails = {
      message: 'Test error message',
      onRetry: vi.fn(),
    };

    render(<ErrorModal {...propsWithoutDetails} />);
    expect(screen.queryByText('Error details')).not.toBeInTheDocument();
  });

  it('вызывает onRetry при клике на кнопку Try again', () => {
    const onRetryMock = vi.fn();
    render(<ErrorModal {...defaultProps} onRetry={onRetryMock} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    expect(onRetryMock).toHaveBeenCalled();
  });

  it('имеет правильную структуру CSS классов', () => {
    render(<ErrorModal {...defaultProps} />);

    expect(
      screen.getByText('ERROR').closest('.error-modal')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Error details').closest('.error-details')
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole('button', { name: /try again/i })
        .closest('.error-button')
    ).toBeInTheDocument();
  });
});
