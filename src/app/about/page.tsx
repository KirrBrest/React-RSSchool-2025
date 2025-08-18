import { Suspense } from 'react';
import HeaderClient from '@/components/header/HeaderClient';
import AboutClient from '@/components/about/AboutClient';

export default function AboutPage() {
  return (
    <>
      <HeaderClient />
      <Suspense fallback={<div>Loading...</div>}>
        <AboutClient />
      </Suspense>
    </>
  );
}
