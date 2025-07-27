import type { SearchProps } from '@/types/interfaces';
import React, { useState, useEffect } from 'react';
import './Search.css';
import processSearchQuery from '@/utils/validation';
import Button from '@/components/button/Button';

const Search = ({ onSearch }: SearchProps) => {
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSearch = () => {
    const processed = processSearchQuery(input);
    if (processed === null) {
      setErrorMsg('The field must not contain spaces');
    } else {
      setErrorMsg('');
      onSearch(processed);
      localStorage.setItem('searchQuery', processed);
    }
  };

  useEffect(() => {
    const savedQuery = localStorage.getItem('searchQuery') || '';
    setInput(savedQuery);
  }, []);

  return (
    <div className="header">
      <input
        name="search"
        className="header-query-text"
        type="text"
        value={input}
        onChange={handleChange}
      />
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
