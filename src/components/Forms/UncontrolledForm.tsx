import { useRef, useState } from 'react';
import type { UserFormData } from '../../validation/formValidation';
import { uncontrolledFormSchema } from '../../validation/formValidation';
import { useFormStore } from '../../store/formStore';
import { PasswordValidation } from '../../validation/PasswordValidation/PasswordValidation';
import './Forms.css';

export const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setFormData, setPictureBase64, countries } = useFormStore();

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
      const validatedData = uncontrolledFormSchema.parse(data);
      setFormData(validatedData);
      setErrors({});

      const file = formData.get('picture') as File;
      if (file && file.size > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setPictureBase64(base64);
        };
        reader.readAsDataURL(file);
      }

      alert('Форма успешно отправлена!');
    } catch (error) {
      const newErrors: Record<string, string> = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        zodError.errors.forEach((err) => {
          if (err.path && err.path[0]) {
            newErrors[err.path[0]] = err.message;
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
          min="0"
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
        {password && confirmPassword && (
          <div
            className={`password-match ${password === confirmPassword ? 'match' : 'no-match'}`}
          >
            {password === confirmPassword
              ? '✓ Пароли совпадают'
              : '✗ Пароли не совпадают'}
          </div>
        )}
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
