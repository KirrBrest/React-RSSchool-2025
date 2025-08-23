import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .regex(/[0-9]/, 'Пароль должен содержать минимум 1 цифру')
  .regex(/[A-Z]/, 'Пароль должен содержать минимум 1 заглавную букву')
  .regex(/[a-z]/, 'Пароль должен содержать минимум 1 строчную букву')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Пароль должен содержать минимум 1 специальный символ'
  );

const imageSchema = z
  .object({
    file: z.instanceof(File).optional(),
    base64: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.file) return true;
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const quantityMb = 5;
      const maxSize = quantityMb * 1024 * 1024;
      return validTypes.includes(data.file.type) && data.file.size <= maxSize;
    },
    {
      message: 'Файл должен быть PNG или JPEG размером не более 5MB',
    }
  );

export const formValidation = z
  .object({
    name: z
      .string()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .regex(/^[A-Z]/, 'Имя должно начинаться с заглавной буквы'),

    age: z
      .number()
      .min(0, 'Возраст не может быть отрицательным')
      .max(120, 'Возраст не может быть больше 120'),

    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Неверный формат email')
      .refine(
        (email) => {
          const parts = email.split('@');
          if (parts.length !== 2) return false;
          const domain = parts[1];
          const domainParts = domain.split('.');

          if (domainParts.length < 2) return false;

          const topLevelDomain = domainParts[domainParts.length - 1];
          if (topLevelDomain.length < 2) return false;

          return domainParts.every((part) => part.length > 0);
        },
        { message: 'Неверный формат email' }
      ),

    password: passwordSchema,

    confirmPassword: z.string(),

    gender: z.enum(['male', 'female', 'other']),

    acceptTerms: z
      .boolean()
      .refine((val) => val === true, 'Необходимо принять условия'),

    picture: imageSchema,

    country: z.string().min(1, 'Выберите страну'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    }
  );

export type UserFormData = z.infer<typeof formValidation>;

export const uncontrolledFormSchema = formValidation;

export const controlledFormSchema = formValidation;
