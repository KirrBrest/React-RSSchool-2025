import type { ErrorModalProps, ErrorModalState } from '@/types/interfaces';
import { Component } from 'react';

class ErrorModal extends Component<ErrorModalProps, ErrorModalState> {
  render() {
    const { message, details, onRetry } = this.props;
    return (
      <div className="error-wrap">
        <div className="error-modal">
          <h2>ERROR</h2>
          <p>
            <strong>Message:</strong> {message}
          </p>
          {details && <pre className="error-details">{details}</pre>}
          <button className="error-button" onClick={onRetry}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorModal;
