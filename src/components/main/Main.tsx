import type { MainProps, MainState } from '@/types/interfaces';
import { Component } from 'react';
import PokemonCard from '@/components/searchcard/SearchCard';

class Main extends Component<MainProps, MainState> {
  state: MainState = {
    results: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: MainProps) {
    console.log('ping2'); //11111111111111111111111
    if (prevProps.searchQuery !== this.props.searchQuery) {
      console.log('ping1'); //1111111111111111111111111
      this.fetchData();
    }
  }

  fetchData() {
    const query = this.props.searchQuery.trim().toLowerCase();

    this.setState({ loading: true, error: null });

    if (query) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Pokemon not found');
          return res.json();
        })
        .then((data) => {
          this.setState({ results: [data], loading: false });
        })
        .catch((err) => {
          this.setState({ error: err.message, loading: false });
        });
    } else {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`)
        .then((res) => {
          if (!res.ok) throw new Error('Download Error');
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
      <div>
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

export default Main;
