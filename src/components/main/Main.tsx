import type { MainProps, MainState } from '@/types/interfaces';
import { Component } from 'react';

class Main extends Component<MainProps, MainState> {
  state: MainState = {
    results: [],
    loading: false,
    error: null,
  };

  componentDidUpdate(prevProps: MainProps) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.fetchData();
    }
  }

  fetchData() {
    this.setState({ loading: true, error: null });
    const query = this.props.searchQuery;
    //API вызов тут
    // Пока что временно имитация:
    setTimeout(() => {
      if (query === 'error') {
        this.setState({ error: 'Ошибка загрузки', loading: false });
      } else {
        this.setState({
          results: [
            { title: 'Элемент 1', description: 'Описание 1' },
            { title: 'Элемент 2', description: 'Описание 2' },
          ],
          loading: false,
        });
      }
    }, 1000);
  }

  render() {
    const { results, loading, error } = this.state;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
      <div>
        {results.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default Main;
