import { Suspense } from 'react';
import HeaderClient from '@/components/header/HeaderClient';
import HomeClient from '@/components/home/HomeClient';

export default function HomePage() {
  return (
    <>
      <HeaderClient />
      <Suspense fallback={<div>Loading...</div>}>
        <HomeClient />
      </Suspense>
    </>
  );
}
