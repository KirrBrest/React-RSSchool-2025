import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UserFormData } from '../../validation/formValidation';
import { controlledFormSchema } from '../../validation/formValidation';
import { useFormStore } from '../../store/formStore';
import { PasswordValidation } from '../../validation/PasswordValidation/PasswordValidation';
import './Forms.css';

interface ControlledFormProps {
  onClose: () => void;
}

export const ControlledForm = ({ onClose }: ControlledFormProps) => {
  const { addForm, countries } = useFormStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(controlledFormSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');
  const pictureFile = watch('picture');

  const onSubmit = async (data: UserFormData) => {
    try {
      if (pictureFile && pictureFile.file) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(pictureFile.file as File);
        });

        const dataWithPicture = {
          ...data,
          picture: { ...data.picture, base64 },
        };
        addForm(dataWithPicture);
      } else {
        addForm(data);
      }

      onClose();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-group">
        <label htmlFor="controlled-name">Имя *</label>
        <input
          type="text"
          id="controlled-name"
          placeholder="Введите имя"
          className={errors.name ? 'error' : ''}
          {...register('name')}
        />
        {errors.name && (
          <div className="error-message">{errors.name.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="controlled-age">Возраст *</label>
        <input
          type="number"
          id="controlled-age"
          min="1"
          max="120"
          placeholder="Введите возраст"
          className={errors.age ? 'error' : ''}
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && (
          <div className="error-message">{errors.age.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="controlled-email">Email *</label>
        <input
          type="email"
          id="controlled-email"
          placeholder="Введите email"
          className={errors.email ? 'error' : ''}
          {...register('email')}
        />
        {errors.email && (
          <div className="error-message">{errors.email.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="controlled-password">Пароль *</label>
        <input
          type="password"
          id="controlled-password"
          placeholder="Введите пароль"
          className={errors.password ? 'error' : ''}
          {...register('password')}
        />
        <PasswordValidation password={password} />
        {errors.password && (
          <div className="error-message">{errors.password.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="controlled-confirmPassword">Подтвердите пароль *</label>
        <input
          type="password"
          id="controlled-confirmPassword"
          placeholder="Подтвердите пароль"
          className={errors.confirmPassword ? 'error' : ''}
          {...register('confirmPassword')}
        />
        {password && watch('confirmPassword', '') && (
          <div
            className={`password-match ${password === watch('confirmPassword', '') ? 'match' : 'no-match'}`}
          >
            {password === watch('confirmPassword', '')
              ? '✓ Пароли совпадают'
              : '✗ Пароли не совпадают'}
          </div>
        )}
        {errors.confirmPassword && (
          <div className="error-message">{errors.confirmPassword.message}</div>
        )}
      </div>

      <div className="form-group">
        <label>Пол *</label>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" value="male" {...register('gender')} />
            Мужской
          </label>
          <label className="radio-label">
            <input type="radio" value="female" {...register('gender')} />
            Женский
          </label>
          <label className="radio-label">
            <input type="radio" value="other" {...register('gender')} />
            Другой
          </label>
        </div>
        {errors.gender && (
          <div className="error-message">{errors.gender.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="controlled-country">Страна *</label>
        <input
          type="text"
          id="controlled-country"
          list="controlled-countries"
          placeholder="Выберите страну"
          className={errors.country ? 'error' : ''}
          {...register('country')}
        />
        <datalist id="controlled-countries">
          {countries.map((country, index) => (
            <option key={index} value={country} />
          ))}
        </datalist>
        {errors.country && (
          <div className="error-message">{errors.country.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="controlled-picture">Фотография</label>
        <input
          type="file"
          id="controlled-picture"
          accept=".png,.jpeg,.jpg"
          className={errors.picture ? 'error' : ''}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setValue('picture', { file });
            }
          }}
        />
        {errors.picture && (
          <div className="error-message">{errors.picture.message}</div>
        )}
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" {...register('acceptTerms')} />Я принимаю
          условия использования *
        </label>
        {errors.acceptTerms && (
          <div className="error-message">{errors.acceptTerms.message}</div>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};
