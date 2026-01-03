import type { FetchError } from '../lib/types';
import './ErrorState.css';

interface ErrorStateProps {
  error: FetchError;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h2>Error {error.status}</h2>
      <p>{error.message}</p>
      {onRetry && (
        <button className="error-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

