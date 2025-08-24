import type { UserFormData } from '../validation/formValidation';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface FormState {
  forms: UserFormData[];
  countries: string[];

  addForm: (data: UserFormData) => void;
  setCountries: (countries: string[]) => void;
  clearForms: () => void;
}

export interface PasswordStrengthProps {
  password: string;
}
