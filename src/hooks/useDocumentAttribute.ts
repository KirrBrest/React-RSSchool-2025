import { useEffect } from 'react';

/**
 * Кастомный хук для безопасной работы с атрибутами document.documentElement
 * Инкапсулирует прямые DOM манипуляции
 */
export const useDocumentAttribute = (
  attributeName: string,
  value: string
): void => {
  useEffect(() => {
    document.documentElement.setAttribute(attributeName, value);

    // Cleanup function для удаления атрибута при размонтировании
    return () => {
      document.documentElement.removeAttribute(attributeName);
    };
  }, [attributeName, value]);
};
