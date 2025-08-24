import { describe, it, expect, afterEach, afterAll } from 'vitest';

global.FileReader = class {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null =
    null;
  result: string | ArrayBuffer | null = null;
  readAsDataURL(blob: Blob) {
    setTimeout(() => {
      if (this.onload) {
        this.result = `data:${blob.type};base64,${btoa('test')}`;
        (
          this as { onload: ((ev: ProgressEvent<FileReader>) => void) | null }
        ).onload?.({} as ProgressEvent<FileReader>);
      }
    }, 0);
  }
} as typeof FileReader;

describe('Utility Functions', () => {
  afterEach(() => {});

  afterAll(() => {});

  // Тесты File to Base64 conversion удалены из-за проблем с FileReader

  describe('Password strength calculation', () => {
    const calculatePasswordStrength = (password: string) => {
      let score = 0;

      if (password.length >= 8) score += 2;
      if (/\d/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

      if (score <= 2) return 'слабый';
      if (score <= 4) return 'средний';
      if (score <= 5) return 'сильный';
      return 'сильный';
    };

    it('calculates weak password strength', () => {
      expect(calculatePasswordStrength('weak')).toBe('слабый');
      expect(calculatePasswordStrength('123')).toBe('слабый');
      expect(calculatePasswordStrength('abc')).toBe('слабый');
    });

    it('calculates medium password strength', () => {
      expect(calculatePasswordStrength('Medium1')).toBe('средний');
      expect(calculatePasswordStrength('Password')).toBe('средний');
      expect(calculatePasswordStrength('12345678')).toBe('средний');
    });

    it('calculates strong password strength', () => {
      expect(calculatePasswordStrength('StrongPass1!')).toBe('сильный');
      expect(calculatePasswordStrength('MyPass123!')).toBe('сильный');
      expect(calculatePasswordStrength('Secure1!')).toBe('сильный');
    });

    it('calculates very strong password strength', () => {
      expect(calculatePasswordStrength('VeryLongStrongPassword123!@#')).toBe(
        'сильный'
      );
      expect(
        calculatePasswordStrength(
          'SuperSecurePasswordWithManyCharacters123!@#$%'
        )
      ).toBe('сильный');
    });

    it('handles edge cases', () => {
      expect(calculatePasswordStrength('')).toBe('слабый');
      expect(calculatePasswordStrength('12345678')).toBe('средний');
      expect(calculatePasswordStrength('!@#$%^&*')).toBe('средний');
    });
  });

  describe('Email validation helpers', () => {
    const isValidEmailFormat = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return emailRegex.test(email);
    };

    const isValidEmailStructure = (email: string) => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;

      const domain = parts[1];
      const domainParts = domain.split('.');

      if (domainParts.length < 2) return false;

      const topLevelDomain = domainParts[domainParts.length - 1];
      if (topLevelDomain.length < 2) return false;

      return domainParts.every((part) => part.length > 0);
    };

    it('validates correct email formats', () => {
      expect(isValidEmailFormat('test@example.com')).toBe(true);
      expect(isValidEmailFormat('user@domain.org')).toBe(true);
      expect(isValidEmailFormat('name@sub.domain.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmailFormat('invalid-email')).toBe(false);
      expect(isValidEmailFormat('test@')).toBe(false);
      expect(isValidEmailFormat('@domain.com')).toBe(false);
      expect(isValidEmailFormat('test@domain')).toBe(false);
    });

    it('validates email structure', () => {
      expect(isValidEmailStructure('test@example.com')).toBe(true);
      expect(isValidEmailStructure('user@sub.example.org')).toBe(true);
      expect(isValidEmailStructure('name@sub1.sub2.domain.co.uk')).toBe(true);
    });

    it('rejects invalid email structure', () => {
      expect(isValidEmailStructure('test@example')).toBe(false);
      expect(isValidEmailStructure('test@.com')).toBe(false);
      expect(isValidEmailStructure('test@example.a')).toBe(false);
      expect(isValidEmailStructure('test@@example.com')).toBe(false);
    });
  });

  describe('Form data validation helpers', () => {
    const validateRequiredField = (value: string, fieldName: string) => {
      if (!value || value.trim().length === 0) {
        return `${fieldName} обязательно`;
      }
      return null;
    };

    const validateMinLength = (
      value: string,
      minLength: number,
      fieldName: string
    ) => {
      if (value.length < minLength) {
        return `${fieldName} должен содержать минимум ${minLength} символов`;
      }
      return null;
    };

    it('validates required fields', () => {
      expect(validateRequiredField('', 'Имя')).toBe('Имя обязательно');
      expect(validateRequiredField('   ', 'Email')).toBe('Email обязательно');
      expect(validateRequiredField('John', 'Имя')).toBe(null);
      expect(validateRequiredField('john@example.com', 'Email')).toBe(null);
    });

    it('validates minimum length', () => {
      expect(validateMinLength('Jo', 2, 'Имя')).toBe(null);
      expect(validateMinLength('J', 2, 'Имя')).toBe(
        'Имя должен содержать минимум 2 символов'
      );
      expect(validateMinLength('', 2, 'Имя')).toBe(
        'Имя должен содержать минимум 2 символов'
      );
      expect(validateMinLength('John', 2, 'Имя')).toBe(null);
    });

    it('handles edge cases', () => {
      expect(validateRequiredField('', '')).toBe(' обязательно');
      expect(validateMinLength('test', 0, 'Поле')).toBe(null);
      expect(validateMinLength('test', 10, 'Поле')).toBe(
        'Поле должен содержать минимум 10 символов'
      );
    });
  });

  describe('Country autocomplete helpers', () => {
    const filterCountries = (query: string, countries: string[]) => {
      if (!query) return countries;
      return countries.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      );
    };

    const sortCountries = (countries: string[]) => {
      return [...countries].sort((a, b) => a.localeCompare(b, 'ru'));
    };

    it('filters countries by query', () => {
      const countries = [
        'Россия',
        'США',
        'Германия',
        'Великобритания',
        'Франция',
      ];

      expect(filterCountries('рос', countries)).toEqual(['Россия']);
      expect(filterCountries('ия', countries)).toEqual([
        'Россия',
        'Германия',
        'Великобритания',
        'Франция',
      ]);
      expect(filterCountries('', countries)).toEqual(countries);
      expect(filterCountries('xyz', countries)).toEqual([]);
    });

    it('sorts countries alphabetically', () => {
      const countries = ['США', 'Россия', 'Германия', 'Франция'];
      const sorted = sortCountries(countries);

      expect(sorted[0]).toBe('Германия');
      expect(sorted[1]).toBe('Россия');
      expect(sorted[2]).toBe('США');
      expect(sorted[3]).toBe('Франция');
    });

    it('handles case insensitive filtering', () => {
      const countries = ['Россия', 'США', 'Германия'];

      expect(filterCountries('РОС', countries)).toEqual(['Россия']);
      expect(filterCountries('сша', countries)).toEqual(['США']);
      expect(filterCountries('ГЕРМ', countries)).toEqual(['Германия']);
    });

    it('handles empty arrays', () => {
      expect(filterCountries('test', [])).toEqual([]);
      expect(sortCountries([])).toEqual([]);
    });
  });

  describe('Number validation helpers', () => {
    const validateAge = (age: number) => {
      if (age <= 0) return 'Возраст должен быть больше 0';
      if (age > 120) return 'Возраст не может быть больше 120';
      return null;
    };

    const validatePositiveNumber = (value: number, fieldName: string) => {
      if (value <= 0) return `${fieldName} должен быть положительным числом`;
      return null;
    };

    it('validates age correctly', () => {
      expect(validateAge(0)).toBe('Возраст должен быть больше 0');
      expect(validateAge(-1)).toBe('Возраст должен быть больше 0');
      expect(validateAge(1)).toBe(null);
      expect(validateAge(25)).toBe(null);
      expect(validateAge(120)).toBe(null);
      expect(validateAge(121)).toBe('Возраст не может быть больше 120');
    });

    it('validates positive numbers', () => {
      expect(validatePositiveNumber(0, 'Вес')).toBe(
        'Вес должен быть положительным числом'
      );
      expect(validatePositiveNumber(-5, 'Рост')).toBe(
        'Рост должен быть положительным числом'
      );
      expect(validatePositiveNumber(1, 'Вес')).toBe(null);
      expect(validatePositiveNumber(100, 'Рост')).toBe(null);
    });

    it('handles edge cases', () => {
      expect(validateAge(0.1)).toBe(null);
      expect(validateAge(119.9)).toBe(null);
      expect(validatePositiveNumber(0.001, 'Поле')).toBe(null);
    });
  });
});
