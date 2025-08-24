import { UncontrolledForm } from '../Forms/UncontrolledForm';

interface ModalOneProps {
  onClose: () => void;
}

export const ModalOne = ({ onClose }: ModalOneProps) => {
  return (
    <div>
      <h3>Форма с неконтролируемыми компонентами</h3>
      <p>Валидация происходит только при отправке формы</p>
      <UncontrolledForm onClose={onClose} />
    </div>
  );
};
