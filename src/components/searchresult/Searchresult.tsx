import type { MainProps } from '@/types/interfaces';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonCard from '@/components/searchcard/SearchCard';
import './Searchresult.css';
import processSearchQuery from '@/utils/validation';
import {
  useGetPokemonListQuery,
  useLazySearchPokemonQuery,
  createPokemonUrl,
} from '@/api';

const PAGE_SIZE = 12;

const Searchresult = ({ searchQuery }: MainProps) => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<
    Array<{ name: string; url: string }>
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  // RTK Query hooks
  const offset = (page - 1) * PAGE_SIZE;
  const {
    data: pokemonListData,
    error: listError,
    isLoading: isListLoading,
  } = useGetPokemonListQuery(
    { limit: PAGE_SIZE, offset },
    { skip: searchMode }
  );

  const [searchPokemon, { error: searchError, isLoading: isSearchLoading }] =
    useLazySearchPokemonQuery();

  // Обработка поискового запроса
  useEffect(() => {
    const rawQuery = (searchQuery || '').trim().toLowerCase();
    const query = processSearchQuery(rawQuery);

    if (query) {
      setSearchMode(true);
      searchPokemon(query)
        .then((result) => {
          if (result.data) {
            const pokemonUrl = createPokemonUrl(result.data.id);
            setSearchResult([{ name: result.data.name, url: pokemonUrl }]);
          } else {
            setSearchResult([]);
          }
        })
        .catch(() => {
          setSearchResult([]);
        });
    } else {
      setSearchMode(false);
      setSearchResult([]);
    }
  }, [searchQuery, searchPokemon]);

  const handlePokemonSelect = (pokemonId: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', String(page));
    currentParams.set('details', pokemonId);
    setSearchParams(currentParams);
  };

  const totalPages = Math.ceil((pokemonListData?.count || 0) / PAGE_SIZE);
  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', String(newPage));
    const details = searchParams.get('details');
    if (details) {
      currentParams.set('details', details);
    }
    setSearchParams(currentParams);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="pagination-arrow"
        aria-label="Previous page"
      >
        ◀
      </button>
    );
    pages.push(
      <button
        key={1}
        className={page === 1 ? 'active' : ''}
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
      >
        1
      </button>
    );
    if (page > 3) {
      pages.push(
        <span key="start-ellipsis" className="pagination-ellipsis">
          ...
        </span>
      );
    }
    for (
      let p = Math.max(2, page - 1);
      p <= Math.min(totalPages - 1, page + 1);
      p++
    ) {
      if (p === 1 || p === totalPages) continue;
      pages.push(
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => handlePageChange(p)}
          disabled={p === page}
        >
          {p}
        </button>
      );
    }
    if (page < totalPages - 2) {
      pages.push(
        <span key="end-ellipsis" className="pagination-ellipsis">
          ...
        </span>
      );
    }
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={page === totalPages ? 'active' : ''}
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          {totalPages}
        </button>
      );
    }
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="pagination-arrow"
        aria-label="Next page"
      >
        ▶
      </button>
    );
    return (
      <div className="pagination">
        <div className="pagination-inner">{pages}</div>
      </div>
    );
  };

  // Определяем состояние загрузки и ошибок
  const loading = isListLoading || isSearchLoading;
  const error = listError || searchError;

  if (loading) return <div className="loading">Loading...</div>;
  if (error) {
    const errorMessage =
      'data' in error && error.data
        ? String(error.data)
        : 'message' in error
          ? error.message
          : 'Unknown error';
    return <div className="error">Error: {errorMessage}</div>;
  }

  return (
    <>
      <div className="pokemon-list-container">
        <div className="cards-container">
          {searchMode ? (
            searchResult.length === 0 ? (
              <div className="no-results">No results</div>
            ) : (
              searchResult.map((item, index) => (
                <PokemonCard
                  key={index}
                  url={item.url}
                  name={item.name}
                  onSelect={handlePokemonSelect}
                />
              ))
            )
          ) : !pokemonListData?.results ||
            pokemonListData.results.length === 0 ? (
            <div className="no-results">No results</div>
          ) : (
            <>
              {pokemonListData.results.map((item, index) => (
                <PokemonCard
                  key={index}
                  url={item.url}
                  name={item.name}
                  onSelect={handlePokemonSelect}
                />
              ))}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Searchresult;
