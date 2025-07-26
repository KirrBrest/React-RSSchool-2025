import { useState } from 'react';
import Header from '@/components/search/Search';
import Searchresult from '@/components/searchresult/Searchresult';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import useLocalStorage from '@/utils/useLocalStorage';
import Button from '@/components/button/Button';

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
      <Header onSearch={handleSearchQuery} />
      <Searchresult searchQuery={searchQuery} />
      <Button onClick={throwError} variant="error">
        Throw Error
      </Button>
    </ErrorBoundary>
  );
};

export default Home;
