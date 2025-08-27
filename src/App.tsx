import './App.css';
import { useState, useEffect } from 'react';

interface YearlyData {
  year: number;
  population: number;
  co2: number;
  co2_per_capita: number;
}

interface CountryData {
  [countryName: string]: YearlyData[];
}

function App() {
  const [countriesData, setCountriesData] = useState<CountryData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/co2-data.json')
      .then((response) => response.json())
      .then((data) => {
        setCountriesData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>CO2 Emissions by Countries</h1>
      <div className="countries-list">
        {Object.entries(countriesData).map(([countryName, yearlyData]) => {
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
    </div>
  );
}

export default App;
