import './FilterPanel.css';

export default function FilterPanel({ children, className = '' }) {
  return (
    <div className={`filter-panel ${className}`}>
      {children}
    </div>
  );
}
