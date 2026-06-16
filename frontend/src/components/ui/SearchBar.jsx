import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Buscar...',
  className = '',
  size = 'md',
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onSearch?.('');
  };

  return (
    <div className={`search-bar search-bar--${size} ${className}`}>
      <Search
        className="search-bar__icon"
        size={size === 'lg' ? 22 : 18}
        aria-hidden="true"
      />
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          type="button"
          aria-label="Limpiar búsqueda"
        >
          <X size={size === 'lg' ? 20 : 16} />
        </button>
      )}
    </div>
  );
}
