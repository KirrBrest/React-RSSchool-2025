import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Search from '@/components/search/Search';
import Searchresult from '@/components/searchresult/Searchresult';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import useLocalStorage from '@/utils/useLocalStorage';
import Button from '@/components/button/Button';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', '');
  const [error, setError] = useState(false);
  const location = useLocation();
  const isPokemonDetailsOpen = location.pathname.includes('/pokemon/');

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
            {isPokemonDetailsOpen && (
              <div className="pokemon-details-section">
                <Outlet />
              </div>
            )}
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
