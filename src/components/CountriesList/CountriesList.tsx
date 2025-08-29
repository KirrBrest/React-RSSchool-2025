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

const REGION_MAP: Record<string, string> = {
  ALB: 'Europe',
  AND: 'Europe',
  AUT: 'Europe',
  BLR: 'Europe',
  BEL: 'Europe',
  BIH: 'Europe',
  BGR: 'Europe',
  HRV: 'Europe',
  CZE: 'Europe',
  DNK: 'Europe',
  EST: 'Europe',
  FIN: 'Europe',
  FRA: 'Europe',
  DEU: 'Europe',
  GRC: 'Europe',
  HUN: 'Europe',
  ISL: 'Europe',
  IRL: 'Europe',
  ITA: 'Europe',
  LVA: 'Europe',
  LTU: 'Europe',
  LUX: 'Europe',
  MKD: 'Europe',
  MLT: 'Europe',
  MDA: 'Europe',
  MNE: 'Europe',
  NLD: 'Europe',
  NOR: 'Europe',
  POL: 'Europe',
  PRT: 'Europe',
  ROU: 'Europe',
  RUS: 'Europe',
  SRB: 'Europe',
  SVK: 'Europe',
  SVN: 'Europe',
  ESP: 'Europe',
  SWE: 'Europe',
  CHE: 'Europe',
  UKR: 'Europe',
  GBR: 'Europe',

  AFG: 'Asia',
  ARM: 'Asia',
  AZE: 'Asia',
  BHR: 'Asia',
  BGD: 'Asia',
  BTN: 'Asia',
  BRN: 'Asia',
  KHM: 'Asia',
  CHN: 'Asia',
  CYP: 'Asia',
  GEO: 'Asia',
  HKG: 'Asia',
  IND: 'Asia',
  IDN: 'Asia',
  IRN: 'Asia',
  IRQ: 'Asia',
  ISR: 'Asia',
  JPN: 'Asia',
  JOR: 'Asia',
  KAZ: 'Asia',
  KWT: 'Asia',
  KGZ: 'Asia',
  LAO: 'Asia',
  LBN: 'Asia',
  MAC: 'Asia',
  MYS: 'Asia',
  MDV: 'Asia',
  MNG: 'Asia',
  MMR: 'Asia',
  NPL: 'Asia',
  OMN: 'Asia',
  PAK: 'Asia',
  PSE: 'Asia',
  PHL: 'Asia',
  QAT: 'Asia',
  SAU: 'Asia',
  SGP: 'Asia',
  LKA: 'Asia',
  SYR: 'Asia',
  TWN: 'Asia',
  TJK: 'Asia',
  THA: 'Asia',
  TUR: 'Asia',
  TKM: 'Asia',
  ARE: 'Asia',
  UZB: 'Asia',
  VNM: 'Asia',
  YEM: 'Asia',

  DZA: 'Africa',
  AGO: 'Africa',
  BEN: 'Africa',
  BWA: 'Africa',
  BFA: 'Africa',
  BDI: 'Africa',
  CMR: 'Africa',
  CPV: 'Africa',
  CAF: 'Africa',
  TCD: 'Africa',
  COM: 'Africa',
  COG: 'Africa',
  COD: 'Africa',
  DJI: 'Africa',
  EGY: 'Africa',
  GNQ: 'Africa',
  ERI: 'Africa',
  ETH: 'Africa',
  GAB: 'Africa',
  GMB: 'Africa',
  GHA: 'Africa',
  GIN: 'Africa',
  GNB: 'Africa',
  CIV: 'Africa',
  KEN: 'Africa',
  LSO: 'Africa',
  LBR: 'Africa',
  LBY: 'Africa',
  MDG: 'Africa',
  MWI: 'Africa',
  MLI: 'Africa',
  MRT: 'Africa',
  MUS: 'Africa',
  MAR: 'Africa',
  MOZ: 'Africa',
  NAM: 'Africa',
  NER: 'Africa',
  NGA: 'Africa',
  RWA: 'Africa',
  STP: 'Africa',
  SEN: 'Africa',
  SYC: 'Africa',
  SLE: 'Africa',
  SOM: 'Africa',
  ZAF: 'Africa',
  SSD: 'Africa',
  SDN: 'Africa',
  SWZ: 'Africa',
  TZA: 'Africa',
  TGO: 'Africa',
  TUN: 'Africa',
  UGA: 'Africa',
  ZMB: 'Africa',
  ZWE: 'Africa',

  CAN: 'North America',
  USA: 'North America',
  MEX: 'North America',
  GTM: 'North America',
  BLZ: 'North America',
  SLV: 'North America',
  HND: 'North America',
  NIC: 'North America',
  CRI: 'North America',
  PAN: 'North America',
  CUB: 'North America',
  JAM: 'North America',
  HTI: 'North America',
  DOM: 'North America',
  PRI: 'North America',
  TTO: 'North America',
  BRB: 'North America',
  GRD: 'North America',
  LCA: 'North America',
  VCT: 'North America',
  ATG: 'North America',
  KNA: 'North America',
  DMA: 'North America',
  AIA: 'North America',
  BMU: 'North America',
  VGB: 'North America',
  CYM: 'North America',

  ARG: 'South America',
  BOL: 'South America',
  BRA: 'South America',
  CHL: 'South America',
  COL: 'South America',
  ECU: 'South America',
  GUY: 'South America',
  PRY: 'South America',
  PER: 'South America',
  SUR: 'South America',
  URY: 'South America',
  VEN: 'South America',

  AUS: 'Oceania',
  NZL: 'Oceania',
  FJI: 'Oceania',
  PNG: 'Oceania',
  SLB: 'Oceania',
  VUT: 'Oceania',
  NCL: 'Oceania',
  WSM: 'Oceania',
  KIR: 'Oceania',
  TON: 'Oceania',
  TUV: 'Oceania',
  NRU: 'Oceania',
  PLW: 'Oceania',
  FSM: 'Oceania',
  MHL: 'Oceania',
  COK: 'Oceania',
  NIU: 'Oceania',
  TKL: 'Oceania',
  ATA: 'Oceania',
};

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
      result = result.filter(([countryName]) => {
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
          return region === filters.selectedRegion;
        }
        return false;
      });
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
