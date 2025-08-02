import { useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import Search from '@/components/search/Search';
import Searchresult from '@/components/searchresult/Searchresult';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import useLocalStorage from '@/utils/useLocalStorage';
import Button from '@/components/button/Button';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', '');
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();

  const detailsId = searchParams.get('details');
  const isPokemonDetailsOpen = detailsId;

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const throwError = () => {
    setError(true);
  };

  if (error) {
    throw new Error('This is a test error');
  }

  return (
    <ErrorBoundary>
      <div className="home-container">
        <div className="home-content">
          <Search onSearch={handleSearchQuery} />
          <div className="main-content">
            <div
              className={`pokemon-list-section ${
                isPokemonDetailsOpen ? 'with-details' : ''
              }`}
            >
              <Searchresult searchQuery={searchQuery} />
            </div>
            <div
              className={`pokemon-details-section ${
                !isPokemonDetailsOpen ? 'hidden' : ''
              }`}
            >
              <Outlet />
            </div>
          </div>
          <Button onClick={throwError} variant="error">
            Throw Error
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
