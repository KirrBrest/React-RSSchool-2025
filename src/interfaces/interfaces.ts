export interface YearlyData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;

  methane?: number;
  oil_co2?: number;
  temperature_change_from_co2?: number;
  coal_co2?: number;
  gas_co2?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
  cumulative_cement_co2?: number;
  flaring_co2?: number;
  other_co2?: number;

  [key: string]: unknown;
}

export interface CountryData {
  [countryName: string]: YearlyData[];
}

export interface FilterOptions {
  selectedYear: number | null;
  selectedRegion: string;
  searchQuery: string;
  sortBy: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  highlightData: boolean;
}

export interface ColumnOption {
  key: keyof YearlyData;
  label: string;
  visible: boolean;
}
