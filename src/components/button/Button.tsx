import type { ButtonProps } from '@/types/interfaces';
import './Button.css';

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary',
}: ButtonProps) => {
  const baseClasses = 'button';
  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    error: 'button-error',
  };

  const buttonClasses =
    `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
