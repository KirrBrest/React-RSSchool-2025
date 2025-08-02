import { useSearchParams } from 'react-router-dom';
import PokemonDetails from './PokemonDetails';

const PokemonDetailsRoute = () => {
  const [searchParams] = useSearchParams();
  const detailsId = searchParams.get('details');

  if (!detailsId) {
    return null;
  }

  return <PokemonDetails pokemonId={detailsId} />;
};

export default PokemonDetailsRoute;
