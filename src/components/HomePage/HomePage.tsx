import { useState, useEffect } from 'react';
import { Modal } from '../Modal/Modal';
import { ModalOne } from '../Modal/ModalOne';
import { ModalTwo } from '../Modal/ModalTwo';
import { useFormStore } from '../../store/formStore';
import './HomePage.css';

export const HomePage = () => {
  const [isModalOneOpen, setIsModalOneOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [showNewData, setShowNewData] = useState(false);
  const { forms } = useFormStore();

  useEffect(() => {
    if (forms.length > 0) {
      setShowNewData(true);
      const timer = setTimeout(() => {
        setShowNewData(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [forms.length]);

  return (
    <div className="home-page">
      <h1>Главная страница</h1>
      <p>Нажимаем на кнопки ниже, и открываем модальные окна:</p>
      <p>(модалки заполнять латиницей)</p>

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

      {forms.length > 0 && (
        <div className="forms-container">
          {forms.map((formData, index) => (
            <div
              key={index}
              className={`saved-data ${showNewData && index === forms.length - 1 ? 'new-data' : ''}`}
            >
              {formData.picture?.base64 && (
                <div className="picture-preview">
                  <img
                    src={formData.picture.base64}
                    alt="Загруженное изображение"
                  />
                </div>
              )}
              <div className="data-grid">
                <div className="data-item">
                  <strong>Имя:</strong> {formData.name}
                </div>
                <div className="data-item">
                  <strong>Возраст:</strong> {formData.age}
                </div>
                <div className="data-item">
                  <strong>Email:</strong> {formData.email}
                </div>
                <div className="data-item">
                  <strong>Пол:</strong>{' '}
                  {formData.gender === 'male'
                    ? 'Мужской'
                    : formData.gender === 'female'
                      ? 'Женский'
                      : 'Другой'}
                </div>
                <div className="data-item">
                  <strong>Страна:</strong> {formData.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOneOpen}
        onClose={() => setIsModalOneOpen(false)}
        title="Модальное окно 1"
      >
        <ModalOne onClose={() => setIsModalOneOpen(false)} />
      </Modal>

      <Modal
        isOpen={isModalTwoOpen}
        onClose={() => setIsModalTwoOpen(false)}
        title="Модальное окно 2"
      >
        <ModalTwo onClose={() => setIsModalTwoOpen(false)} />
      </Modal>
    </div>
  );
};
