import type { YearlyData } from '../interfaces/interfaces';

export const getYearData = (
  yearlyData: YearlyData[],
  year: number
): YearlyData | undefined => {
  return yearlyData.find((d) => d.year === year);
};

export const getLatestYear = (yearlyData: YearlyData[]): number => {
  return Math.max(...yearlyData.map((d) => d.year));
};

export const getFilteredAndSortedData = (
  data: Record<string, YearlyData[]>,
  filters: {
    selectedRegion: string;
    searchQuery: string;
    sortBy: 'name' | 'population';
    sortOrder: 'asc' | 'desc';
    selectedYear: number | null;
  },
  regionMap: Record<string, string>,
  originalDataCache: Map<string, unknown>
) => {
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
        const region = regionMap[isoCode];
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
