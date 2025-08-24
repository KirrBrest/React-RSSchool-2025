import { useRef, useState } from 'react';
import type { UserFormData } from '../../validation/formValidation';
import { uncontrolledFormSchema } from '../../validation/formValidation';
import { useFormStore } from '../../store/formStore';
import { PasswordValidation } from '../../validation/PasswordValidation/PasswordValidation';
import './Forms.css';

interface UncontrolledFormProps {
  onClose: () => void;
}

export const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addForm, countries } = useFormStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data: Partial<UserFormData> = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      acceptTerms: formData.get('acceptTerms') === 'on',
      country: formData.get('country') as string,
      picture: { file: formData.get('picture') as File },
    };

    try {
      const result = uncontrolledFormSchema.safeParse(data);

      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            const fieldName = String(issue.path[0]);
            newErrors[fieldName] = issue.message;
          }
        });

        if (
          data.password &&
          data.confirmPassword &&
          data.password !== data.confirmPassword
        ) {
          if (newErrors.confirmPassword) {
            newErrors.confirmPassword = `${newErrors.confirmPassword}. Пароли не совпадают`;
          } else {
            newErrors.confirmPassword = 'Пароли не совпадают';
          }
        }

        setErrors(newErrors);
        return;
      }

      const validatedData = result.data;
      setErrors({});

      const file = formData.get('picture') as File;
      if (file && file.size > 0) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });

        const dataWithPicture = {
          ...validatedData,
          picture: { ...validatedData.picture, base64 },
        };
        addForm(dataWithPicture);
      } else {
        addForm(validatedData);
      }

      onClose();
    } catch (error) {
      const newErrors: Record<string, string> = {};

      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as {
          issues: Array<{ path: string[]; message: string }>;
        };
        zodError.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            const fieldName = String(issue.path[0]);
            newErrors[fieldName] = issue.message;
          }
        });
      }

      setErrors(newErrors);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="name">Имя *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Введите имя"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="age">Возраст *</label>
        <input
          type="number"
          id="age"
          name="age"
          min="1"
          max="120"
          placeholder="Введите возраст"
          className={errors.age ? 'error' : ''}
        />
        {errors.age && <div className="error-message">{errors.age}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Введите email"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль *</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? 'error' : ''}
        />
        <PasswordValidation password={password} />
        {errors.password && (
          <div className="error-message">{errors.password}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Подтвердите пароль *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={errors.confirmPassword ? 'error' : ''}
        />

        {errors.confirmPassword && (
          <div className="error-message">{errors.confirmPassword}</div>
        )}
      </div>

      <div className="form-group">
        <label>Пол *</label>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="gender" value="male" />
            Мужской
          </label>
          <label className="radio-label">
            <input type="radio" name="gender" value="female" />
            Женский
          </label>
          <label className="radio-label">
            <input type="radio" name="gender" value="other" />
            Другой
          </label>
        </div>
        {errors.gender && <div className="error-message">{errors.gender}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="country">Страна *</label>
        <input
          type="text"
          id="country"
          name="country"
          list="countries"
          placeholder="Выберите страну"
          className={errors.country ? 'error' : ''}
        />
        <datalist id="countries">
          {countries.map((country, index) => (
            <option key={index} value={country} />
          ))}
        </datalist>
        {errors.country && (
          <div className="error-message">{errors.country}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="picture">Фотография</label>
        <input
          type="file"
          id="picture"
          name="picture"
          accept=".png,.jpeg,.jpg"
          className={errors.picture ? 'error' : ''}
        />
        {errors.picture && (
          <div className="error-message">{errors.picture}</div>
        )}
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" name="acceptTerms" />Я принимаю условия
          использования *
        </label>
        {errors.acceptTerms && (
          <div className="error-message">{errors.acceptTerms}</div>
        )}
      </div>

      <button type="submit" className="submit-button">
        Отправить
      </button>
    </form>
  );
};
