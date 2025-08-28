import { useState } from 'react';
import type {
  CountryData,
  FilterOptions,
  ColumnOption,
  YearlyData,
} from '../../interfaces/interfaces';
import { DataFilters } from '../DataFilters';
import { ColumnSelector } from '../ColumnSelector';
import './CountriesList.css';

const dataCache = new Map<string, CountryData>();
const originalDataCache = new Map<string, unknown>();

function fetchData(key: string): CountryData {
  if (dataCache.has(key)) {
    const cachedData = dataCache.get(key);
    if (cachedData) {
      return cachedData;
    }
  }

  const promise = fetch('/owid-co2-data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data: unknown) => {
      let processedData: CountryData;

      if (data && typeof data === 'object') {
        const firstCountry = Object.values(data)[0];
        if (
          firstCountry &&
          typeof firstCountry === 'object' &&
          'data' in firstCountry
        ) {
          processedData = {};
          Object.entries(data).forEach(([countryName, countryInfo]) => {
            if (
              countryInfo &&
              typeof countryInfo === 'object' &&
              'data' in countryInfo
            ) {
              const countryData = countryInfo as {
                data: unknown[];
                iso_code?: string;
              };
              processedData[countryName] = countryData.data as YearlyData[];
            }
          });

          originalDataCache.set(key, data);
        } else {
          processedData = data as CountryData;
        }
      } else {
        throw new Error('Invalid data format');
      }

      dataCache.set(key, processedData);
      return processedData;
    });

  throw promise;
}

function CountriesDisplay({
  data,
  filters,
  columns,
}: {
  data: CountryData;
  filters: FilterOptions;
  columns: ColumnOption[];
}) {
  const filteredAndSortedData = () => {
    let result = Object.entries(data);

    if (filters.selectedRegion) {
      result = result.filter(([countryName]) =>
        countryName.toLowerCase().includes(filters.selectedRegion.toLowerCase())
      );
    }

    if (filters.searchQuery) {
      result = result.filter(([countryName]) =>
        countryName.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    result.sort(([nameA, dataA], [nameB, dataB]) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const popA =
          dataA.find(
            (d) => d.year === (filters.selectedYear || getLatestYear(dataA))
          )?.population || 0;
        const popB =
          dataB.find(
            (d) => d.year === (filters.selectedYear || getLatestYear(dataB))
          )?.population || 0;
        return filters.sortOrder === 'asc' ? popA - popB : popB - popA;
      }
    });

    return result;
  };

  const getYearData = (
    yearlyData: YearlyData[],
    year: number
  ): YearlyData | undefined => {
    const yearData = yearlyData.find((d) => d.year === year);
    return yearData;
  };

  const getLatestYear = (yearlyData: YearlyData[]): number => {
    return Math.max(...yearlyData.map((d) => d.year));
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className="countries-list">
      {filteredAndSortedData().map(([countryName, yearlyData]) => {
        const yearData = getYearData(
          yearlyData,
          filters.selectedYear || getLatestYear(yearlyData)
        );
        const population = yearData?.population || 'N/A';

        const originalData = originalDataCache.get('co2-data') as Record<
          string,
          { iso_code?: string; data: unknown[] }
        >;
        let isoCode = 'N/A';

        if (originalData && originalData[countryName]) {
          const countryData = originalData[countryName];
          if (
            countryData &&
            'iso_code' in countryData &&
            countryData.iso_code
          ) {
            isoCode = countryData.iso_code;
          }
        }

        return (
          <div key={countryName} className="country-item">
            <h2>{countryName}</h2>
            <p>Population: {population}</p>
            <p>ISO Code: {isoCode}</p>

            <table className="yearly-data">
              <thead>
                <tr>
                  {visibleColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {yearlyData
                  .filter(
                    (data) =>
                      filters.selectedYear === null ||
                      data.year === filters.selectedYear
                  )
                  .slice(filters.selectedYear === null ? undefined : -1)
                  .map((data) => (
                    <tr
                      key={data.year}
                      className={
                        filters.highlightData &&
                        filters.selectedYear !== null &&
                        data.year === filters.selectedYear
                          ? 'highlight-row'
                          : ''
                      }
                    >
                      {visibleColumns.map((col) => (
                        <td key={col.key}>
                          {data[col.key] !== undefined
                            ? String(data[col.key])
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                {yearlyData.filter(
                  (data) =>
                    filters.selectedYear === null ||
                    data.year === filters.selectedYear
                ).length === 0 && (
                  <tr>
                    <td
                      colSpan={visibleColumns.length}
                      style={{ textAlign: 'center', color: '#888' }}
                    >
                      {filters.selectedYear === null
                        ? 'Нет данных для отображения'
                        : `Нет данных для ${filters.selectedYear} года`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export function CountriesList() {
  const [filters, setFilters] = useState<FilterOptions>({
    selectedYear: null,
    selectedRegion: '',
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
    highlightData: false,
  });

  const getAvailableColumns = (): ColumnOption[] => {
    if (Object.keys(data).length === 0) return [];

    const allFields = new Set<string>();
    Object.values(data).forEach((yearlyData) => {
      if (Array.isArray(yearlyData)) {
        yearlyData.forEach((yearData) => {
          Object.keys(yearData).forEach((field) => allFields.add(field));
        });
      }
    });

    const columns: ColumnOption[] = [];

    const basicFields = ['year', 'population', 'co2', 'co2_per_capita'];
    basicFields.forEach((field) => {
      if (allFields.has(field)) {
        columns.push({
          key: field,
          label: field,
          visible: true,
        });
      }
    });

    allFields.forEach((field) => {
      if (!basicFields.includes(field)) {
        columns.push({
          key: field,
          label: field,
          visible: false,
        });
      }
    });

    return columns;
  };

  const [columns, setColumns] = useState<ColumnOption[]>([]);

  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  const data = fetchData('co2-data');

  if (columns.length === 0 && Object.keys(data).length > 0) {
    setColumns(getAvailableColumns());
  }

  const availableYears = () => {
    const years = new Set<number>();
    Object.values(data).forEach((yearlyData) => {
      if (Array.isArray(yearlyData)) {
        yearlyData.forEach((d) => years.add(d.year));
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const availableRegions = () => {
    return [];
  };

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  if (availableYears().length > 0 && isFirstLoad) {
    const firstCountryData = Object.values(data)[0];
    if (
      firstCountryData &&
      Array.isArray(firstCountryData) &&
      firstCountryData.length > 0
    ) {
      const latestYear = Math.max(...firstCountryData.map((d) => d.year));
      setFilters((prev) => ({ ...prev, selectedYear: latestYear }));
    }
    setIsFirstLoad(false);
  }

  return (
    <div className="countries-list-container">
      <DataFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableYears={availableYears()}
        availableRegions={availableRegions()}
        onColumnsClick={() => setIsColumnSelectorOpen(true)}
      />

      <CountriesDisplay data={data} filters={filters} columns={columns} />

      <ColumnSelector
        isOpen={isColumnSelectorOpen}
        onClose={() => setIsColumnSelectorOpen(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </div>
  );
}
