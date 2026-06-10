import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchX, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import SearchBar from '../../components/ui/SearchBar';
import BookCard from '../../components/ui/BookCard';
import FilterPanel from '../../components/ui/FilterPanel';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Select from '../../components/ui/Select';
import { getBooks, getCategorias } from '../../data/mockService';
import './SearchPage.css';

const ITEMS_PER_PAGE = 12;
const CATEGORIAS = getCategorias();
const SORT_OPTIONS = [
  { value: '', label: 'Relevancia' },
  { value: 'titulo', label: 'Título A-Z' },
  { value: 'reciente', label: 'Más recientes' },
  { value: 'popular', label: 'Más solicitados' },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategoria, setSelectedCategoria] = useState(searchParams.get('categoria') || '');
  const [disponibilidad, setDisponibilidad] = useState(searchParams.get('disponibilidad') || '');
  const [ordenar, setOrdenar] = useState(searchParams.get('ordenar') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync state to URL
  const syncParams = useCallback((overrides = {}) => {
    const state = {
      q: searchQuery,
      categoria: selectedCategoria,
      disponibilidad,
      ordenar,
      page: String(page),
      ...overrides,
    };
    const params = new URLSearchParams();
    Object.entries(state).forEach(([key, val]) => {
      if (val && val !== '1') params.set(key, val);
      else if (key === 'page' && val !== '1') params.set(key, val);
    });
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategoria, disponibilidad, ordenar, page, setSearchParams]);

  // Fetch books
  const fetchBooks = useCallback(async (filters) => {
    setLoading(true);
    try {
      const result = await getBooks(filters);
      setBooks(result);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (selectedCategoria) filters.categoria = selectedCategoria;
      if (disponibilidad) filters.disponibilidad = disponibilidad;
      if (ordenar) filters.ordenar = ordenar;
      fetchBooks(filters);
      syncParams();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategoria, disponibilidad, ordenar, fetchBooks, syncParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategoria, disponibilidad, ordenar]);

  // Pagination
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const paginatedBooks = books.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleBookClick = (book) => {
    navigate(`/busqueda/${book.id}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategoria('');
    setDisponibilidad('');
    setOrdenar('');
    setPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategoria || disponibilidad || ordenar;

  return (
    <div className="search-page">
      {/* Hero */}
      <section className="search-page__hero">
        <div className="search-page__hero-content">
          <h1 className="search-page__title">Explora el cat&aacute;logo</h1>
          <p className="search-page__subtitle">
            Encuentra libros, textos acad&eacute;micos y materiales de referencia en nuestra colecci&oacute;n.
          </p>
          <div className="search-page__search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={() => {}}
              placeholder="Buscar por t&iacute;tulo, autor, ISBN o categor&iacute;a..."
              size="lg"
              className="search-page__search"
            />
          </div>
        </div>
      </section>

      {/* Mobile filter toggle */}
      <button
        type="button"
        className="search-page__filter-toggle"
        onClick={() => setFiltersOpen((v) => !v)}
        aria-expanded={filtersOpen}
        aria-controls="search-filters"
      >
        <SlidersHorizontal size={16} />
        <span>Filtros</span>
        {hasActiveFilters && <span className="search-page__filter-badge" aria-label="Filtros activos" />}
      </button>

      {/* Filter bar */}
      <FilterPanel className={`search-page__filters ${filtersOpen ? 'search-page__filters--open' : ''}`} id="search-filters">
        <div className="search-page__filter-row">
          {/* Category chips */}
          <div className="search-page__chips-wrapper">
            <div className="search-page__chips">
              <button
                type="button"
                className={`search-page__chip ${!selectedCategoria ? 'search-page__chip--active' : ''}`}
                onClick={() => setSelectedCategoria('')}
              >
                Todos
              </button>
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`search-page__chip ${selectedCategoria === cat ? 'search-page__chip--active' : ''}`}
                  onClick={() => setSelectedCategoria(selectedCategoria === cat ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Availability + Sort */}
          <div className="search-page__filter-controls">
            <div className="search-page__availability-toggle">
              <button
                type="button"
                className={`search-page__toggle-btn ${disponibilidad === '' ? 'search-page__toggle-btn--active' : ''}`}
                onClick={() => setDisponibilidad('')}
              >
                Todos
              </button>
              <button
                type="button"
                className={`search-page__toggle-btn ${disponibilidad === 'disponible' ? 'search-page__toggle-btn--active' : ''}`}
                onClick={() => setDisponibilidad(disponibilidad === 'disponible' ? '' : 'disponible')}
              >
                Disponibles
              </button>
              <button
                type="button"
                className={`search-page__toggle-btn ${disponibilidad === 'prestado' ? 'search-page__toggle-btn--active' : ''}`}
                onClick={() => setDisponibilidad(disponibilidad === 'prestado' ? '' : 'prestado')}
              >
                Prestados
              </button>
            </div>

            <Select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              options={SORT_OPTIONS}
              placeholder="Ordenar por..."
              className="search-page__sort"
            />
          </div>
        </div>
      </FilterPanel>

      {/* Results header */}
      <div className="search-page__results-header">
        <div className="search-page__results-meta">
          {!loading && (
            <span className="search-page__result-count">
              {books.length} {books.length === 1 ? 'resultado' : 'resultados'}
              {hasActiveFilters && (
                <button
                  type="button"
                  className="search-page__clear-link"
                  onClick={handleClearFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </span>
          )}
        </div>

        <div className="search-page__view-toggle">
          <button
            type="button"
            className={`search-page__view-btn ${viewMode === 'grid' ? 'search-page__view-btn--active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Vista de cuadr&iacute;cula"
            title="Vista de cuadr&iacute;cula"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            className={`search-page__view-btn ${viewMode === 'list' ? 'search-page__view-btn--active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="Vista de lista"
            title="Vista de lista"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Results area */}
      <section className="search-page__results">
        {loading ? (
          <div className={`search-page__grid search-page__grid--${viewMode}`}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="search-page__skeleton-card">
                <LoadingSkeleton type="card" height={viewMode === 'grid' ? 360 : 88} />
              </div>
            ))}
          </div>
        ) : paginatedBooks.length > 0 ? (
          <div className={`search-page__grid search-page__grid--${viewMode}`}>
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={handleBookClick}
                view={viewMode}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            message="No se encontraron materiales que coincidan con su búsqueda. Intente con otros términos."
            onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
            showBackHome
          />
        )}
      </section>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          totalItems={books.length}
          itemsPerPage={ITEMS_PER_PAGE}
          className="search-page__pagination"
        />
      )}
    </div>
  );
}
