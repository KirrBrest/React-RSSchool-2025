'use client';

import { useEffect } from 'react';

export const useThemeAttribute = (theme: string): void => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--current-theme', theme);

      return () => {
        root.style.removeProperty('--current-theme');
      };
    }
  }, [theme]);
};
