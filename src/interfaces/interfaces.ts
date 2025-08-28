export interface YearlyData {
  year: number;
  population: number;
  co2: number;
  co2_per_capita: number;
}

export interface CountryData {
  [countryName: string]: YearlyData[];
}
