import type { PokemonCardProps, PokemonCardState } from '@/types/interfaces';
import { Component } from 'react';

class PokemonCard extends Component<PokemonCardProps, PokemonCardState> {
  state: PokemonCardState = {
    sprite: null,
  };

  componentDidMount() {
    this.loadSprite();
  }

  componentDidUpdate(prevProps: PokemonCardProps) {
    if (prevProps.url !== this.props.url) {
      this.loadSprite();
    }
  }

  loadSprite() {
    this.setState({ sprite: null });
    fetch(this.props.url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.sprites && data.sprites.front_default) {
          this.setState({ sprite: data.sprites.front_default });
          console.log(data.sprites.front_default);
          console.log('ping');
        } else {
          this.setState({ sprite: null });
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        this.setState({ sprite: null });
      });
  }

  render() {
    const { name } = this.props;
    const { sprite } = this.state;
    console.log(this.props.url);
    console.log('ping2');

    return (
      <div className="card">
        <h3>{name}</h3>
        {sprite ? <img src={sprite} alt={name} /> : <div>Loading image...</div>}
      </div>
    );
  }
}

export default PokemonCard;
