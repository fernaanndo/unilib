import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, BookOpen } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import SearchBar from '../../components/ui/SearchBar'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { getBooks, createRemovalRequest } from '../../data/mockService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './CatalogPage.css'

const ITEMS_PER_PAGE = 8

export default function CatalogPage() {
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()
  const { addToast } = useToast()

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Removal dialog state
  const [removalOpen, setRemovalOpen] = useState(false)
  const [removalTarget, setRemovalTarget] = useState(null)
  const [removalReason, setRemovalReason] = useState('Deteriorado')
  const [removalObs, setRemovalObs] = useState('')
  const [removalLoading, setRemovalLoading] = useState(false)
  // Copy selection for removal
  const [removalCopyId, setRemovalCopyId] = useState('')

  const canManage = hasPermission('manage_catalog')

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getBooks({ search: search || undefined })
      setBooks(data)
    } catch {
      addToast('Error al cargar el catálogo', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, addToast])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  // Pagination
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE)
  const paginatedBooks = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return books.slice(start, start + ITEMS_PER_PAGE)
  }, [books, page])

  // Open removal dialog
  const handleOpenRemoval = (book, e) => {
    e.stopPropagation()
    setRemovalTarget(book)
    setRemovalReason('Deteriorado')
    setRemovalObs('')
    setRemovalCopyId(book.ejemplares[0]?.id || '')
    setRemovalOpen(true)
  }

  // Submit removal request
  const handleRemovalSubmit = async () => {
    if (!removalTarget || !removalCopyId) return
    setRemovalLoading(true)
    try {
      await createRemovalRequest({
        libroId: removalTarget.id,
        ejemplarId: Number(removalCopyId),
        solicitadoPor: user.id,
        motivo: removalReason,
        observaciones: removalObs,
      })
      addToast('Solicitud de baja creada exitosamente', 'success')
      setRemovalOpen(false)
      setRemovalTarget(null)
    } catch {
      addToast('Error al crear la solicitud de baja', 'error')
    } finally {
      setRemovalLoading(false)
    }
  }

  const columns = [
    {
      key: 'portada',
      label: 'Portada',
      width: '64px',
      render: (row) =>
        row.portadaUrl ? (
          <img src={row.portadaUrl} alt={row.titulo} className="catalog-thumb" />
        ) : (
          <div className="catalog-thumb-placeholder">
            <BookOpen size={18} />
          </div>
        ),
    },
    {
      key: 'titulo',
      label: 'Titulo',
      sortable: true,
      render: (row) => row.titulo,
    },
    {
      key: 'autor',
      label: 'Autor',
      sortable: true,
      render: (row) => row.autor,
    },
    {
      key: 'categoria',
      label: 'Categoria',
      sortable: true,
      render: (row) => row.categoria,
    },
    {
      key: 'ejemplares',
      label: 'Ejemplares',
      width: '100px',
      render: (row) => row.ejemplares.length,
    },
    {
      key: 'disponibles',
      label: 'Disponibles',
      width: '110px',
      render: (row) => {
        const available = row.ejemplares.filter((e) => e.estado === 'Disponible').length
        const status = available > 0 ? 'Disponible' : 'Prestado'
        return (
          <StatusBadge status={status} size="sm">
            {available}
          </StatusBadge>
        )
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: canManage ? '240px' : '80px',
      render: (row) => (
        <div className="catalog-actions" onClick={(e) => e.stopPropagation()}>
          <Link to={`/busqueda/${row.id}`} className="catalog-view-link">
            Ver
          </Link>
          {canManage && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/catalogo/${row.id}/editar`)
                }}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={(e) => handleOpenRemoval(row, e)}
              >
                Dar de baja
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Catalogo</h1>
        {canManage && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/catalogo/nuevo')}
          >
            Agregar libro
          </Button>
        )}
      </div>

      <div className="catalog-search">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por titulo, autor, categoria o ISBN..."
        />
      </div>

      <div className="catalog-table">
        <DataTable
          columns={columns}
          data={paginatedBooks}
          loading={loading}
          emptyMessage="No se encontraron libros."
          emptyIcon={BookOpen}
          onRowClick={(row) => navigate(`/busqueda/${row.id}`)}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={books.length}
        itemsPerPage={ITEMS_PER_PAGE}
        className="catalog-pagination"
      />

      {/* Removal Request Modal */}
      <Modal
        isOpen={removalOpen}
        onClose={() => setRemovalOpen(false)}
        title="Solicitud de baja"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              onClick={() => setRemovalOpen(false)}
              disabled={removalLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleRemovalSubmit}
              loading={removalLoading}
            >
              Solicitar baja
            </Button>
          </div>
        }
      >
        {removalTarget && (
          <div>
            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Crear solicitud de baja para <strong>{removalTarget.titulo}</strong>
            </p>

            {removalTarget.ejemplares.length > 1 && (
              <div className="catalog-removal-field">
                <label>Ejemplar</label>
                <select
                  className="catalog-removal-select"
                  value={removalCopyId}
                  onChange={(e) => setRemovalCopyId(e.target.value)}
                >
                  {removalTarget.ejemplares.map((ej) => (
                    <option key={ej.id} value={ej.id}>
                      {ej.codigoBarras} ({ej.estado})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="catalog-removal-field">
              <label>Motivo</label>
              <select
                className="catalog-removal-select"
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
              >
                <option value="Deteriorado">Deteriorado</option>
                <option value="Obsoleto">Obsoleto</option>
                <option value="Extraviado">Extraviado</option>
              </select>
            </div>

            <div className="catalog-removal-field">
              <label>Observaciones</label>
              <textarea
                className="catalog-removal-textarea"
                value={removalObs}
                onChange={(e) => setRemovalObs(e.target.value)}
                placeholder="Detalle adicional sobre la solicitud..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
