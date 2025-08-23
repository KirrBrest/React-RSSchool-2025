import type { UserFormData } from '../validation/formValidation';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface FormState {
  formData: UserFormData | null;
  pictureBase64: string | null;
  countries: string[];

  setFormData: (data: UserFormData) => void;
  setPictureBase64: (base64: string) => void;
  setCountries: (countries: string[]) => void;
  clearFormData: () => void;
}

export interface PasswordStrengthProps {
  password: string;
}
