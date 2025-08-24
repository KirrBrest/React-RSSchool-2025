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
import { ControlledForm } from '../components/Forms/ControlledForm';
import { useFormStore } from '../store/formStore';

vi.mock('../store/formStore', () => ({
  useFormStore: vi.fn(),
}));

vi.mock('../validation/PasswordValidation/PasswordValidation', () => ({
  PasswordValidation: ({ password }: { password: string }) => (
    <div data-testid="password-validation">{password}</div>
  ),
}));

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

describe('ControlledForm', () => {
  const mockAddForm = vi.fn();
  const mockOnClose = vi.fn();
  const mockCountries = ['Россия', 'США', 'Германия'];

  const mockUseForm = {
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: {
      errors: {},
      isValid: true,
      isSubmitting: false,
    },
    watch: vi.fn(),
    setValue: vi.fn(),
    reset: vi.fn(),
    getValues: vi.fn(),
    getFieldState: vi.fn(),
    setError: vi.fn(),
    clearErrors: vi.fn(),
    trigger: vi.fn(),
    control: vi.fn(),
  };

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

  it('renders all form fields', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseForm
    );

    render(<ControlledForm onClose={mockOnClose} />);

    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/возраст/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.getElementById('controlled-password')).toBeInTheDocument();
    expect(screen.getByLabelText(/подтвердите пароль/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пол/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/страна/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/фотография/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/я принимаю условия/i)).toBeInTheDocument();
  });

  it('displays country options in datalist', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseForm
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const datalist = screen.getByTestId('controlled-countries');

    expect(datalist).toBeInTheDocument();
    expect(datalist.children).toHaveLength(mockCountries.length);
  });

  it('shows validation errors when form is invalid', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockUseFormWithErrors = {
      ...mockUseForm,
      formState: {
        errors: {
          name: { message: 'Имя обязательно' },
          age: { message: 'Возраст обязателен' },
          email: { message: 'Email обязателен' },
          password: { message: 'Пароль обязателен' },
          confirmPassword: { message: 'Подтвердите пароль' },
          gender: { message: 'Выберите пол' },
          country: { message: 'Выберите страну' },
          acceptTerms: { message: 'Необходимо принять условия' },
        },
        isValid: false,
        isSubmitting: false,
      },
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormWithErrors
    );

    render(<ControlledForm onClose={mockOnClose} />);

    expect(screen.getByText(/имя обязательно/i)).toBeInTheDocument();
    expect(screen.getByText(/возраст обязателен/i)).toBeInTheDocument();
    expect(screen.getByText(/email обязателен/i)).toBeInTheDocument();
    expect(screen.getByText(/пароль обязателен/i)).toBeInTheDocument();
    expect(
      screen.getByText(/подтвердите пароль/i, { selector: '.error-message' })
    ).toBeInTheDocument();
    expect(screen.getByText(/выберите пол/i)).toBeInTheDocument();
    expect(screen.getByText(/выберите страну/i)).toBeInTheDocument();
    expect(screen.getByText(/необходимо принять условия/i)).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockUseFormInvalid = {
      ...mockUseForm,
      formState: {
        errors: { name: { message: 'Error' } },
        isValid: false,
        isSubmitting: false,
      },
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormInvalid
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid and not submitting', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseForm
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('handles file upload correctly', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockSetValue = vi.fn();
    const mockUseFormWithSetValue = {
      ...mockUseForm,
      setValue: mockSetValue,
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormWithSetValue
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/фотография/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockSetValue).toHaveBeenCalledWith('picture', { file });
  });

  it('calls onSubmit when form is submitted', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockHandleSubmit = vi.fn((onSubmit) => onSubmit);
    const mockUseFormWithHandleSubmit = {
      ...mockUseForm,
      handleSubmit: mockHandleSubmit,
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormWithHandleSubmit
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it('registers all form fields', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockRegister = vi.fn();
    const mockUseFormWithRegister = {
      ...mockUseForm,
      register: mockRegister,
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormWithRegister
    );

    render(<ControlledForm onClose={mockOnClose} />);

    expect(mockRegister).toHaveBeenCalledWith('confirmPassword');
    expect(mockRegister).toHaveBeenCalledWith('gender');
    expect(mockRegister).toHaveBeenCalledWith('country');
    expect(mockRegister).toHaveBeenCalledWith('acceptTerms');
  });

  it('handles form submission with valid data', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockHandleSubmit = vi.fn((onSubmit) => {
      onSubmit({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        country: 'Россия',
        acceptTerms: true,
        picture: {
          file: new File(['test'], 'test.png', { type: 'image/png' }),
        },
      });
    });

    const mockUseFormWithSubmit = {
      ...mockUseForm,
      handleSubmit: mockHandleSubmit,
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormWithSubmit
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddForm).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: 25,
          email: 'john@example.com',
          password: 'StrongPass1!',
          confirmPassword: 'StrongPass1!',
          gender: 'male',
          country: 'Россия',
          acceptTerms: true,
          picture: expect.objectContaining({
            file: expect.any(File),
          }),
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles form submission without picture', async () => {
    const { useForm } = vi.mocked(await import('react-hook-form'));
    const mockHandleSubmit = vi.fn((onSubmit) => {
      onSubmit({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        country: 'Россия',
        acceptTerms: true,
        picture: {},
      });
    });

    const mockUseFormWithSubmit = {
      ...mockUseForm,
      handleSubmit: mockHandleSubmit,
    };
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseFormWithSubmit
    );

    render(<ControlledForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /отправить/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddForm).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          age: 25,
          email: 'john@example.com',
          password: 'StrongPass1!',
          confirmPassword: 'StrongPass1!',
          gender: 'male',
          country: 'Россия',
          acceptTerms: true,
          picture: {},
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
