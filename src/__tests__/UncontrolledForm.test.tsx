import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import { UncontrolledForm } from '../components/Forms/UncontrolledForm';
import { useFormStore } from '../store/formStore';

vi.mock('../store/formStore', () => ({
  useFormStore: vi.fn(),
}));

vi.mock('../validation/PasswordValidation/PasswordValidation', () => ({
  PasswordValidation: ({ password }: { password: string }) => (
    <div data-testid="password-validation">{password}</div>
  ),
}));

describe('UncontrolledForm', () => {
  const mockAddForm = vi.fn();
  const mockOnClose = vi.fn();
  const mockCountries = ['Россия', 'США', 'Германия'];

  beforeEach(() => {
    vi.clearAllMocks();
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addForm: mockAddForm,
      countries: mockCountries,
    });
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders all form fields', () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/возраст/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.getElementById('password')).toBeInTheDocument();
    expect(screen.getByLabelText(/подтвердите пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пол/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/страна/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/фотография/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/я принимаю условия/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /отправить/i })
    ).toBeInTheDocument();
  });

  it('validates name starts with uppercase letter', async () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/имя/i);
    fireEvent.change(nameInput, { target: { value: 'john' } });

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/имя должно начинаться с заглавной буквы/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password matching', async () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/подтвердите пароль/i);

    fireEvent.change(passwordInput, { target: { value: 'StrongPass1!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'DifferentPass1!' },
    });

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/пароли не совпадают/i)).toBeInTheDocument();
    });
  });
});
