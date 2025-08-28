import './LoadingSkeleton.css';

export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-content">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-country">
            <div className="skeleton-title"></div>
            <div className="skeleton-info"></div>
            <div className="skeleton-table">
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
