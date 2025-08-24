import { ControlledForm } from '../Forms/ControlledForm';

interface ModalTwoProps {
  onClose: () => void;
}

export const ModalTwo = ({ onClose }: ModalTwoProps) => {
  return (
    <div>
      <h3>Форма с React Hook Form</h3>
      <p>Live validation - валидация в реальном времени</p>
      <ControlledForm onClose={onClose} />
    </div>
  );
};
