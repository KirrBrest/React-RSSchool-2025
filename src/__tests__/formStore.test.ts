import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useFormStore } from '../store/formStore';
import type { UserFormData } from '../validation/formValidation';

describe('formStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useFormStore());
    act(() => {
      result.current.clearForms();
    });
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {});

  it('initializes with empty forms array', () => {
    const { result } = renderHook(() => useFormStore());

    expect(result.current.forms).toEqual([]);
  });

  it('initializes with countries list', () => {
    const { result } = renderHook(() => useFormStore());

    expect(result.current.countries).toEqual([
      'Беларусь',
      'Россия',
      'США',
      'Китай',
      'Германия',
      'Франция',
      'Великобритания',
      'Япония',
      'Италия',
      'Канада',
      'Бразилия',
      'Австралия',
      'Индия',
      'Испания',
      'Мексика',
      'Южная Корея',
      'Нидерланды',
      'Швейцария',
      'Швеция',
      'Норвегия',
      'Дания',
      'Финляндия',
      'Польша',
      'Чехия',
      'Венгрия',
      'Румыния',
      'Болгария',
      'Греция',
      'Португалия',
      'Ирландия',
      'Бельгия',
      'Австрия',
      'Словакия',
      'Словения',
      'Хорватия',
      'Сербия',
      'Украина',
      'Молдова',
      'Латвия',
      'Литва',
      'Эстония',
    ]);
  });

  it('adds form to forms array', () => {
    const { result } = renderHook(() => useFormStore());

    const mockFormData: UserFormData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(mockFormData);
    });

    expect(result.current.forms).toHaveLength(1);
    expect(result.current.forms[0]).toEqual(mockFormData);
  });

  it('adds multiple forms to forms array', () => {
    const { result } = renderHook(() => useFormStore());

    const mockFormData1: UserFormData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    const mockFormData2: UserFormData = {
      name: 'Jane',
      age: 30,
      email: 'jane@example.com',
      password: 'AnotherPass1!',
      confirmPassword: 'AnotherPass1!',
      gender: 'female',
      country: 'США',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(mockFormData1);
      result.current.addForm(mockFormData2);
    });

    expect(result.current.forms).toHaveLength(2);
    expect(result.current.forms[0]).toEqual(mockFormData1);
    expect(result.current.forms[1]).toEqual(mockFormData2);
  });

  it('adds form with picture data', () => {
    const { result } = renderHook(() => useFormStore());

    const mockFormData: UserFormData = {
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
        base64: 'data:image/png;base64,test',
      },
    };

    act(() => {
      result.current.addForm(mockFormData);
    });

    expect(result.current.forms).toHaveLength(1);
    expect(result.current.forms[0].picture).toEqual({
      file: expect.any(File),
      base64: 'data:image/png;base64,test',
    });
  });

  it('adds form without picture data', () => {
    const { result } = renderHook(() => useFormStore());

    const mockFormData: UserFormData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(mockFormData);
    });

    expect(result.current.forms).toHaveLength(1);
    expect(result.current.forms[0].picture).toEqual({});
  });

  it('clears all forms', () => {
    const { result } = renderHook(() => useFormStore());

    const mockFormData: UserFormData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(mockFormData);
    });

    expect(result.current.forms).toHaveLength(1);

    act(() => {
      result.current.clearForms();
    });

    expect(result.current.forms).toEqual([]);
  });

  it('sets countries list', () => {
    const { result } = renderHook(() => useFormStore());

    const newCountries = ['Новая страна 1', 'Новая страна 2', 'Новая страна 3'];

    act(() => {
      result.current.setCountries(newCountries);
    });

    expect(result.current.countries).toEqual(newCountries);
  });

  it('maintains forms order when adding multiple forms', () => {
    const { result } = renderHook(() => useFormStore());

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
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    }));

    act(() => {
      mockForms.forEach((form) => result.current.addForm(form));
    });

    expect(result.current.forms).toHaveLength(5);
    expect(result.current.forms[0].name).toBe('User1');
    expect(result.current.forms[1].name).toBe('User2');
    expect(result.current.forms[2].name).toBe('User3');
    expect(result.current.forms[3].name).toBe('User4');
    expect(result.current.forms[4].name).toBe('User5');
  });

  it('handles form with all gender types', () => {
    const { result } = renderHook(() => useFormStore());

    const maleForm: UserFormData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    const femaleForm: UserFormData = {
      name: 'Jane',
      age: 30,
      email: 'jane@example.com',
      password: 'AnotherPass1!',
      confirmPassword: 'AnotherPass1!',
      gender: 'female',
      country: 'США',
      acceptTerms: true,
      picture: {},
    };

    const otherForm: UserFormData = {
      name: 'Alex',
      age: 35,
      email: 'alex@example.com',
      password: 'ThirdPass1!',
      confirmPassword: 'ThirdPass1!',
      gender: 'other',
      country: 'Германия',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(maleForm);
      result.current.addForm(femaleForm);
      result.current.addForm(otherForm);
    });

    expect(result.current.forms).toHaveLength(3);
    expect(result.current.forms[0].gender).toBe('male');
    expect(result.current.forms[1].gender).toBe('female');
    expect(result.current.forms[2].gender).toBe('other');
  });

  it('handles form with different age values', () => {
    const { result } = renderHook(() => useFormStore());

    const youngForm: UserFormData = {
      name: 'Young',
      age: 18,
      email: 'young@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    const oldForm: UserFormData = {
      name: 'Old',
      age: 100,
      email: 'old@example.com',
      password: 'AnotherPass1!',
      confirmPassword: 'AnotherPass1!',
      gender: 'female',
      country: 'США',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(youngForm);
      result.current.addForm(oldForm);
    });

    expect(result.current.forms).toHaveLength(2);
    expect(result.current.forms[0].age).toBe(18);
    expect(result.current.forms[1].age).toBe(100);
  });

  it('handles form with different email formats', () => {
    const { result } = renderHook(() => useFormStore());

    const form1: UserFormData = {
      name: 'User1',
      age: 25,
      email: 'user1@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    const form2: UserFormData = {
      name: 'User2',
      age: 30,
      email: 'user2@domain.org',
      password: 'AnotherPass1!',
      confirmPassword: 'AnotherPass1!',
      gender: 'female',
      country: 'США',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(form1);
      result.current.addForm(form2);
    });

    expect(result.current.forms).toHaveLength(2);
    expect(result.current.forms[0].email).toBe('user1@example.com');
    expect(result.current.forms[1].email).toBe('user2@domain.org');
  });

  it('handles form with different password lengths', () => {
    const { result } = renderHook(() => useFormStore());

    const shortPasswordForm: UserFormData = {
      name: 'Short',
      age: 25,
      email: 'short@example.com',
      password: 'Short1!',
      confirmPassword: 'Short1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    const longPasswordForm: UserFormData = {
      name: 'Long',
      age: 30,
      email: 'long@example.com',
      password: 'VeryLongStrongPassword123!@#',
      confirmPassword: 'VeryLongStrongPassword123!@#',
      gender: 'female',
      country: 'США',
      acceptTerms: true,
      picture: {},
    };

    act(() => {
      result.current.addForm(shortPasswordForm);
      result.current.addForm(longPasswordForm);
    });

    expect(result.current.forms).toHaveLength(2);
    expect(result.current.forms[0].password).toBe('Short1!');
    expect(result.current.forms[1].password).toBe(
      'VeryLongStrongPassword123!@#'
    );
  });

  it('handles form with different countries', () => {
    const { result } = renderHook(() => useFormStore());

    const countries = ['Россия', 'США', 'Германия', 'Япония', 'Бразилия'];

    countries.forEach((country, index) => {
      const form: UserFormData = {
        name: `User${index + 1}`,
        age: 20 + index,
        email: `user${index + 1}@example.com`,
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        gender: 'male',
        country,
        acceptTerms: true,
        picture: {},
      };

      act(() => {
        result.current.addForm(form);
      });
    });

    expect(result.current.forms).toHaveLength(5);
    countries.forEach((country, index) => {
      expect(result.current.forms[index].country).toBe(country);
    });
  });

  it('handles form with different acceptTerms values', () => {
    const { result } = renderHook(() => useFormStore());

    const acceptedForm: UserFormData = {
      name: 'Accepted',
      age: 25,
      email: 'accepted@example.com',
      password: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
      gender: 'male',
      country: 'Россия',
      acceptTerms: true,
      picture: {},
    };

    const notAcceptedForm: UserFormData = {
      name: 'NotAccepted',
      age: 30,
      email: 'notaccepted@example.com',
      password: 'AnotherPass1!',
      confirmPassword: 'AnotherPass1!',
      gender: 'female',
      country: 'США',
      acceptTerms: false,
      picture: {},
    };

    act(() => {
      result.current.addForm(acceptedForm);
      result.current.addForm(notAcceptedForm);
    });

    expect(result.current.forms).toHaveLength(2);
    expect(result.current.forms[0].acceptTerms).toBe(true);
    expect(result.current.forms[1].acceptTerms).toBe(false);
  });

  it('maintains data integrity when adding and clearing forms', () => {
    const { result } = renderHook(() => useFormStore());

    const mockFormData: UserFormData = {
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
        base64: 'data:image/png;base64,test',
      },
    };

    act(() => {
      result.current.addForm(mockFormData);
    });

    expect(result.current.forms).toHaveLength(1);
    expect(result.current.forms[0]).toEqual(mockFormData);

    act(() => {
      result.current.clearForms();
    });

    expect(result.current.forms).toEqual([]);

    act(() => {
      result.current.addForm(mockFormData);
    });

    expect(result.current.forms).toHaveLength(1);
    expect(result.current.forms[0]).toEqual(mockFormData);
  });
});
