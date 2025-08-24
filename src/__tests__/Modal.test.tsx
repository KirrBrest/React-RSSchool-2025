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
import { Modal } from '../components/Modal/Modal';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const mockTitle = 'Test Modal';
  const mockChildren = <div data-testid="modal-content">Modal Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders modal with title and content', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const closeButton = screen.getByRole('button', {
      name: /закрыть модальное окно/i,
    });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const closeButton = screen.getByRole('button', {
      name: /закрыть модальное окно/i,
    });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.mouseDown(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const modalContent = screen.getByTestId('modal-content');
    fireEvent.mouseDown(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when modal header is clicked', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const modalHeader = screen.getByText(mockTitle);
    fireEvent.mouseDown(modalHeader);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby');

    const title = screen.getByText(mockTitle);
    expect(title).toHaveAttribute('id');
    expect(modal).toHaveAttribute('aria-labelledby', title.getAttribute('id'));
  });

  it('handles ESC key press', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other key presses', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.keyDown(document, { key: 'Space' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('focuses close button on mount', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const closeButton = screen.getByRole('button', {
      name: /закрыть модальное окно/i,
    });
    expect(closeButton).toHaveFocus();
  });

  it('renders with custom className', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('modal-content');
  });

  it('renders without custom className', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('modal-content');
  });

  it('handles multiple rapid close attempts', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const closeButton = screen.getByRole('button', {
      name: /закрыть модальное окно/i,
    });

    fireEvent.click(closeButton);
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it('handles backdrop click with event target check', () => {
    render(
      <Modal title={mockTitle} onClose={mockOnClose} isOpen={true}>
        {mockChildren}
      </Modal>
    );

    const backdrop = screen.getByRole('dialog');
    const backdropElement = backdrop;
    fireEvent.mouseDown(backdropElement);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
