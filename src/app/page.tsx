import { Suspense } from 'react';
import SharedLayout from '@/components/layout/SharedLayout';
import HomeClient from '@/components/home/HomeClient';

export default function HomePage() {
  return (
    <SharedLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeClient />
      </Suspense>
    </SharedLayout>
  );
}
