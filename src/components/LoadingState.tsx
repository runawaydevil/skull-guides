import './LoadingState.css';

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading markdown...</p>
    </div>
  );
}

