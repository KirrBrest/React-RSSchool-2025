import './App.css';
import { Suspense } from 'react';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CountriesList } from './components/CountriesList';

function App() {
  return (
    <div className="App">
      <h1>CO2 Emissions by Countries</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <CountriesList />
      </Suspense>
    </div>
  );
}

export default App;
