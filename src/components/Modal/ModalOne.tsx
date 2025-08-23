import { UncontrolledForm } from '../Forms/UncontrolledForm';

export const ModalOne = () => {
  return (
    <div>
      <h3>Форма с неконтролируемыми компонентами</h3>
      <p>Валидация происходит только при отправке формы</p>
      <UncontrolledForm />
    </div>
  );
};
