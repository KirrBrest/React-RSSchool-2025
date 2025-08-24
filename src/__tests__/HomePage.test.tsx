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

vi.mock('../store/formStore', () => ({
  useFormStore: vi.fn(),
}));

vi.mock('../components/Modal/ModalOne', () => ({
  ModalOne: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="modal-one">
      Modal One
      <button onClick={onClose}>Close Modal One</button>
    </div>
  ),
}));

vi.mock('../components/Modal/ModalTwo', () => ({
  ModalTwo: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="modal-two">
      Modal Two
      <button onClick={onClose}>Close Modal Two</button>
    </div>
  ),
}));

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

describe('HomePage', () => {
  const mockAddForm = vi.fn();
  const mockCountries = ['Россия', 'США', 'Германия'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders main page with buttons', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: [],
      countries: mockCountries,
      addForm: mockAddForm,
    });

    render(<HomePage />);

    expect(screen.getByText(/модальное окно 1/i)).toBeInTheDocument();
    expect(screen.getByText(/модальное окно 2/i)).toBeInTheDocument();
  });

  it('opens modal one when first button is clicked', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: [],
      countries: mockCountries,
      addForm: mockAddForm,
    });

    render(<HomePage />);

    const modalOneButton = screen.getByText(/модальное окно 1/i);
    fireEvent.click(modalOneButton);

    expect(screen.getByTestId('modal-one')).toBeInTheDocument();
  });

  it('opens modal two when second button is clicked', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: [],
      countries: mockCountries,
      addForm: mockAddForm,
    });

    render(<HomePage />);

    const modalTwoButton = screen.getByText(/модальное окно 2/i);
    fireEvent.click(modalTwoButton);

    expect(screen.getByTestId('modal-two')).toBeInTheDocument();
  });

  it('closes modal when onClose is called', async () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: [],
      countries: mockCountries,
      addForm: mockAddForm,
    });

    render(<HomePage />);

    const modalOneButton = screen.getByText(/модальное окно 1/i);
    fireEvent.click(modalOneButton);

    expect(screen.getByTestId('modal-one')).toBeInTheDocument();

    const closeButton = screen.getByText(/close modal one/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal-one')).not.toBeInTheDocument();
    });
  });

  it('displays submitted forms', () => {
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

    render(<HomePage />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Мужской')).toBeInTheDocument();
    expect(screen.getByText('Россия')).toBeInTheDocument();

    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Женский')).toBeInTheDocument();
    expect(screen.getByText('США')).toBeInTheDocument();
  });

  it('displays picture when available', () => {
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

    const image = screen.getByAltText(/загруженное изображение/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'data:image/png;base64,test');
  });

  it('does not display picture when not available', () => {
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

    expect(
      screen.queryByAltText(/загруженное изображение/i)
    ).not.toBeInTheDocument();
  });

  it('shows new data indication for the latest form', async () => {
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

  it('removes new data indication after timeout', async () => {
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

    const formCard = screen.getByText('John').closest('.saved-data');
    expect(formCard).toHaveClass('new-data');
  });

  it('displays gender in Russian', () => {
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
      {
        name: 'Alex',
        age: 35,
        email: 'alex@example.com',
        password: 'ThirdPass1!',
        confirmPassword: 'ThirdPass1!',
        gender: 'other' as const,
        country: 'Германия',
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

    expect(screen.getByText('Мужской')).toBeInTheDocument();
    expect(screen.getByText('Женский')).toBeInTheDocument();
    expect(screen.getByText('Другой')).toBeInTheDocument();
  });

  it('handles empty forms array', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: [],
      countries: mockCountries,
      addForm: mockAddForm,
    });

    render(<HomePage />);

    expect(screen.queryByTestId('forms-container')).not.toBeInTheDocument();
  });

  it('handles multiple forms display', () => {
    const mockForms = Array.from({ length: 5 }, (_, index) => ({
      name: `User${index + 1}`,
      age: 20 + index,
      email: `user${index + 1}@example.com`,
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: (index % 3 === 0
        ? 'male'
        : index % 3 === 1
          ? 'female'
          : 'other') as 'male' | 'female' | 'other',
      country: mockCountries[index % mockCountries.length],
      acceptTerms: true,
      picture: {},
    }));

    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      forms: mockForms,
      countries: mockCountries,
      addForm: mockAddForm,
    });

    render(<HomePage />);

    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
    expect(screen.getByText('User3')).toBeInTheDocument();
    expect(screen.getByText('User4')).toBeInTheDocument();
    expect(screen.getByText('User5')).toBeInTheDocument();
  });

  it('closes modal and shows updated forms', async () => {
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

    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
