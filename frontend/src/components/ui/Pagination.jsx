import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust window to always show 3 middle pages when possible
    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 3, 2);
    }

    if (start > 2) pages.push('start-ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('end-ellipsis');

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className={`pagination ${className}`}>
      <span className="pagination__info">
        Mostrando {startItem}-{endItem} de {totalItems} resultados
      </span>

      <nav className="pagination__nav" aria-label="Paginación">
        <button
          className="pagination__btn pagination__btn--arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          type="button"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page) => {
          if (typeof page === 'string') {
            return (
              <span key={page} className="pagination__ellipsis" aria-hidden="true">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              className={`pagination__btn pagination__btn--page ${
                page === currentPage ? 'pagination__btn--active' : ''
              }`}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              type="button"
            >
              {page}
            </button>
          );
        })}

        <button
          className="pagination__btn pagination__btn--arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
}
