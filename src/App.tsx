import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/home/Home';
import About from '@/pages/about/About';
import Page404 from '@/pages/page404/Page404';
import Header from '@/components/header/Header';
import PokemonDetailsRoute from '@/components/pokemon-details/PokemonDetailsRoute';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<PokemonDetailsRoute />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
