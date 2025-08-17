'use client';

import type { MainProps } from '@/types/interfaces';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PokemonCard from '@/components/searchcard/SearchCard';
import './Searchresult.css';
import processSearchQuery from '@/utils/validation';
import {
  useGetPokemonListQuery,
  useLazySearchPokemonQuery,
  createPokemonUrl,
} from '@/api';
import { useAppDispatch } from '@/store/hooks';

const PAGE_SIZE = 12;

const Searchresult = ({ searchQuery, onClearSearch }: MainProps) => {
  const dispatch = useAppDispatch();
  const [searchMode, setSearchMode] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams?.get('page')) || 1;

  const offset = (page - 1) * PAGE_SIZE;
  const {
    data: pokemonListData,
    error: listError,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useGetPokemonListQuery(
    { limit: PAGE_SIZE, offset },
    { skip: searchMode }
  );

  const [
    searchPokemon,
    {
      data: searchData,
      error: searchError,
      isLoading: isSearchLoading,
      isFetching: isSearchFetching,
    },
  ] = useLazySearchPokemonQuery();

  useEffect(() => {
    const rawQuery = (searchQuery || '').trim().toLowerCase();
    const query = processSearchQuery(rawQuery);

    if (query) {
      setSearchMode(true);
      setCurrentSearchQuery(query);
      searchPokemon(query);
    } else {
      setSearchMode(false);
      setCurrentSearchQuery('');
    }
  }, [searchQuery, searchPokemon]);

  const handlePokemonSelect = (pokemonId: string) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('page', String(page));
    currentParams.set('details', pokemonId);
    router.push(`/?${currentParams.toString()}`);
  };

  const totalPages = Math.ceil((pokemonListData?.count || 0) / PAGE_SIZE);
  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('page', String(newPage));
    const details = searchParams?.get('details');
    if (details) {
      currentParams.set('details', details);
    }
    router.push(`/?${currentParams.toString()}`);
  };

  const handleRefresh = () => {
    if (searchMode && currentSearchQuery) {
      searchPokemon(currentSearchQuery, true);
    } else {
      refetchList();
    }

    dispatch({
      type: 'pokemonApi/invalidateTags',
      payload: searchMode ? ['Search'] : ['PokemonList'],
    });
  };

  const handleClearCache = () => {
    dispatch({
      type: 'pokemonApi/invalidateTags',
      payload: ['Pokemon', 'PokemonList', 'Search'],
    });

    if (searchMode && currentSearchQuery) {
      searchPokemon(currentSearchQuery, true);
    } else {
      refetchList();
    }
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

  const isInitialLoading = isListLoading || isSearchLoading;
  const isFetching = isListFetching || isSearchFetching;
  const error = searchMode ? searchError : listError;

  const renderError = (error: unknown) => {
    let errorMessage = 'Unknown error occurred';

    if (error && typeof error === 'object') {
      if ('status' in error) {
        const rtqError = error as { status: string | number; data?: unknown };
        if (rtqError.status === 'FETCH_ERROR') {
          errorMessage = 'Network error. Please check your connection.';
        } else if (rtqError.status === 404) {
          errorMessage = searchMode
            ? `Pokemon "${currentSearchQuery}" not found`
            : 'Pokemon not found';
        } else if (
          typeof rtqError.status === 'number' &&
          rtqError.status >= 500
        ) {
          errorMessage = 'Server error. Please try again later.';
        } else if (rtqError.data) {
          errorMessage =
            typeof rtqError.data === 'string'
              ? rtqError.data
              : JSON.stringify(rtqError.data);
        }
      } else if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }

    return (
      <div className="error-container">
        <div className="error">
          <h3>🚨 Error</h3>
          <p>{errorMessage}</p>
          <div className="error-actions">
            {searchMode && searchError ? (
              <button
                onClick={() => {
                  setSearchMode(false);
                  setCurrentSearchQuery('');
                  localStorage.removeItem('searchQuery');

                  if (onClearSearch) {
                    onClearSearch();
                  }

                  window.dispatchEvent(new CustomEvent('clearSearch'));
                }}
                className="button button-secondary"
              >
                ← Back to List
              </button>
            ) : (
              <button
                onClick={handleRefresh}
                className="button button-primary"
                disabled={isFetching}
              >
                {isFetching ? 'Retrying...' : 'Try Again'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isInitialLoading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>
            {searchMode
              ? `Searching for Pokemon "${currentSearchQuery}"...`
              : 'Loading Pokemon data...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return renderError(error);
  }

  return (
    <>
      <div className="cache-controls">
        <div className="cache-buttons">
          <button
            onClick={handleRefresh}
            className="button button-secondary refresh-button"
            disabled={isFetching}
            title="Force refresh current data from server"
          >
            {isFetching ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          <button
            onClick={handleClearCache}
            className="button button-tertiary clear-cache-button"
            title="Clear all cache to see loading spinners"
          >
            🗑️ Clear Cache
          </button>
          <button
            onClick={() => {
              alert(
                '💡 Tip: Open DevTools (F12) → Network tab → Enable "Slow 3G" to see loading spinners!'
              );
            }}
            className="button button-info slow-connection-button"
            title="Get instructions to simulate slow connection"
          >
            🐌 Show Spinners
          </button>
        </div>
        {isFetching && !isInitialLoading && (
          <div className="background-loading">
            <span>🔄 Updating data...</span>
          </div>
        )}
      </div>

      <div className="pokemon-list-container">
        <div className="cards-container">
          {searchMode ? (
            searchError ? (
              <div className="no-results">
                <p>🔍 Pokemon &quot;{currentSearchQuery}&quot; not found</p>
                <p>Try searching for a different Pokemon name</p>
                <button
                  onClick={() => {
                    setSearchMode(false);
                    setCurrentSearchQuery('');

                    localStorage.removeItem('searchQuery');

                    if (onClearSearch) {
                      onClearSearch();
                    }
                    window.dispatchEvent(new CustomEvent('clearSearch'));
                  }}
                  className="button button-secondary"
                >
                  ← Back to List
                </button>
              </div>
            ) : searchData ? (
              <PokemonCard
                key={searchData.id}
                url={createPokemonUrl(searchData.id)}
                name={searchData.name}
                onSelect={handlePokemonSelect}
              />
            ) : (
              <div className="no-results">
                <p>🔍 Searching for &quot;{currentSearchQuery}&quot;...</p>
              </div>
            )
          ) : !pokemonListData?.results ||
            pokemonListData.results.length === 0 ? (
            <div className="no-results">
              <p>No Pokemon data available</p>
              <button onClick={handleRefresh} className="button button-primary">
                Load Pokemon
              </button>
            </div>
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
