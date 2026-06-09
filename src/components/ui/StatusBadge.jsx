import './StatusBadge.css';

const STATUS_MAP = {
  'Disponible':    'success',
  'Prestado':      'danger',
  'Reservado':     'warning',
  'Dado de baja':  'muted',
  'Vencido':       'overdue',
  'Activo':        'success',
  'Devuelto':      'info',
  'Pendiente':     'warning',
  'Pagada':        'success',
  'Aprobada':      'success',
  'Rechazada':     'danger',
};

export default function StatusBadge({ status, size = 'md' }) {
  const variant = STATUS_MAP[status] || 'muted';

  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      <span className="badge__dot" aria-hidden="true" />
      {status}
    </span>
  );
}
