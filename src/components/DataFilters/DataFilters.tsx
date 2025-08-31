import { useState, useCallback } from 'react';
import type { FilterOptions } from '../../interfaces/interfaces';
import './DataFilters.css';

interface DataFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (
    filters: FilterOptions | ((prev: FilterOptions) => FilterOptions)
  ) => void;
  availableYears: number[];
  availableRegions: string[];
  onColumnsClick: () => void;
}

export function DataFilters({
  filters,
  onFiltersChange,
  availableYears,
  availableRegions,
  onColumnsClick,
}: DataFiltersProps) {
  const [highlightYear, setHighlightYear] = useState(false);

  const handleYearChange = useCallback(
    (year: number | null) => {
      onFiltersChange({ ...filters, selectedYear: year, highlightData: true });
      setHighlightYear(true);
      setTimeout(() => setHighlightYear(false), 2000);
      setTimeout(() => {
        onFiltersChange((prev: FilterOptions) => ({
          ...prev,
          highlightData: false,
        }));
      }, 2000);
    },
    [filters, onFiltersChange]
  );

  const handleRegionChange = useCallback(
    (region: string) => {
      onFiltersChange({ ...filters, selectedRegion: region });
    },
    [filters, onFiltersChange]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      onFiltersChange({ ...filters, searchQuery: query });
    },
    [filters, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (sortBy: 'name' | 'population') => {
      const newSortOrder =
        filters.sortBy === sortBy && filters.sortOrder === 'asc'
          ? 'desc'
          : 'asc';
      onFiltersChange({ ...filters, sortBy, sortOrder: newSortOrder });
    },
    [filters, onFiltersChange]
  );

  return (
    <div className="data-filters">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="year-select">Год:</label>
          <select
            id="year-select"
            value={filters.selectedYear || 'all'}
            onChange={(e) =>
              handleYearChange(
                e.target.value === 'all' ? null : Number(e.target.value)
              )
            }
            className={highlightYear ? 'highlight' : ''}
          >
            <option value="all">Все годы</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="region-select">Регион:</label>
          <select
            id="region-select"
            value={filters.selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">Все регионы</option>
            {availableRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-outline columns-btn"
          onClick={onColumnsClick}
        >
          Столбцы
        </button>
      </div>

      <div className="filters-row">
        <div className="filter-group search-group">
          <label htmlFor="search-input">Поиск:</label>
          <input
            id="search-input"
            type="text"
            placeholder="Введите название страны..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Сортировка:</label>
          <div className="sort-buttons">
            <button
              className={`btn btn-sort ${filters.sortBy === 'name' ? 'active' : ''}`}
              onClick={() => handleSortChange('name')}
            >
              По названию{' '}
              {filters.sortBy === 'name' &&
                (filters.sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`btn btn-sort ${filters.sortBy === 'population' ? 'active' : ''}`}
              onClick={() => handleSortChange('population')}
            >
              По населению{' '}
              {filters.sortBy === 'population' &&
                (filters.sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
