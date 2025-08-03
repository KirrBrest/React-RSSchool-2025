import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PokemonDetails.css';
import type { PokemonDetailsProps, PokemonData } from '@/types/interfaces';

const PokemonDetails: React.FC<PokemonDetailsProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pokemonId = props.pokemonId;

  const handleClose = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('details');
    const currentPath = searchParams.toString()
      ? `/?${searchParams.toString()}`
      : '/';
    navigate(currentPath);
  };

  const onClose = props.onClose || handleClose;

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!pokemonId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon details');
        }

        const data = await response.json();
        setPokemon(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  const handleCloseClick = () => {
    onClose();
  };

  if (loading) {
    return (
      <div className="pokemon-details-panel">
        <div className="pokemon-details-content">
          <div className="pokemon-details-loading">
            <div className="loading-spinner"></div>
            <p>Loading Pokemon details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-details-panel">
        <div className="pokemon-details-content">
          <div className="pokemon-details-error">
            <h3>Error</h3>
            <p>{error}</p>
            <button className="close-button" onClick={handleCloseClick}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="pokemon-details-panel">
        <div className="pokemon-details-content">
          <div className="pokemon-details-error">
            <h3>Error</h3>
            <p>Pokemon not found</p>
            <button className="close-button" onClick={handleCloseClick}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-details-panel">
      <div className="pokemon-details-content">
        <button
          onClick={handleCloseClick}
          className="close-button"
          aria-label="Close"
        >
          ×
        </button>

        <div className="pokemon-header">
          <h2>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h2>
          <p>#{pokemon.id.toString().padStart(3, '0')}</p>
        </div>

        <div className="pokemon-images">
          <div className="image-row">
            <div className="image-container">
              <img
                src={pokemon.sprites.front_default}
                alt={`${pokemon.name} front`}
              />
              <span>Front</span>
            </div>
            <div className="image-container">
              <img
                src={pokemon.sprites.back_default}
                alt={`${pokemon.name} back`}
              />
              <span>Back</span>
            </div>
          </div>
          <div className="image-row">
            <div className="image-container">
              <img
                src={pokemon.sprites.front_shiny}
                alt={`${pokemon.name} front shiny`}
              />
              <span>Front Shiny</span>
            </div>
            <div className="image-container">
              <img
                src={pokemon.sprites.back_shiny}
                alt={`${pokemon.name} back shiny`}
              />
              <span>Back Shiny</span>
            </div>
          </div>
        </div>

        <div className="pokemon-info">
          <div className="info-section">
            <h3>Basic Info</h3>
            <div className="info-item">
              <span>Height:</span>
              <span>{pokemon.height / 10}m</span>
            </div>
            <div className="info-item">
              <span>Weight:</span>
              <span>{pokemon.weight / 10}kg</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Types</h3>
            <div className="types-container">
              {pokemon.types.map((type, index) => (
                <span key={index} className="type-badge">
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3>Abilities</h3>
            <div className="abilities-list">
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className="ability-item">
                  <span>{ability.ability.name}</span>
                  {ability.is_hidden && (
                    <span className="hidden-badge">Hidden</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3>Stats</h3>
            <div className="stats-container">
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span>{stat.stat.name}:</span>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${(stat.base_stat / 255) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span>{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
