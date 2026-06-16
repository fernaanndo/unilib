import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowLeftRight, BookOpen } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import SearchBar from '../../components/ui/SearchBar'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import Pagination from '../../components/ui/Pagination'
import StatusBadge from '../../components/ui/StatusBadge'
import Avatar from '../../components/ui/Avatar'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { getLoans, returnLoan } from '../../data/mockService'
import { useToast } from '../../context/ToastContext'
import './LoansPage.css'

const ITEMS_PER_PAGE = 10

export default function LoansPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('todos')
  const [page, setPage] = useState(1)

  // Return confirmation
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [returnTarget, setReturnTarget] = useState(null)
  const [returnLoading, setReturnLoading] = useState(false)

  const fetchLoans = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getLoans()
      setLoans(data)
    } catch {
      addToast('Error al cargar los préstamos', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Reset page on filter changes
  useEffect(() => {
    setPage(1)
  }, [search, activeTab])

  // Counts
  const counts = useMemo(() => {
    const activos = loans.filter(l => l.estado === 'Activo').length
    const vencidos = loans.filter(l => l.estado === 'Vencido').length
    const devueltos = loans.filter(l => l.estado === 'Devuelto').length
    return { activos, vencidos, devueltos }
  }, [loans])

  const tabs = [
    { key: 'todos', label: 'Todos' },
    { key: 'Activo', label: 'Activos', count: counts.activos },
    { key: 'Vencido', label: 'Vencidos', count: counts.vencidos },
    { key: 'Devuelto', label: 'Devueltos', count: counts.devueltos },
  ]

  // Filter
  const filteredLoans = useMemo(() => {
    let result = [...loans]

    if (activeTab !== 'todos') {
      result = result.filter(l => l.estado === activeTab)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(l => {
        const userName = l.usuario
          ? `${l.usuario.nombre} ${l.usuario.apellido}`.toLowerCase()
          : ''
        const bookTitle = l.libro ? l.libro.titulo.toLowerCase() : ''
        return userName.includes(q) || bookTitle.includes(q)
      })
    }

    return result
  }, [loans, activeTab, search])

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE)
  const paginatedLoans = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredLoans.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredLoans, page])

  // Return handler
  const handleReturnClick = (loan) => {
    setReturnTarget(loan)
    setReturnDialogOpen(true)
  }

  const handleReturnConfirm = async () => {
    if (!returnTarget) return
    setReturnLoading(true)
    try {
      await returnLoan(returnTarget.id)
      addToast('Devolución registrada exitosamente', 'success')
      setReturnDialogOpen(false)
      setReturnTarget(null)
      fetchLoans()
    } catch {
      addToast('Error al registrar la devolución', 'error')
    } finally {
      setReturnLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  const columns = [
    {
      key: 'usuario',
      label: 'Usuario',
      render: (row) => {
        if (!row.usuario) return '—'
        return (
          <div className="loans-user-cell">
            <Avatar
              nombre={row.usuario.nombre}
              apellido={row.usuario.apellido}
              size="sm"
            />
            <span className="loans-user-name">
              {row.usuario.nombre} {row.usuario.apellido}
            </span>
          </div>
        )
      },
    },
    {
      key: 'libro',
      label: 'Libro',
      render: (row) => row.libro ? row.libro.titulo : '—',
    },
    {
      key: 'fechaPrestamo',
      label: 'Fecha Préstamo',
      sortable: true,
      render: (row) => formatDate(row.fechaPrestamo),
    },
    {
      key: 'fechaDevolucion',
      label: 'Fecha Devolución',
      render: (row) => {
        if (row.estado === 'Devuelto') return formatDate(row.fechaDevolucionReal)
        return formatDate(row.fechaDevolucionEsperada)
      },
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
      width: '180px',
      render: (row) => {
        if (row.estado === 'Activo' || row.estado === 'Vencido') {
          return (
            <div className="loans-actions" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                variant="secondary"
                icon={ArrowLeftRight}
                onClick={() => handleReturnClick(row)}
              >
                Registrar devolución
              </Button>
            </div>
          )
        }
        return null
      },
    },
  ]

  return (
    <div className="loans-page">
      <div className="loans-header">
        <h1>Préstamos</h1>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/prestamos/nuevo')}
        >
          Nuevo préstamo
        </Button>
      </div>

      <div className="loans-search">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por usuario o libro..."
        />
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="loans-tabs"
      />

      <div className="loans-table">
        <DataTable
          columns={columns}
          data={paginatedLoans}
          loading={loading}
          emptyMessage="No se encontraron préstamos."
          emptyIcon={BookOpen}
          className={activeTab === 'Vencido' ? '' : ''}
          keyExtractor={(row) => row.id}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filteredLoans.length}
        itemsPerPage={ITEMS_PER_PAGE}
        className="loans-pagination"
      />

      <ConfirmDialog
        isOpen={returnDialogOpen}
        onClose={() => {
          setReturnDialogOpen(false)
          setReturnTarget(null)
        }}
        onConfirm={handleReturnConfirm}
        title="Registrar devolución"
        message={
          returnTarget
            ? `¿Confirmar la devolución del libro "${returnTarget.libro?.titulo}" prestado a ${returnTarget.usuario?.nombre} ${returnTarget.usuario?.apellido}?`
            : ''
        }
        confirmLabel="Confirmar devolución"
        cancelLabel="Cancelar"
        variant="primary"
        loading={returnLoading}
      />
    </div>
  )
}
