import type { ErrorModalProps } from '@/types/interfaces';
import Button from '@/components/button/Button';

const ErrorModal = ({ message, details, onRetry }: ErrorModalProps) => {
  return (
    <div className="error-wrap">
      <div className="error-modal">
        <h2>ERROR</h2>
        <p>
          <strong>Message:</strong> {message}
        </p>
        {details && <pre className="error-details">{details}</pre>}
        <Button className="error-button" onClick={onRetry} variant="error">
          Try again
        </Button>
      </div>
    </div>
  );
};

export default ErrorModal;
