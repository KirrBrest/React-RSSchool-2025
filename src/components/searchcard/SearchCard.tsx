import type { PokemonCardProps } from '@/types/interfaces';
import { useState, useEffect, useCallback } from 'react';

const PokemonCard = ({ url, name }: PokemonCardProps) => {
  const [sprite, setSprite] = useState<string | null>(null);

  const loadSprite = useCallback(() => {
    setSprite(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.sprites && data.sprites.front_default) {
          setSprite(data.sprites.front_default);
        } else {
          setSprite(null);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setSprite(null);
      });
  }, [url]);

  useEffect(() => {
    loadSprite();
  }, [loadSprite]);

  return (
    <div className="card">
      <h3>{name}</h3>
      {sprite ? <img src={sprite} alt={name} /> : <div>Loading image...</div>}
    </div>
  );
};

export default PokemonCard;
