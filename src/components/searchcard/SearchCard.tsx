import type { PokemonCardProps, PokemonCardState } from '@/types/interfaces';
import React, { Component } from 'react';

class PokemonCard extends Component<PokemonCardProps, PokemonCardState> {
  state: PokemonCardState = {
    sprite: null,
  };

  componentDidMount() {
    fetch(this.props.url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ sprite: data.sprites.front_default });
      });
  }

  render() {
    const { name } = this.props;
    const { sprite } = this.state;

    return (
      <div className="search-wrap">
        <h3>{name}</h3>
        {sprite ? <img src={sprite} alt={name} /> : <div>Loading image...</div>}
      </div>
    );
  }
}

export default PokemonCard;
