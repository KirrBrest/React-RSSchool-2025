import type { CountryData } from '../../interfaces/interfaces';
import './CountriesList.css';

const dataCache = new Map<string, CountryData>();

function fetchData(key: string): CountryData {
  if (dataCache.has(key)) {
    const cachedData = dataCache.get(key);
    if (cachedData) {
      return cachedData;
    }
  }

  const promise = fetch('/co2-data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data: CountryData) => {
      dataCache.set(key, data);
      return data;
    });

  throw promise;
}

function CountriesDisplay({ data }: { data: CountryData }) {
  return (
    <div className="countries-list">
      {Object.entries(data).map(([countryName, yearlyData]) => {
        const lastYearData = yearlyData[yearlyData.length - 1];
        const population = lastYearData?.population || 'N/A';
        const isoCode = 'N/A'; // Врременно пусть будет N/A

        return (
          <div key={countryName} className="country-item">
            <h2>{countryName}</h2>
            <p>Population: {population}</p>
            <p>ISO Code: {isoCode}</p>

            <table className="yearly-data">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Population</th>
                  <th>CO2</th>
                  <th>CO2 per capita</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((data) => (
                  <tr key={data.year}>
                    <td>{data.year}</td>
                    <td>{data.population || 'N/A'}</td>
                    <td>{data.co2 || 'N/A'}</td>
                    <td>{data.co2_per_capita || 'N/A'}</td>
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
  const data = fetchData('co2-data');

  return <CountriesDisplay data={data} />;
}
