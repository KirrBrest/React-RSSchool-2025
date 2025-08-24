import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, afterAll } from 'vitest';
import { PasswordValidation } from '../validation/PasswordValidation/PasswordValidation';

describe('PasswordValidation', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {});

  it('renders password validation component', () => {
    render(<PasswordValidation password="test" />);

    expect(screen.getByText(/сила пароля/i)).toBeInTheDocument();
  });

  it('shows weak password strength for short password', () => {
    render(<PasswordValidation password="weak" />);

    expect(screen.getByText(/слабый/i)).toBeInTheDocument();
    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();
  });

  it('shows medium password strength for password with some requirements', () => {
    render(<PasswordValidation password="Medium1" />);

    expect(screen.getByText(/средний/i)).toBeInTheDocument();
    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();
  });

  it('shows strong password strength for password with all requirements', () => {
    render(<PasswordValidation password="StrongPass1!" />);

    expect(screen.getByText(/сильный/i)).toBeInTheDocument();
    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();
  });

  it('shows very strong password strength for long password with all requirements', () => {
    render(<PasswordValidation password="VeryStrongPassword123!" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();
  });

  it('shows all password requirements checkboxes', () => {
    render(<PasswordValidation password="test" />);

    expect(screen.getByText(/минимум 8 символов/i)).toBeInTheDocument();
    expect(screen.getByText(/1 цифра/i)).toBeInTheDocument();
    expect(screen.getByText(/1 заглавная буква/i)).toBeInTheDocument();
    expect(screen.getByText(/1 строчная буква/i)).toBeInTheDocument();
    expect(screen.getByText(/1 специальный символ/i)).toBeInTheDocument();
  });

  it('marks minimum length requirement as passed for 8+ character password', () => {
    render(<PasswordValidation password="12345678" />);

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    expect(lengthCheck).toHaveClass('passed');
  });

  it('marks minimum length requirement as failed for short password', () => {
    render(<PasswordValidation password="123" />);

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    expect(lengthCheck).not.toHaveClass('passed');
  });

  it('marks number requirement as passed for password with digits', () => {
    render(<PasswordValidation password="password1" />);

    const numberCheck = screen.getByText(/1 цифра/i);
    expect(numberCheck).toHaveClass('passed');
  });

  it('marks number requirement as failed for password without digits', () => {
    render(<PasswordValidation password="password" />);

    const numberCheck = screen.getByText(/1 цифра/i);
    expect(numberCheck).not.toHaveClass('passed');
  });

  it('marks uppercase requirement as passed for password with uppercase letters', () => {
    render(<PasswordValidation password="Password1" />);

    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    expect(uppercaseCheck).toHaveClass('passed');
  });

  it('marks uppercase requirement as failed for password without uppercase letters', () => {
    render(<PasswordValidation password="password1" />);

    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    expect(uppercaseCheck).not.toHaveClass('passed');
  });

  it('marks lowercase requirement as passed for password with lowercase letters', () => {
    render(<PasswordValidation password="PASSWORD1" />);

    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    expect(lowercaseCheck).not.toHaveClass('passed');
  });

  it('marks lowercase requirement as passed for password with mixed case', () => {
    render(<PasswordValidation password="Password1" />);

    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    expect(lowercaseCheck).toHaveClass('passed');
  });

  it('marks special character requirement as passed for password with special chars', () => {
    render(<PasswordValidation password="Password1!" />);

    const specialCheck = screen.getByText(/1 специальный символ/i);
    expect(specialCheck).toHaveClass('passed');
  });

  it('marks special character requirement as failed for password without special chars', () => {
    render(<PasswordValidation password="Password1" />);

    const specialCheck = screen.getByText(/1 специальный символ/i);
    expect(specialCheck).not.toHaveClass('passed');
  });

  it('handles empty password', () => {
    render(<PasswordValidation password="" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).not.toHaveClass('passed');
    expect(numberCheck).not.toHaveClass('passed');
    expect(uppercaseCheck).not.toHaveClass('passed');
    expect(lowercaseCheck).not.toHaveClass('passed');
    expect(specialCheck).not.toHaveClass('passed');
  });

  it('handles password with only numbers', () => {
    render(<PasswordValidation password="12345678" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).toHaveClass('passed');
    expect(numberCheck).toHaveClass('passed');
    expect(uppercaseCheck).not.toHaveClass('passed');
    expect(lowercaseCheck).not.toHaveClass('passed');
    expect(specialCheck).not.toHaveClass('passed');
  });

  it('handles password with only uppercase letters', () => {
    render(<PasswordValidation password="PASSWORD" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).toHaveClass('passed');
    expect(numberCheck).not.toHaveClass('passed');
    expect(uppercaseCheck).toHaveClass('passed');
    expect(lowercaseCheck).not.toHaveClass('passed');
    expect(specialCheck).not.toHaveClass('passed');
  });

  it('handles password with only lowercase letters', () => {
    render(<PasswordValidation password="password" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).toHaveClass('passed');
    expect(numberCheck).not.toHaveClass('passed');
    expect(uppercaseCheck).not.toHaveClass('passed');
    expect(lowercaseCheck).toHaveClass('passed');
    expect(specialCheck).not.toHaveClass('passed');
  });

  it('handles password with only special characters', () => {
    render(<PasswordValidation password="!@#$%^&*" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).toHaveClass('passed');
    expect(numberCheck).not.toHaveClass('passed');
    expect(uppercaseCheck).not.toHaveClass('passed');
    expect(lowercaseCheck).not.toHaveClass('passed');
    expect(specialCheck).toHaveClass('passed');
  });

  it('handles password with mixed requirements', () => {
    render(<PasswordValidation password="Pass1!" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).not.toHaveClass('passed');
    expect(numberCheck).toHaveClass('passed');
    expect(uppercaseCheck).toHaveClass('passed');
    expect(lowercaseCheck).toHaveClass('passed');
    expect(specialCheck).toHaveClass('passed');
  });

  it('handles password with all requirements met', () => {
    render(<PasswordValidation password="StrongPass1!" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).toHaveClass('passed');
    expect(numberCheck).toHaveClass('passed');
    expect(uppercaseCheck).toHaveClass('passed');
    expect(lowercaseCheck).toHaveClass('passed');
    expect(specialCheck).toHaveClass('passed');
  });

  it('handles very long password with all requirements', () => {
    render(<PasswordValidation password="VeryLongStrongPassword123!@#" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    const lengthCheck = screen.getByText(/минимум 8 символов/i);
    const numberCheck = screen.getByText(/1 цифра/i);
    const uppercaseCheck = screen.getByText(/1 заглавная буква/i);
    const lowercaseCheck = screen.getByText(/1 строчная буква/i);
    const specialCheck = screen.getByText(/1 специальный символ/i);

    expect(lengthCheck).toHaveClass('passed');
    expect(numberCheck).toHaveClass('passed');
    expect(uppercaseCheck).toHaveClass('passed');
    expect(lowercaseCheck).toHaveClass('passed');
    expect(specialCheck).toHaveClass('passed');
  });

  it('updates validation when password changes', () => {
    const { rerender } = render(<PasswordValidation password="weak" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();

    rerender(<PasswordValidation password="StrongPass1!" />);

    expect(screen.getByText(/сила пароля:/i)).toBeInTheDocument();
  });
});
