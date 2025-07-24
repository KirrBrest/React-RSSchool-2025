import './App.css';
import { Component } from 'react';
import Header from '@/components/header/Header';
import Home from '@/pages/home/Home';
import type { AppState } from './types/interfaces';
import ErrorBoundary from './components/errors/ErrorBoundary';

class App extends Component<unknown, AppState> {
  state: AppState = {
    searchQuery: '',
    error: false,
  };

  setSearchQuery = (query: string) => {
    this.setState({ searchQuery: query });
  };

  componentDidMount() {
    const savedQuery = localStorage.getItem('searchQuery') || '';
    if (savedQuery) {
      this.setState({ searchQuery: savedQuery });
    }
  }

  throwError = () => {
    this.setState({ error: true });
  };

  render() {
    if (this.state.error) {
      throw new Error('This is a test error');
    }
    return (
      <ErrorBoundary>
        <Header onSearch={this.setSearchQuery} />
        <Home searchQuery={this.state.searchQuery} />
        <button onClick={this.throwError}>Throw Error</button>
      </ErrorBoundary>
    );
  }
}

export default App;
