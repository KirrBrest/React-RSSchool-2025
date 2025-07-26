import type { MainProps } from '@/types/interfaces';
import { useState, useEffect } from 'react';
import PokemonCard from '@/components/searchcard/SearchCard';
import './Searchresult.css';
import processSearchQuery from '@/utils/validation';

const Searchresult = ({ searchQuery }: MainProps) => {
  const [results, setResults] = useState<Array<{ name: string; url: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const query = processSearchQuery(rawQuery);

    setLoading(true);
    setError(null);

    if (query) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Pokemon not found');
          return res.json();
        })
        .then((data) => {
          const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${data.id}/`;
          setResults([{ name: data.name, url: pokemonUrl }]);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=0`)
        .then((res) => {
          if (!res.ok)
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          setResults(data.results);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cards-container">
      {results.length === 0 ? (
        <div>No results</div>
      ) : (
        results.map((item, index) => (
          <PokemonCard key={index} url={item.url} name={item.name} />
        ))
      )}
    </div>
  );
};

export default Searchresult;
