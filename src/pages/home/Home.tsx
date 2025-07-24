import type { MainProps, MainState } from '@/types/interfaces';
import { Component } from 'react';
import PokemonCard from '@/components/searchcard/SearchCard';
import './Home.css';
import { processSearchQuery } from '@/utils/validation';

class Home extends Component<MainProps, MainState> {
  state: MainState = {
    results: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: MainProps) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.fetchData();
    }
  }

  fetchData() {
    const rawQuery = this.props.searchQuery.trim().toLowerCase();
    const query = processSearchQuery(rawQuery);

    this.setState({ loading: true, error: null });

    if (query) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Pokemon not found');
          return res.json();
        })
        .then((data) => {
          const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${data.id}/`;
          this.setState({
            results: [{ name: data.name, url: pokemonUrl }],
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({ error: err.message, loading: false });
        });
    } else {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=0`)
        .then((res) => {
          if (!res.ok)
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          this.setState({ results: data.results, loading: false });
        })
        .catch((err) => {
          this.setState({ error: err.message, loading: false });
        });
    }
  }

  render() {
    const { results, loading, error } = this.state;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="cards-container">
        {results.length === 0 ? (
          <div>No results</div>
        ) : (
          results.map((item, index) => (
            <PokemonCard key={index} url={item.url} name={item.name} />
          ))
        )}
      </div>
    );
  }
}

export default Home;
