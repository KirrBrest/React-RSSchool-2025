'use client';

import { useUrlParams } from '@/components/url-params/UrlParamsProvider';
import PokemonDetails from './PokemonDetails';

const PokemonDetailsRoute = () => {
  const { detailsId } = useUrlParams();

  if (!detailsId) {
    return null;
  }

  return <PokemonDetails pokemonId={detailsId} />;
};

export default PokemonDetailsRoute;
