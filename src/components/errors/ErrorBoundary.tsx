import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@/types/interfaces';
import { Component, type ErrorInfo } from 'react';
import ErrorModal from './ErrorModal';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
    errorType: '',
    showErrorModal: false,
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
    this.setState({
      hasError: true,
      errorMessage: error.message,
      errorType: 'caught',
      errorDetails: error.stack,
      showErrorModal: true,
    });
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error.message,
      errorDetails: error.stack,
      errorType: 'caught',
      showErrorModal: true,
    };
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
      errorType: '',
      showErrorModal: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          {this.state.showErrorModal && (
            <ErrorModal
              message={this.state.errorMessage}
              details={this.state.errorDetails}
              onRetry={this.handleRetry}
            />
          )}
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
