import { useState, useMemo, useCallback } from 'react';
import type {
  CountryData,
  FilterOptions,
  ColumnOption,
  YearlyData,
} from '../../interfaces/interfaces';
import { DataFilters } from '../DataFilters';
import { ColumnSelector } from '../ColumnSelector';
import { CountriesDisplay } from './CountriesDisplay';
import { REGION_MAP } from '../../constants/regions';
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
      console.log('✅ Локальный файл успешно загружен');
      return response.json();
    })
    .catch((error) => {
      console.log('❌ Локальный файл не найден:', error.message);
      console.log('🔄 Загружаем с внешнего URL...');
      return fetch(
        'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json'
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log('✅ Внешний URL успешно подключен, ожидайте загрузку');
          return response.json();
        })
        .catch((error) => {
          console.error('❌ Ошибка загрузки с внешнего URL:', error.message);
          throw error;
        });
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

export function CountriesList() {
  const [filters, setFilters] = useState<FilterOptions>({
    selectedYear: null,
    selectedRegion: '',
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
    highlightData: false,
  });

  const [columns, setColumns] = useState<ColumnOption[]>([]);

  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  const data = fetchData('co2-data');

  const handleColumnsClick = useCallback(() => {
    setIsColumnSelectorOpen(true);
  }, []);

  const handleColumnSelectorClose = useCallback(() => {
    setIsColumnSelectorOpen(false);
  }, []);

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

  if (columns.length === 0 && Object.keys(data).length > 0) {
    setColumns(getAvailableColumns());
  }

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
    const regions = new Set<string>();
    Object.values(data).forEach((yearlyData) => {
      if (Array.isArray(yearlyData) && yearlyData.length > 0) {
        const countryName = Object.keys(data).find(
          (name) => data[name] === yearlyData
        );
        if (countryName) {
          const originalData = originalDataCache.get('co2-data') as Record<
            string,
            { iso_code?: string; data: unknown[] }
          >;
          if (
            originalData &&
            originalData[countryName] &&
            originalData[countryName].iso_code
          ) {
            const isoCode = originalData[countryName].iso_code;
            const region = REGION_MAP[isoCode];
            if (region) {
              regions.add(region);
            }
          }
        }
      }
    });

    return Array.from(regions).sort();
  }, [data, originalDataCache]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  if (availableYears.length > 0 && isFirstLoad) {
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
        availableYears={availableYears}
        availableRegions={availableRegions}
        onColumnsClick={handleColumnsClick}
      />

      <CountriesDisplay
        data={data}
        filters={filters}
        columns={columns}
        originalDataCache={originalDataCache}
      />

      <ColumnSelector
        isOpen={isColumnSelectorOpen}
        onClose={handleColumnSelectorClose}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </div>
  );
}
