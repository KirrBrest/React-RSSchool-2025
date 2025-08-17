import type { SearchProps } from '@/types/interfaces';
import React, { useState, useEffect } from 'react';
import './Search.css';
import processSearchQuery from '@/utils/validation';
import Button from '@/components/button/Button';
import useLocalStorage from '@/utils/useLocalStorage';

const Search = ({ onSearch }: SearchProps) => {
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSearch = () => {
    const trimmedInput = input.trim();

    if (trimmedInput === '') {
      setErrorMsg('');
      onSearch('');
      setSearchQuery('');
      return;
    }

    const processed = processSearchQuery(input);
    if (processed === null) {
      setErrorMsg('The field must not contain spaces');
    } else {
      setErrorMsg('');
      onSearch(processed);
      setSearchQuery(processed);
    }
  };

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClearSearch = () => {
      setInput('');
      setErrorMsg('');
    };

    window.addEventListener('clearSearch', handleClearSearch);
    return () => {
      window.removeEventListener('clearSearch', handleClearSearch);
    };
  }, []);

  const handleClear = () => {
    setInput('');
    setErrorMsg('');
    onSearch('');
    setSearchQuery('');
  };

  return (
    <div className="header">
      <div className="search-input-container">
        <input
          name="search"
          className="header-query-text"
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Search Pokemon... (full name)"
        />
        {input && (
          <button
            className="clear-button"
            onClick={handleClear}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <Button className="header-query-button" onClick={handleSearch}>
        Search
      </Button>
      {errorMsg && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMsg}</div>
      )}
    </div>
  );
};

export default Search;
