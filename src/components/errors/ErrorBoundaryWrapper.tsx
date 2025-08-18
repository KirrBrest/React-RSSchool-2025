'use client';

import ErrorBoundary from './ErrorBoundary';
import type { ErrorBoundaryProps } from '@/types/interfaces';

const ErrorBoundaryWrapper = ({ children }: ErrorBoundaryProps) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;
