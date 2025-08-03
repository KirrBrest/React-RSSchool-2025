import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearSelectedPokemons } from '@/store/pokemonSlice';
import { downloadPokemonCSV } from '@/utils/csvExport';
import './SelectedPokemon.css';

const SelectedPokemon: React.FC = () => {
  const selectedPokemons = useAppSelector(
    (state) => state.pokemon.selectedPokemons
  );
  const dispatch = useAppDispatch();

  const handleClearAll = (): void => {
    dispatch(clearSelectedPokemons());
  };

  const handleDownload = (): void => {
    downloadPokemonCSV(selectedPokemons);
  };

  if (selectedPokemons.length === 0) {
    return null;
  }

  return (
    <div className="selected-pokemon-flyout">
      <div className="flyout-content">
        <div className="flyout-header">
          <span className="selected-count">
            {selectedPokemons.length}{' '}
            {selectedPokemons.length === 1 ? 'item is' : 'items are'} selected
          </span>
        </div>
        <div className="flyout-actions">
          <button
            className="flyout-button unselect-all"
            onClick={handleClearAll}
            type="button"
          >
            Unselect all
          </button>
          <button
            className="flyout-button download"
            onClick={handleDownload}
            type="button"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedPokemon;
