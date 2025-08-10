import { useEffect } from 'react';

export const useDocumentAttribute = (
  attributeName: string,
  value: string
): void => {
  useEffect(() => {
    document.documentElement.setAttribute(attributeName, value);

    return () => {
      document.documentElement.removeAttribute(attributeName);
    };
  }, [attributeName, value]);
};
