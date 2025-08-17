'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Search from '@/components/search/Search';
import Searchresult from '@/components/searchresult/Searchresult';
import SelectedPokemon from '@/components/selected-pokemon/SelectedPokemon';
import PokemonDetailsRoute from '@/components/pokemon-details/PokemonDetailsRoute';
import useLocalStorage from '@/utils/useLocalStorage';
import Button from '@/components/button/Button';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery, mounted] = useLocalStorage(
    'searchQuery',
    ''
  );
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();

  const detailsId = searchParams?.get('details');
  const isPokemonDetailsOpen = detailsId;

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClearSearchEvent = () => {
      setSearchQuery('');
    };

    window.addEventListener('clearSearch', handleClearSearchEvent);
    return () => {
      window.removeEventListener('clearSearch', handleClearSearchEvent);
    };
  }, [setSearchQuery]);

  const throwError = () => {
    setError(true);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (error) {
    throw new Error('This is a test error');
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <Search onSearch={handleSearchQuery} />
        <div className="main-content">
          <div
            className={`pokemon-list-section ${
              isPokemonDetailsOpen ? 'with-details' : ''
            }`}
          >
            <Searchresult
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
            />
          </div>
          <div className="pokemon-details-section">
            <PokemonDetailsRoute />
          </div>
        </div>
        <Button
          onClick={throwError}
          variant="error"
          className="throw-error-button"
        >
          Throw Error
        </Button>
      </div>
      <SelectedPokemon />
    </div>
  );
};

export default Home;
