import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Shield } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import SearchBar from '../../components/ui/SearchBar'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Pagination from '../../components/ui/Pagination'
import { getUsers } from '../../data/mockService'
import { ROLE_LABELS, ROLE_COLORS } from '../../data/permissions'
import { useToast } from '../../context/ToastContext'
import './UsersPage.css'

const ITEMS_PER_PAGE = 10

const ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
]

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
]

export default function UsersPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const filters = {}
      if (search) filters.search = search
      if (roleFilter) filters.rol = roleFilter
      if (statusFilter !== '') filters.activo = statusFilter === 'true'
      const data = await getUsers(filters)
      setUsers(data)
    } catch {
      addToast('Error al cargar usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter, statusFilter, addToast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter, statusFilter])

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return users.slice(start, start + ITEMS_PER_PAGE)
  }, [users, page])

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
      render: (row) => (
        <div className="users-name-cell">
          <Avatar nombre={row.nombre} apellido={row.apellido} size="sm" src={row.avatarUrl} />
          <span className="users-name-text">{row.nombre} {row.apellido}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => row.email,
    },
    {
      key: 'rol',
      label: 'Rol',
      sortable: true,
      render: (row) => (
        <span
          className="users-role-badge"
          style={{ backgroundColor: ROLE_COLORS[row.rol] || '#6C6C80' }}
        >
          {ROLE_LABELS[row.rol] || row.rol}
        </span>
      ),
    },
    {
      key: 'carrera',
      label: 'Carrera',
      render: (row) => row.carrera || '—',
    },
    {
      key: 'activo',
      label: 'Estado',
      width: '100px',
      render: (row) => (
        <span className={`users-status-dot ${row.activo ? 'users-status-dot--active' : 'users-status-dot--inactive'}`}>
          <span className="users-status-indicator" aria-hidden="true" />
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'fechaRegistro',
      label: 'Fecha Registro',
      sortable: true,
      width: '130px',
      render: (row) => row.fechaRegistro,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '80px',
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="users-view-link"
            onClick={() => navigate(`/usuarios/${row.id}`)}
          >
            Ver
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Gesti&oacute;n de Usuarios</h1>
          {!loading && (
            <p className="users-count">
              <Users size={16} />
              {users.length} usuarios registrados
            </p>
          )}
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          disabled
          title="Integraci&oacute;n con servidor institucional"
        >
          Agregar usuario
        </Button>
      </div>

      <div className="users-filters">
        <div className="users-search">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o RUT..."
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={ROLE_OPTIONS}
          className="users-filter-select"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
          className="users-filter-select"
        />
      </div>

      <div className="users-table">
        <DataTable
          columns={columns}
          data={paginatedUsers}
          loading={loading}
          emptyMessage="No se encontraron usuarios."
          emptyIcon={Users}
          onRowClick={(row) => navigate(`/usuarios/${row.id}`)}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={users.length}
        itemsPerPage={ITEMS_PER_PAGE}
        className="users-pagination"
      />
    </div>
  )
}
