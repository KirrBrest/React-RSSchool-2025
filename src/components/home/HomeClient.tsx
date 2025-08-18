'use client';

import { useState, useEffect } from 'react';
import Search from '@/components/search/Search';
import Searchresult from '@/components/searchresult/Searchresult';
import SelectedPokemon from '@/components/selected-pokemon/SelectedPokemon';
import PokemonDetailsRoute from '@/components/pokemon-details/PokemonDetailsRoute';
import useLocalStorage from '@/utils/useLocalStorage';
import Button from '@/components/button/Button';
import {
  UrlParamsProvider,
  useUrlParams,
} from '@/components/url-params/UrlParamsProvider';

const HomeContent = () => {
  const [searchQuery, setSearchQuery, mounted] = useLocalStorage(
    'searchQuery',
    ''
  );
  const [error, setError] = useState(false);
  const { isPokemonDetailsOpen } = useUrlParams();

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
          {isPokemonDetailsOpen && (
            <div className="pokemon-details-section">
              <PokemonDetailsRoute />
            </div>
          )}
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

const HomeClient = () => {
  return (
    <UrlParamsProvider>
      <HomeContent />
    </UrlParamsProvider>
  );
};

export default HomeClient;
