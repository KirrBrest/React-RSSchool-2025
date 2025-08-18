import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPokemon, unselectPokemon } from '@/store/pokemonSlice';
import { useGetPokemonByUrlQuery } from '@/api';
import type { PokemonCardProps } from '@/types/interfaces';
import './SearchCard.css';

const PokemonCard = ({ url, name, onSelect }: PokemonCardProps) => {
  const dispatch = useAppDispatch();
  const selectedPokemons = useAppSelector(
    (state) => state.pokemon.selectedPokemons
  );

  const pokemonId = url.split('/').filter(Boolean).pop() || '';

  const {
    data: pokemonData,
    error,
    isLoading: loading,
  } = useGetPokemonByUrlQuery(url);

  const isSelected = selectedPokemons.some(
    (pokemon) => pokemon.id === pokemonId
  );

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(pokemonId);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.target.checked) {
      dispatch(selectPokemon({ id: pokemonId, name, url }));
    } else {
      dispatch(unselectPokemon(pokemonId));
    }
  };

  if (loading) {
    return (
      <div className="pokemon-card loading">
        <div className="loading-spinner"></div>
        <p>Loading {name}...</p>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      'data' in error && error.data
        ? String(error.data)
        : 'message' in error
          ? error.message
          : 'Network error';
    return (
      <div className="pokemon-card error">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`pokemon-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="pokemon-checkbox"
        />
      </div>
      <div className="pokemon-info">
        <Image
          src={pokemonData?.sprites?.front_default || '/placeholder-sprite.png'}
          alt={name}
          width={96}
          height={96}
          className="pokemon-sprite"
        />
        <h3 className="pokemon-name">{name}</h3>
      </div>
    </div>
  );
};

export default PokemonCard;
