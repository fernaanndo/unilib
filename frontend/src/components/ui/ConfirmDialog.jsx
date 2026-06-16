import { AlertTriangle, Info } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  loading = false,
}) {
  const Icon = variant === 'danger' ? AlertTriangle : Info;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="confirm-dialog">
        <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
          <Icon size={28} strokeWidth={1.5} />
        </div>

        {message && (
          <p className="confirm-dialog__message">{message}</p>
        )}

        <div className="confirm-dialog__actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
