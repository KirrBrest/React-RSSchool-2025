import { useState } from 'react';
import Search from '@/components/search/Search';
import Searchresult from '@/components/searchresult/Searchresult';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import useLocalStorage from '@/utils/useLocalStorage';
import Button from '@/components/button/Button';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', '');
  const [error, setError] = useState(false);

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
          <div className="search-section">
            <Searchresult searchQuery={searchQuery} />
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
