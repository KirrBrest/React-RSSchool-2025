import type { HeaderProps, HeaderState } from '@/types/interfaces';
import React, { Component } from 'react';
import './Header.css';
import { processSearchQuery } from '@/utils/validation';

class Header extends Component<HeaderProps, HeaderState> {
  state: HeaderState = {
    input: '',
    errorMsg: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };

  handleSearch = () => {
    const { input } = this.state;
    const processed = processSearchQuery(input);
    if (processed === null) {
      this.setState({
        errorMsg: 'The field must not contain spaces',
      });
    } else {
      this.setState({ errorMsg: '' });
      this.props.onSearch(processed);
      console.log(this.props); //!!!!!!!!!!!!
      localStorage.setItem('searchQuery', processed);
    }
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
          onChange={(e) => this.setState({ input: e.target.value })}
        />
        <button className="header-query-button" onClick={this.handleSearch}>
          Search
        </button>
        {this.state.errorMsg && (
          <div style={{ color: 'red', marginTop: '5px' }}>
            {this.state.errorMsg}
          </div>
        )}
      </div>
    );
  }
}

export default Header;
