import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearSelectedPokemons } from '@/store/pokemonSlice';
import './SelectedPokemon.css';

const SelectedPokemon = () => {
  const selectedPokemons = useAppSelector(
    (state) => state.pokemon.selectedPokemons
  );
  const dispatch = useAppDispatch();

  const handleClearAll = () => {
    dispatch(clearSelectedPokemons());
  };

  if (selectedPokemons.length === 0) {
    return (
      <div className="selected-pokemon-container">
        <h3>Выбранные покемоны</h3>
        <p className="no-selection">Нет выбранных покемонов</p>
      </div>
    );
  }

  return (
    <div className="selected-pokemon-container">
      <div className="selected-header">
        <h3>Выбранные покемоны ({selectedPokemons.length})</h3>
        <button onClick={handleClearAll} className="clear-all-btn">
          Очистить все
        </button>
      </div>
      <div className="selected-list">
        {selectedPokemons.map((pokemon) => (
          <div key={pokemon.id} className="selected-item">
            <span className="pokemon-name">{pokemon.name}</span>
            <span className="pokemon-id">#{pokemon.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedPokemon;
