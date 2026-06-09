import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users, Mail, Calendar, BookOpen, Shield } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Tabs from '../../components/ui/Tabs'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { getUserById, getLoansByUser, getFines } from '../../data/mockService'
import { ROLE_LABELS, ROLE_COLORS } from '../../data/permissions'
import { useToast } from '../../context/ToastContext'
import './UserDetailPage.css'

const LOAN_COLUMNS = [
  {
    key: 'libro',
    label: 'Libro',
    render: (row) => row.libro?.titulo || `Libro #${row.libroId}`,
  },
  {
    key: 'fechaPrestamo',
    label: 'Fecha',
    sortable: true,
    width: '120px',
    render: (row) => row.fechaPrestamo,
  },
  {
    key: 'fechaDevolucionEsperada',
    label: 'Devolución',
    width: '120px',
    render: (row) => row.fechaDevolucionReal || row.fechaDevolucionEsperada,
  },
  {
    key: 'estado',
    label: 'Estado',
    width: '120px',
    render: (row) => <StatusBadge status={row.estado} size="sm" />,
  },
]

const FINE_COLUMNS = [
  {
    key: 'motivo',
    label: 'Préstamo',
    render: (row) => row.motivo,
  },
  {
    key: 'monto',
    label: 'Monto',
    width: '120px',
    render: (row) => `$${row.monto.toLocaleString('es-CL')}`,
  },
  {
    key: 'estado',
    label: 'Estado',
    width: '120px',
    render: (row) => <StatusBadge status={row.estado} size="sm" />,
  },
  {
    key: 'fechaGeneracion',
    label: 'Fecha',
    width: '120px',
    sortable: true,
    render: (row) => row.fechaGeneracion,
  },
]

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [user, setUser] = useState(null)
  const [loans, setLoans] = useState([])
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setNotFound(false)

      try {
        const userData = await getUserById(id)
        if (cancelled) return

        if (!userData) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setUser(userData)

        const [userLoans, userFines] = await Promise.all([
          getLoansByUser(id),
          getFines({ usuarioId: Number(id) }),
        ])

        if (!cancelled) {
          setLoans(userLoans)
          setFines(userFines)
        }
      } catch {
        if (!cancelled) {
          addToast('Error al cargar datos del usuario', 'error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [id, addToast])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const tabs = [
    { key: 'info', label: 'Información' },
    { key: 'loans', label: 'Préstamos', count: loans.length },
    { key: 'fines', label: 'Multas', count: fines.length },
  ]

  if (loading) {
    return (
      <div className="user-detail">
        <div className="user-detail__back">
          <LoadingSkeleton variant="text" width={200} />
        </div>
        <div className="user-detail__profile-card">
          <LoadingSkeleton variant="circle" width={80} height={80} />
          <LoadingSkeleton variant="text" width="60%" height={28} />
          <LoadingSkeleton variant="text" width="40%" />
          <LoadingSkeleton variant="text" width="30%" />
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="user-detail">
        <Link to="/usuarios" className="user-detail__back-link">
          <ArrowLeft size={18} />
          Volver a usuarios
        </Link>
        <div className="user-detail__not-found">
          <Users size={48} strokeWidth={1} />
          <h2>Usuario no encontrado</h2>
          <p>El usuario que buscas no existe o ha sido eliminado.</p>
          <button className="user-detail__back-btn" onClick={() => navigate('/usuarios')}>
            Volver a usuarios
          </button>
        </div>
      </div>
    )
  }

  const infoFields = [
    { label: 'Nombre completo', value: `${user.nombre} ${user.apellido}` },
    { label: 'Email', value: user.email },
    { label: 'RUT', value: user.rut || '—' },
    { label: 'Rol', value: ROLE_LABELS[user.rol] || user.rol },
    { label: 'Carrera', value: user.carrera || '—' },
    { label: 'Facultad', value: user.facultad || '—' },
    { label: 'Fecha de registro', value: user.fechaRegistro },
    { label: 'Estado', value: user.activo ? 'Activo' : 'Inactivo' },
  ]

  return (
    <div className="user-detail">
      <Link to="/usuarios" className="user-detail__back-link">
        <ArrowLeft size={18} />
        Volver a usuarios
      </Link>

      {/* Profile card */}
      <div className="user-detail__profile-card">
        <div className="user-detail__profile-top">
          <Avatar nombre={user.nombre} apellido={user.apellido} size="lg" src={user.avatarUrl} />
          <div className="user-detail__profile-info">
            <h1 className="user-detail__name">{user.nombre} {user.apellido}</h1>
            <p className="user-detail__email">
              <Mail size={14} />
              {user.email}
            </p>
            <div className="user-detail__meta-row">
              <span
                className="user-detail__role-badge"
                style={{ backgroundColor: ROLE_COLORS[user.rol] || '#6C6C80' }}
              >
                <Shield size={12} />
                {ROLE_LABELS[user.rol] || user.rol}
              </span>
              <span className={`user-detail__status ${user.activo ? 'user-detail__status--active' : 'user-detail__status--inactive'}`}>
                <span className="user-detail__status-dot" aria-hidden="true" />
                {user.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {user.carrera && (
              <p className="user-detail__carrera">
                <BookOpen size={14} />
                {user.carrera} — {user.facultad}
              </p>
            )}
            <p className="user-detail__fecha">
              <Calendar size={14} />
              Registrado el {user.fechaRegistro}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="user-detail__tabs"
      />

      {/* Tab content */}
      <div className="user-detail__tab-content">
        {activeTab === 'info' && (
          <div className="user-detail__info-grid">
            {infoFields.map((field) => (
              <div key={field.label} className="user-detail__info-item">
                <span className="user-detail__info-label">{field.label}</span>
                <span className="user-detail__info-value">{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'loans' && (
          <DataTable
            columns={LOAN_COLUMNS}
            data={loans}
            emptyMessage="Este usuario no tiene préstamos registrados."
            emptyIcon={BookOpen}
          />
        )}

        {activeTab === 'fines' && (
          <DataTable
            columns={FINE_COLUMNS}
            data={fines}
            emptyMessage="Este usuario no tiene multas registradas."
          />
        )}
      </div>
    </div>
  )
}
