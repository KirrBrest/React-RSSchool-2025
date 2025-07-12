import type { HeaderProps, HeaderState } from '@/types/interfaces';
import React, { Component } from 'react';
import './Header.css';

class Header extends Component<HeaderProps, HeaderState> {
  state: HeaderState = {
    input: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };

  handleSearch = () => {
    this.props.onSearch(this.state.input);
    localStorage.setItem('searchQuery', this.state.input);
  };

  componentDidMount() {
    const savedQuery = localStorage.getItem('searchQuery') || '';
    this.setState({ input: savedQuery });
  }

  render() {
    return (
      <div className="header">
        <input
          name="search"
          className="header-query-text"
          type="text"
          value={this.state.input}
          onChange={this.handleChange}
        />
        <button className="header-query-button" onClick={this.handleSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default Header;
