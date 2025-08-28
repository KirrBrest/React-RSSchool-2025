import { useState } from 'react';
import type { FilterOptions } from '../../interfaces/interfaces';
import './DataFilters.css';

interface DataFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
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

  const handleYearChange = (year: number) => {
    onFiltersChange({ ...filters, selectedYear: year });
    setHighlightYear(true);
    setTimeout(() => setHighlightYear(false), 2000);
  };

  const handleRegionChange = (region: string) => {
    onFiltersChange({ ...filters, selectedRegion: region });
  };

  const handleSearchChange = (query: string) => {
    onFiltersChange({ ...filters, searchQuery: query });
  };

  const handleSortChange = (sortBy: 'name' | 'population') => {
    const newSortOrder =
      filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ ...filters, sortBy, sortOrder: newSortOrder });
  };

  return (
    <div className="data-filters">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="year-select">Год:</label>
          <select
            id="year-select"
            value={filters.selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className={highlightYear ? 'highlight' : ''}
          >
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
