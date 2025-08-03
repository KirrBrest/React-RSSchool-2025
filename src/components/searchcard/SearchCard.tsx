import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPokemon, unselectPokemon } from '@/store/pokemonSlice';
import type { PokemonCardProps } from '@/types/interfaces';
import './SearchCard.css';

const PokemonCard = ({ url, name, onSelect }: PokemonCardProps) => {
  const [sprite, setSprite] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const selectedPokemons = useAppSelector(
    (state) => state.pokemon.selectedPokemons
  );

  const pokemonId = url.split('/').filter(Boolean).pop() || '';

  const isSelected = selectedPokemons.some(
    (pokemon) => pokemon.id === pokemonId
  );

  useEffect(() => {
    const fetchSprite = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSprite(data.sprites.front_default);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchSprite();
  }, [url]);

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
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-card error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className={`pokemon-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
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
        <img
          src={sprite || '/placeholder-sprite.png'}
          alt={name}
          className="pokemon-sprite"
        />
        <h3 className="pokemon-name">{name}</h3>
      </div>
    </div>
  );
};

export default PokemonCard;
