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
import { HomePage } from '../components/HomePage/HomePage';
import { useFormStore } from '../store/formStore';
import type { Control, FieldValues } from 'react-hook-form';

vi.mock('../store/formStore', () => ({
  useFormStore: vi.fn(),
}));

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

vi.mock('../../validation/PasswordValidation/PasswordValidation', () => ({
  PasswordValidation: ({ password }: { password: string }) => (
    <div data-testid="password-validation">{password}</div>
  ),
}));

describe('Integration Tests', () => {
  const mockAddForm = vi.fn();
  const mockCountries = ['Россия', 'США', 'Германия'];

  beforeEach(() => {
    vi.clearAllMocks();
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: [],
      countries: mockCountries,
      addForm: mockAddForm,
    });
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('HomePage and Modal Integration', () => {
    it('opens and closes modal one correctly', async () => {
      render(<HomePage />);
      const modalOneButton = screen.getByText(/модальное окно 1/i);
      fireEvent.click(modalOneButton);

      expect(
        screen.getByText(/неконтролируемыми компонентами/i)
      ).toBeInTheDocument();

      const closeButton = screen.getByRole('button', {
        name: /закрыть модальное окно/i,
      });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/неконтролируемыми компонентами/i)
        ).not.toBeInTheDocument();
      });
    });

    it('opens and closes modal two correctly', async () => {
      render(<HomePage />);

      const modalTwoButton = screen.getByText(/модальное окно 2/i);
      fireEvent.click(modalTwoButton);

      expect(screen.getByText(/контролируемая форма/i)).toBeInTheDocument();

      const closeButton = screen.getByRole('button', {
        name: /закрыть модальное окно/i,
      });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/контролируемая форма/i)
        ).not.toBeInTheDocument();
      });
    });

    it('maintains form state between modal opens', () => {
      render(<HomePage />);

      const modalOneButton = screen.getByText(/модальное окно 1/i);
      fireEvent.click(modalOneButton);

      const nameInput = screen.getByLabelText(/имя/i);
      fireEvent.change(nameInput, { target: { value: 'John' } });

      const closeButton = screen.getByRole('button', {
        name: /закрыть модальное окно/i,
      });
      fireEvent.click(closeButton);

      fireEvent.click(modalOneButton);

      const nameInputAgain = screen.getByLabelText(/имя/i);
      expect(nameInputAgain).toHaveValue('');
    });
  });

  describe('Form Submission Integration', () => {
    it('submits uncontrolled form and adds to store', async () => {
      render(<HomePage />);

      const modalOneButton = screen.getByText(/модальное окно 1/i);
      fireEvent.click(modalOneButton);

      fireEvent.change(screen.getByLabelText(/имя/i), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByLabelText(/возраст/i), {
        target: { value: '25' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(
        document.getElementById('password') as HTMLInputElement,
        {
          target: { value: 'StrongPass1!' },
        }
      );
      fireEvent.change(screen.getByLabelText(/подтвердите пароль/i), {
        target: { value: 'StrongPass1!' },
      });
      fireEvent.click(screen.getByLabelText(/мужской/i));
      fireEvent.change(screen.getByLabelText(/страна/i), {
        target: { value: 'Россия' },
      });
      fireEvent.click(screen.getByLabelText(/я принимаю условия/i));

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
          })
        );
      });
    });

    it('submits controlled form and adds to store', async () => {
      const { useForm } = vi.mocked(await import('react-hook-form'));
      const mockHandleSubmit = vi.fn((onSubmit) => () => {
        onSubmit({
          name: 'Jane',
          age: 30,
          email: 'jane@example.com',
          password: 'AnotherPass1!',
          confirmPassword: 'AnotherPass1!',
          gender: 'female',
          country: 'США',
          acceptTerms: true,
          picture: {},
        });
        return Promise.resolve();
      });

      useForm.mockReturnValue({
        register: vi.fn(),
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {},
          isValid: true,
          isSubmitting: false,
          isDirty: false,
          isLoading: false,
          isSubmitted: false,
          isSubmitSuccessful: false,
          submitCount: 0,
          isValidating: false,
          touchedFields: {},
          dirtyFields: {},
          disabled: false,
          validatingFields: {},
          isReady: true,
        },
        watch: vi.fn(),
        setValue: vi.fn(),
        reset: vi.fn(),
        getValues: vi.fn(),
        getFieldState: vi.fn(),
        setError: vi.fn(),
        clearErrors: vi.fn(),
        trigger: vi.fn(),
        resetField: vi.fn(),
        unregister: vi.fn(),
        setFocus: vi.fn(),
        subscribe: vi.fn(),
        control: {} as Control<FieldValues, unknown, unknown>,
      });

      render(<HomePage />);

      const modalTwoButton = screen.getByText(/модальное окно 2/i);
      fireEvent.click(modalTwoButton);

      const submitButton = screen.getByRole('button', { name: /отправить/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddForm).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Jane',
            age: 30,
            email: 'jane@example.com',
            password: 'AnotherPass1!',
            confirmPassword: 'AnotherPass1!',
            gender: 'female',
            country: 'США',
            acceptTerms: true,
          })
        );
      });
    });

    it('displays submitted forms on home page', async () => {
      const mockForms = [
        {
          name: 'John',
          age: 25,
          email: 'john@example.com',
          password: 'StrongPass1!',
          confirmPassword: 'StrongPass1!',
          gender: 'male' as const,
          country: 'Россия',
          acceptTerms: true,
          picture: { base64: 'data:image/png;base64,test' },
        },
      ];

      (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        forms: mockForms,
        countries: mockCountries,
        addForm: mockAddForm,
      });

      render(<HomePage />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Мужской')).toBeInTheDocument();
      expect(screen.getByText('Россия')).toBeInTheDocument();

      const image = screen.getByAltText(/загруженное изображение/i);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'data:image/png;base64,test');
    });
  });

  describe('Form Validation Integration', () => {
    it('shows validation errors for uncontrolled form', async () => {
      render(<HomePage />);

      const modalOneButton = screen.getByText(/модальное окно 1/i);
      fireEvent.click(modalOneButton);

      const submitButton = screen.getByRole('button', { name: /отправить/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/имя должно начинаться с заглавной буквы/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/возраст должен быть больше 0/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/неверный формат email/i)).toBeInTheDocument();
        expect(
          screen.getByText(/необходимо принять условия/i)
        ).toBeInTheDocument();
      });
    });

    it('shows validation errors for controlled form', async () => {
      const { useForm } = vi.mocked(await import('react-hook-form'));
      (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        formState: {
          errors: {
            name: { message: 'Имя обязательно' },
            age: { message: 'Возраст обязателен' },
            email: { message: 'Email обязателен' },
            acceptTerms: { message: 'Необходимо принять условия' },
          },
          isValid: false,
          isSubmitting: false,
        },
        watch: vi.fn(),
        setValue: vi.fn(),
        reset: vi.fn(),
      });

      render(<HomePage />);

      const modalTwoButton = screen.getByText(/модальное окно 2/i);
      fireEvent.click(modalTwoButton);

      expect(screen.getByText(/имя обязательно/i)).toBeInTheDocument();
      expect(screen.getByText(/возраст обязателен/i)).toBeInTheDocument();
      expect(screen.getByText(/email обязателен/i)).toBeInTheDocument();
      expect(
        screen.getByText(/необходимо принять условия/i)
      ).toBeInTheDocument();
    });
  });

  describe('Modal Accessibility Integration', () => {
    it('handles ESC key to close modal', async () => {
      render(<HomePage />);

      const modalOneButton = screen.getByText(/модальное окно 1/i);
      fireEvent.click(modalOneButton);

      expect(
        screen.getByText(/неконтролируемыми компонентами/i)
      ).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(
          screen.queryByText(/неконтролируемыми компонентами/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Flow Integration', () => {
    it('updates home page when new form is submitted', async () => {
      const { rerender } = render(<HomePage />);

      expect(screen.queryByTestId('forms-container')).not.toBeInTheDocument();

      const mockForms = [
        {
          name: 'John',
          age: 25,
          email: 'john@example.com',
          password: 'StrongPass1!',
          confirmPassword: 'StrongPass1!',
          gender: 'male' as const,
          country: 'Россия',
          acceptTerms: true,
          picture: {},
        },
      ];

      (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        forms: mockForms,
        countries: mockCountries,
        addForm: mockAddForm,
      });

      rerender(<HomePage />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('shows new data indication for latest form', async () => {
      const mockForms = [
        {
          name: 'John',
          age: 25,
          email: 'john@example.com',
          password: 'StrongPass1!',
          confirmPassword: 'StrongPass1!',
          gender: 'male' as const,
          country: 'Россия',
          acceptTerms: true,
          picture: {},
        },
      ];

      (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        forms: mockForms,
        countries: mockCountries,
        addForm: mockAddForm,
      });

      render(<HomePage />);

      await waitFor(() => {
        const formCard = screen.getByText('John').closest('.saved-data');
        expect(formCard).toHaveClass('new-data');
      });
    });

    it('handles multiple form submissions correctly', async () => {
      const { rerender } = render(<HomePage />);

      let mockForms: Array<{
        name: string;
        age: number;
        email: string;
        password: string;
        confirmPassword: string;
        gender: 'male' | 'female' | 'other';
        country: string;
        acceptTerms: boolean;
        picture: Record<string, never>;
      }> = [
        {
          name: 'John',
          age: 25,
          email: 'john@example.com',
          password: 'StrongPass1!',
          confirmPassword: 'StrongPass1!',
          gender: 'male',
          country: 'Россия',
          acceptTerms: true,
          picture: {},
        },
      ];

      (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        forms: mockForms,
        countries: mockCountries,
        addForm: mockAddForm,
      });

      rerender(<HomePage />);

      expect(screen.getByText('John')).toBeInTheDocument();

      mockForms = [
        ...mockForms,
        {
          name: 'Jane',
          age: 30,
          email: 'jane@example.com',
          password: 'AnotherPass1!',
          confirmPassword: 'AnotherPass1!',
          gender: 'female' as const,
          country: 'США',
          acceptTerms: true,
          picture: {},
        },
      ];

      (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        forms: mockForms,
        countries: mockCountries,
        addForm: mockAddForm,
      });

      rerender(<HomePage />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });
});
