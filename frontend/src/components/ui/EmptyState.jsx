import { Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin resultados',
  message = 'No se encontraron elementos.',
  actionLabel,
  onAction,
  onClearFilters,
  showBackHome = false,
  className = '',
}) {
  const navigate = useNavigate();

  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon" aria-hidden="true">
        <Icon size={48} strokeWidth={1.2} />
      </div>

      <h3 className="empty-state__title">{title}</h3>

      <p className="empty-state__message">{message}</p>

      {(actionLabel || onClearFilters || showBackHome) && (
        <div className="empty-state__actions">
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {onClearFilters && (
            <button
              className="empty-state__clear"
              onClick={onClearFilters}
              type="button"
            >
              Limpiar filtros
            </button>
          )}
          {showBackHome && (
            <button
              className="empty-state__clear"
              onClick={() => navigate('/')}
              type="button"
            >
              Volver al inicio
            </button>
          )}
        </div>
      )}
    </div>
  );
}
