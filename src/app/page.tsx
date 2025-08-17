'use client';

import Header from '@/components/header/Header';
import PokemonDetailsRoute from '@/components/pokemon-details/PokemonDetailsRoute';

export default function HomePage() {
  return (
    <>
      <Header />
      <PokemonDetailsRoute />
    </>
  );
}
