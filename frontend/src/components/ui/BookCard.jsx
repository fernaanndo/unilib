import { BookOpen } from 'lucide-react';
import './BookCard.css';

export default function BookCard({ book, onClick, view = 'grid' }) {
  const { titulo, autor, anio, categoria, portadaUrl, ejemplares = [] } = book;

  const totalEjemplares = ejemplares.length;
  const disponibles = ejemplares.filter((e) => e.estado === 'Disponible').length;

  const availabilityStatus = (() => {
    if (totalEjemplares === 0) return 'none';
    if (disponibles === 0) return 'none';
    if (disponibles === totalEjemplares) return 'full';
    return 'partial';
  })();

  const availabilityText =
    disponibles === 0
      ? 'No disponible'
      : `${disponibles} disponible${disponibles > 1 ? 's' : ''}`;

  const availabilityPercent =
    totalEjemplares > 0 ? (disponibles / totalEjemplares) * 100 : 0;

  if (view === 'list') {
    return (
      <div
        className="book-card book-card--list"
        onClick={() => onClick?.(book)}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(book);
          }
        }}
      >
        <div className="book-card__thumb">
          {portadaUrl ? (
            <img src={portadaUrl} alt={`Portada de ${titulo}`} className="book-card__thumb-img" />
          ) : (
            <div className="book-card__thumb-placeholder">
              <BookOpen size={24} strokeWidth={1.2} />
            </div>
          )}
        </div>

        <div className="book-card__list-info">
          <h3 className="book-card__title book-card__title--list">{titulo}</h3>
          <span className="book-card__author">{autor}</span>
        </div>

        {categoria && (
          <span className="book-card__badge">{categoria}</span>
        )}

        <div className={`book-card__availability book-card__availability--${availabilityStatus}`} role="status" aria-label={`Estado: ${availabilityText}`}>
          <span className="book-card__availability-text">{availabilityText}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="book-card book-card--grid"
      onClick={() => onClick?.(book)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(book);
        }
      }}
    >
      <div className="book-card__cover">
        {portadaUrl ? (
          <img src={portadaUrl} alt={`Portada de ${titulo}`} className="book-card__cover-img" />
        ) : (
          <div className="book-card__cover-placeholder">
            <BookOpen size={40} strokeWidth={1} />
            <span className="book-card__cover-label">Sin portada</span>
          </div>
        )}
      </div>

      <div className="book-card__body">
        <div className="book-card__meta-top">
          {categoria && (
            <span className="book-card__badge">{categoria}</span>
          )}
        </div>

        <h3 className="book-card__title">{titulo}</h3>
        <p className="book-card__author">{autor}</p>
        {anio && <span className="book-card__year">{anio}</span>}

        <div className="book-card__footer">
          <div className={`book-card__availability book-card__availability--${availabilityStatus}`} role="status" aria-label={`Estado: ${availabilityText}`}>
            <div className="book-card__bar-track" aria-hidden="true">
              <div
                className="book-card__bar-fill"
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
            <span className="book-card__availability-text">{availabilityText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
