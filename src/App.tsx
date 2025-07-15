import './App.css';
import { Component } from 'react';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import Header from '@/components/header/Header';
import Main from '@/components/main/Main';
import type { AppState } from './types/interfaces';

class App extends Component<unknown, AppState> {
  state: AppState = {
    searchQuery: '',
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

  handleTestError = () => {
    throw new Error('This is a test error');
  };

  render() {
    return (
      <ErrorBoundary>
        <Header onSearch={this.setSearchQuery} />
        <Main searchQuery={this.state.searchQuery} />
        <button onClick={this.handleTestError}>Throw Error</button>
      </ErrorBoundary>
    );
  }
}

export default App;
