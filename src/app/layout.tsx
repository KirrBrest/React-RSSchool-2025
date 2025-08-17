import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProviderWrapper from '@/contexts/ThemeProviderWrapper';
import { Providers } from '@/store/Providers';
import ErrorBoundaryWrapper from '@/components/errors/ErrorBoundaryWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pokemon App',
  description: 'A Pokemon application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProviderWrapper>
          <ErrorBoundaryWrapper>
            <Providers>{children}</Providers>
          </ErrorBoundaryWrapper>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
