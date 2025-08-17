'use client';

import { ThemeProvider } from './ThemeContext';
import type { ReactNode } from 'react';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
