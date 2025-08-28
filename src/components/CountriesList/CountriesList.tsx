import { useState, useMemo } from 'react';
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
const originalDataCache = new Map<string, unknown>(); // Кэш для оригинальной структуры

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
      console.log('Loaded data structure:', data);

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
          console.log('Converted data structure:', processedData);
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
  const filteredAndSortedData = useMemo(() => {
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
          dataA.find((d) => d.year === filters.selectedYear)?.population || 0;
        const popB =
          dataB.find((d) => d.year === filters.selectedYear)?.population || 0;
        return filters.sortOrder === 'asc' ? popA - popB : popB - popA;
      }
    });

    return result;
  }, [data, filters]);

  const getYearData = (
    yearlyData: YearlyData[],
    year: number
  ): YearlyData | undefined => {
    const yearData = yearlyData.find((d) => d.year === year);
    return yearData;
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className="countries-list">
      {filteredAndSortedData.map(([countryName, yearlyData]) => {
        const yearData = getYearData(yearlyData, filters.selectedYear);
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

        console.log('ISO Code result:', isoCode);

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
                {yearlyData.map((data) => (
                  <tr key={data.year}>
                    {visibleColumns.map((col) => (
                      <td key={col.key}>
                        {data[col.key] !== undefined
                          ? String(data[col.key])
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
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
    selectedYear: 2020,
    selectedRegion: '',
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [columns, setColumns] = useState<ColumnOption[]>([
    { key: 'year', label: 'Год', visible: true },
    { key: 'population', label: 'Население', visible: true },
    { key: 'cement_co2', label: 'CO2 от цемента', visible: true },
    {
      key: 'cement_co2_per_capita',
      label: 'CO2 от цемента на душу',
      visible: false,
    },
    {
      key: 'cumulative_cement_co2',
      label: 'Накопленный CO2 от цемента',
      visible: false,
    },
    { key: 'methane', label: 'Метан', visible: false },
    { key: 'oil_co2', label: 'CO2 от нефти', visible: false },
    {
      key: 'temperature_change_from_co2',
      label: 'Изменение температуры от CO2',
      visible: false,
    },
    { key: 'coal_co2', label: 'CO2 от угля', visible: false },
    { key: 'gas_co2', label: 'CO2 от газа', visible: false },
    { key: 'flaring_co2', label: 'CO2 от сжигания', visible: false },
    { key: 'other_co2', label: 'Другой CO2', visible: false },
  ]);

  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  const data = fetchData('co2-data');

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    Object.values(data).forEach((yearlyData) => {
      if (Array.isArray(yearlyData)) {
        yearlyData.forEach((d) => years.add(d.year));
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [data]);

  const availableRegions = useMemo(() => {
    return [];
  }, [data]);

  if (
    availableYears.length > 0 &&
    !availableYears.includes(filters.selectedYear)
  ) {
    setFilters((prev) => ({ ...prev, selectedYear: availableYears[0] }));
  }

  return (
    <div>
      <DataFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableYears={availableYears}
        availableRegions={availableRegions}
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
