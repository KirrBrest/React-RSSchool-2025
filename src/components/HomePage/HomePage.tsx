import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { ModalOne } from '../Modal/ModalOne';
import { ModalTwo } from '../Modal/ModalTwo';
import './HomePage.css';

export const HomePage = () => {
  const [isModalOneOpen, setIsModalOneOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);

  return (
    <div className="home-page">
      <h1>Главная страница</h1>
      <p>Нажимаем на кнопки ниже, и открываем модальные окна:</p>

      <div className="button-container">
        <button
          className="modal-button"
          onClick={() => setIsModalOneOpen(true)}
        >
          Открыть модальное окно 1
        </button>

        <button
          className="modal-button"
          onClick={() => setIsModalTwoOpen(true)}
        >
          Открыть модальное окно 2
        </button>
      </div>

      <Modal
        isOpen={isModalOneOpen}
        onClose={() => setIsModalOneOpen(false)}
        title="Модальное окно 1"
      >
        <ModalOne />
      </Modal>

      <Modal
        isOpen={isModalTwoOpen}
        onClose={() => setIsModalTwoOpen(false)}
        title="Модальное окно 2"
      >
        <ModalTwo />
      </Modal>
    </div>
  );
};
