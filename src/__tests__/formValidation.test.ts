import { describe, it, expect, afterEach, afterAll } from 'vitest';
import {
  formValidation,
  uncontrolledFormSchema,
  controlledFormSchema,
} from '../validation/formValidation';

describe('formValidation', () => {
  afterEach(() => {});

  afterAll(() => {});

  describe('name validation', () => {
    it('validates name with minimum length', () => {
      const result = formValidation.safeParse({
        name: 'Jo',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates name starting with uppercase letter', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for name starting with lowercase letter', () => {
      const result = formValidation.safeParse({
        name: 'john',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Имя должно начинаться с заглавной буквы'
        );
      }
    });

    it('fails validation for name shorter than 2 characters', () => {
      const result = formValidation.safeParse({
        name: 'J',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Имя должно содержать минимум 2 символа'
        );
      }
    });
  });

  describe('age validation', () => {
    it('validates age greater than 0', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 1,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates age at maximum boundary', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 120,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for age 0', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 0,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Возраст должен быть больше 0'
        );
      }
    });

    it('fails validation for age greater than 120', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 121,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Возраст не может быть больше 120'
        );
      }
    });
  });

  describe('email validation', () => {
    it('validates correct email format', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates email with subdomain', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@sub.example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates email with multiple subdomains', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@sub1.sub2.example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for email without @ symbol', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'johnexample.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Неверный формат email');
      }
    });

    it('fails validation for email with multiple @ symbols', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example@domain.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Неверный формат email');
      }
    });

    it('fails validation for email with single-level domain', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Неверный формат email');
      }
    });

    it('fails validation for email with TLD shorter than 2 characters', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.a',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Неверный формат email');
      }
    });

    it('fails validation for email with empty domain parts', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@.example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Неверный формат email');
      }
    });
  });

  describe('password validation', () => {
    it('validates password with all requirements met', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for password shorter than 8 characters', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'Pass1!',
        confirmPassword: 'Pass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Пароль должен содержать минимум 8 символов'
        );
      }
    });

    it('fails validation for password without numbers', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass!',
        confirmPassword: 'StrongPass!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Пароль должен содержать минимум 1 цифру'
        );
      }
    });

    it('fails validation for password without uppercase letters', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'strongpass1!',
        confirmPassword: 'strongpass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Пароль должен содержать минимум 1 заглавную букву'
        );
      }
    });

    it('fails validation for password without lowercase letters', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'STRONGPASS1!',
        confirmPassword: 'STRONGPASS1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Пароль должен содержать минимум 1 строчную букву'
        );
      }
    });

    it('fails validation for password without special characters', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1',
        confirmPassword: 'StrongPass1',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Пароль должен содержать минимум 1 специальный символ'
        );
      }
    });
  });

  describe('confirmPassword validation', () => {
    it('validates matching passwords', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for non-matching passwords', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'DifferentPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Пароли не совпадают');
      }
    });

    it('fails validation for empty confirmPassword', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: '',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Подтвердите пароль');
      }
    });
  });

  describe('gender validation', () => {
    it('validates male gender', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates female gender', () => {
      const result = formValidation.safeParse({
        name: 'Jane',
        age: 25,
        email: 'jane@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'female',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates other gender', () => {
      const result = formValidation.safeParse({
        name: 'Alex',
        age: 25,
        email: 'alex@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'other',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for invalid gender', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'invalid' as 'male' | 'female' | 'other',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('acceptTerms validation', () => {
    it('validates accepted terms', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for not accepted terms', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: false,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Необходимо принять условия'
        );
      }
    });
  });

  describe('picture validation', () => {
    it('validates picture with valid file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: { file },
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('validates picture without file', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for picture with invalid file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: { file },
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Файл должен быть PNG или JPEG размером не более 5MB'
        );
      }
    });

    it('fails validation for picture with file larger than 5MB', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', {
        type: 'image/png',
      });
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: { file: largeFile },
        country: 'Россия',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Файл должен быть PNG или JPEG размером не более 5MB'
        );
      }
    });
  });

  describe('country validation', () => {
    it('validates non-empty country', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      });

      expect(result.success).toBe(true);
    });

    it('fails validation for empty country', () => {
      const result = formValidation.safeParse({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        acceptTerms: true,
        picture: {},
        country: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Выберите страну');
      }
    });
  });

  describe('schema exports', () => {
    it('exports uncontrolledFormSchema', () => {
      expect(uncontrolledFormSchema).toBeDefined();
      expect(uncontrolledFormSchema).toBe(formValidation);
    });

    it('exports controlledFormSchema', () => {
      expect(controlledFormSchema).toBeDefined();
      expect(controlledFormSchema).toBe(formValidation);
    });
  });

  describe('complete form validation', () => {
    it('validates complete valid form', () => {
      const validForm = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male' as const,
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      };

      const result = formValidation.safeParse(validForm);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validForm);
      }
    });

    it('fails validation for incomplete form', () => {
      const incompleteForm = {
        name: 'John',
        age: 25,
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male' as const,
        acceptTerms: true,
        picture: {},
        country: 'Россия',
      };

      const result = formValidation.safeParse(incompleteForm);

      expect(result.success).toBe(false);
    });

    it('returns multiple validation errors for invalid form', () => {
      const invalidForm = {
        name: 'j',
        age: 0,
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different',
        gender: 'invalid' as 'male' | 'female' | 'other',
        acceptTerms: false,
        picture: {},
        country: '',
      };

      const result = formValidation.safeParse(invalidForm);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });
});
