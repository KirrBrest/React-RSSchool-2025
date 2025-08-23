import './PasswordValidation.css';

interface PasswordValidationProps {
  password: string;
}

export const PasswordValidation = ({ password }: PasswordValidationProps) => {
  const checks = [
    { label: 'Минимум 8 символов', test: password.length >= 8 },
    { label: '1 цифра', test: /[0-9]/.test(password) },
    { label: '1 заглавная буква', test: /[A-Z]/.test(password) },
    { label: '1 строчная буква', test: /[a-z]/.test(password) },
    {
      label: '1 специальный символ',
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const passedChecks = checks.filter((check) => check.test).length;
  const strength =
    passedChecks < 2 ? 'weak' : passedChecks < 4 ? 'medium' : 'strong';

  return (
    <div className="password-validation">
      <div className="strength-bar">
        <div
          className={`strength-fill ${strength}`}
          style={{ width: `${(passedChecks / 5) * 100}%` }}
        />
      </div>
      <div className="strength-text">
        Сила пароля:{' '}
        <span className={strength}>
          {strength === 'weak'
            ? 'Слабый'
            : strength === 'medium'
              ? 'Средний'
              : 'Сильный'}
        </span>
      </div>
      <div className="checks-list">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`check-item ${check.test ? 'passed' : 'failed'}`}
          >
            <span className="check-icon">{check.test ? '✓' : '✗'}</span>
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
};
