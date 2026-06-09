import { useState, useEffect, useCallback } from 'react'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getRemovalRequests, approveRemovalRequest, rejectRemovalRequest } from '../../data/mockService'
import { useToast } from '../../context/ToastContext'
import './RemovalRequestsPage.css'

export default function RemovalRequestsPage() {
  const { addToast } = useToast()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null) // 'approve' | 'reject'
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getRemovalRequests()
      setRequests(data)
    } catch {
      addToast('Error al cargar las solicitudes', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleOpenConfirm = (action, request, e) => {
    e.stopPropagation()
    setConfirmAction(action)
    setConfirmTarget(request)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!confirmTarget || !confirmAction) return
    setConfirmLoading(true)
    try {
      if (confirmAction === 'approve') {
        await approveRemovalRequest(confirmTarget.id)
        addToast('Solicitud aprobada exitosamente', 'success')
      } else {
        await rejectRemovalRequest(confirmTarget.id)
        addToast('Solicitud rechazada', 'info')
      }
      setConfirmOpen(false)
      setConfirmTarget(null)
      setConfirmAction(null)
      await fetchRequests()
    } catch {
      addToast('Error al procesar la solicitud', 'error')
    } finally {
      setConfirmLoading(false)
    }
  }

  const columns = [
    {
      key: 'libro',
      label: 'Libro',
      sortable: true,
      render: (row) => row.libro?.titulo || 'Libro desconocido',
    },
    {
      key: 'ejemplar',
      label: 'Ejemplar',
      width: '130px',
      render: (row) => {
        const copy = row.libro?.ejemplares?.find((e) => e.id === row.ejemplarId)
        return copy?.codigoBarras || `#${row.ejemplarId}`
      },
    },
    {
      key: 'solicitante',
      label: 'Solicitado por',
      render: (row) =>
        row.solicitante
          ? `${row.solicitante.nombre} ${row.solicitante.apellido}`
          : 'Desconocido',
    },
    {
      key: 'motivo',
      label: 'Motivo',
      sortable: true,
      render: (row) => row.motivo,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      width: '120px',
      render: (row) => row.fecha,
    },
    {
      key: 'estado',
      label: 'Estado',
      width: '130px',
      render: (row) => <StatusBadge status={row.estado} size="sm" />,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '200px',
      render: (row) => {
        if (row.estado !== 'Pendiente') {
          return <div className="removal-status-cell">--</div>
        }
        return (
          <div className="removal-actions">
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => handleOpenConfirm('approve', row, e)}
            >
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => handleOpenConfirm('reject', row, e)}
            >
              Rechazar
            </Button>
          </div>
        )
      },
    },
  ]

  const confirmTitle =
    confirmAction === 'approve' ? 'Aprobar solicitud de baja' : 'Rechazar solicitud de baja'
  const confirmMessage =
    confirmAction === 'approve'
      ? `Se aprobara la baja del ejemplar. El ejemplar quedara marcado como "Dado de baja" y no estara disponible para prestamos.`
      : `Se rechazara la solicitud de baja. El ejemplar permanecera en su estado actual.`

  return (
    <div className="removal-page">
      <h1>Solicitudes de Baja</h1>

      <DataTable
        columns={columns}
        data={requests}
        loading={loading}
        emptyMessage="No hay solicitudes de baja registradas."
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setConfirmTarget(null)
          setConfirmAction(null)
        }}
        onConfirm={handleConfirm}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel={confirmAction === 'approve' ? 'Aprobar' : 'Rechazar'}
        variant={confirmAction === 'approve' ? 'primary' : 'danger'}
        loading={confirmLoading}
      />
    </div>
  )
}
