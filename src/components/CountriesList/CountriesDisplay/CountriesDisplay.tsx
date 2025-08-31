import { useMemo } from 'react';
import type {
  CountryData,
  FilterOptions,
  ColumnOption,
  YearlyData,
} from '../../../interfaces/interfaces';
import { REGION_MAP } from '../../../constants/regions';
import {
  getYearData,
  getLatestYear,
  getFilteredAndSortedData,
} from '../../../utils/dataUtils';
import './CountriesDisplay.css';

interface CountriesDisplayProps {
  data: CountryData;
  filters: FilterOptions;
  columns: ColumnOption[];
  originalDataCache: Map<string, unknown>;
}

export function CountriesDisplay({
  data,
  filters,
  columns,
  originalDataCache,
}: CountriesDisplayProps) {
  const filteredAndSortedData = useMemo(() => {
    return getFilteredAndSortedData(
      data,
      filters,
      REGION_MAP,
      originalDataCache
    );
  }, [data, filters, REGION_MAP, originalDataCache]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible);
  }, [columns]);

  const getFilteredYearlyData = useMemo(() => {
    return (yearlyData: YearlyData[]) => {
      if (filters.selectedYear === null) {
        return yearlyData;
      }
      return yearlyData.filter((data) => data.year === filters.selectedYear);
    };
  }, [filters.selectedYear]);

  return (
    <div className="countries-list">
      {filteredAndSortedData.map(([countryName, yearlyData]) => {
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
                {getFilteredYearlyData(yearlyData).map((data) => (
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
                {getFilteredYearlyData(yearlyData).length === 0 && (
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
