import type { MainProps } from '@/types/interfaces';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonCard from '@/components/searchcard/SearchCard';
import './Searchresult.css';
import processSearchQuery from '@/utils/validation';
import { getPokemonList } from '@/api/pokemonApi';

const PAGE_SIZE = 16;

const Searchresult = ({ searchQuery }: MainProps) => {
  const [results, setResults] = useState<Array<{ name: string; url: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<
    Array<{ name: string; url: string }>
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      const rawQuery = searchQuery.trim().toLowerCase();
      const query = processSearchQuery(rawQuery);

      setLoading(true);
      setError(null);

      if (query) {
        setSearchMode(true);
        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`
          );
          if (!res.ok) throw new Error('Pokemon not found');
          const data = await res.json();
          const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${data.id}/`;
          setSearchResult([{ name: data.name, url: pokemonUrl }]);
          setLoading(false);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unknown error');
          }
          setSearchResult([]);
          setLoading(false);
        }
      } else {
        setSearchMode(false);
        try {
          const offset = (page - 1) * PAGE_SIZE;
          const data = await getPokemonList(PAGE_SIZE, offset);
          setResults(data.results);
          setCount(data.count);
          setLoading(false);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unknown error');
          }
          setResults([]);
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [searchQuery, page]);

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cards-container">
      {searchMode ? (
        searchResult.length === 0 ? (
          <div>No results</div>
        ) : (
          searchResult.map((item, index) => (
            <PokemonCard key={index} url={item.url} name={item.name} />
          ))
        )
      ) : results.length === 0 ? (
        <div>No results</div>
      ) : (
        <>
          {results.map((item, index) => (
            <PokemonCard key={index} url={item.url} name={item.name} />
          ))}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default Searchresult;
