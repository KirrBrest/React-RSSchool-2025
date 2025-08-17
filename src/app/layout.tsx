import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Providers } from '@/store/Providers';
import ErrorBoundary from '@/components/errors/ErrorBoundary';

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
        <ErrorBoundary>
          <Providers>
            <ThemeProvider>{children}</ThemeProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
