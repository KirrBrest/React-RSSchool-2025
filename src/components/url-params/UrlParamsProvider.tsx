'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { createContext, useContext, ReactNode } from 'react';

interface UrlParamsContextType {
  detailsId: string | null;
  page: number;
  isPokemonDetailsOpen: boolean;
  setDetailsId: (id: string | null) => void;
  setPage: (page: number) => void;
}

const UrlParamsContext = createContext<UrlParamsContextType | undefined>(
  undefined
);

export const useUrlParams = () => {
  const context = useContext(UrlParamsContext);
  if (context === undefined) {
    throw new Error('useUrlParams must be used within a UrlParamsProvider');
  }
  return context;
};

interface UrlParamsProviderProps {
  children: ReactNode;
}

export const UrlParamsProvider = ({ children }: UrlParamsProviderProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const detailsId = searchParams?.get('details') || null;
  const page = Number(searchParams?.get('page')) || 1;

  const setDetailsId = (id: string | null) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    if (id) {
      currentParams.set('details', id);
    } else {
      currentParams.delete('details');
    }
    router.push(`/?${currentParams.toString()}`);
  };

  const setPage = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('page', String(newPage));
    if (detailsId) {
      currentParams.set('details', detailsId);
    }
    router.push(`/?${currentParams.toString()}`);
  };

  const value: UrlParamsContextType = {
    detailsId,
    page,
    isPokemonDetailsOpen: !!detailsId,
    setDetailsId,
    setPage,
  };

  return (
    <UrlParamsContext.Provider value={value}>
      {children}
    </UrlParamsContext.Provider>
  );
};
