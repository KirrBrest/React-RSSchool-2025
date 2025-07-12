import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@/types/interfaces';
import React, { Component, type ErrorInfo } from 'react';

class ErrorBoundary extends Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
    this.setState({ hasError: true, errorMessage: error.toString() });
  }

  handleErrorButton = () => {
    throw new Error('Test error');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Error</h2>
          <button onClick={this.handleErrorButton}>Show error</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
