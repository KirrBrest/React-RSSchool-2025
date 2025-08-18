import { Suspense } from 'react';
import SharedLayout from '@/components/layout/SharedLayout';
import AboutClient from '@/components/about/AboutClient';

export default function AboutPage() {
  return (
    <SharedLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <AboutClient />
      </Suspense>
    </SharedLayout>
  );
}
