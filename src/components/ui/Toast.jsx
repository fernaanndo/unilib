import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function Toast({ toasts = [], onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;

        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role="status"
          >
            <Icon size={18} className="toast__icon" />
            <span className="toast__message">{toast.message}</span>
            <button
              className="toast__close"
              onClick={() => onRemove(toast.id)}
              aria-label="Cerrar notificación"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
