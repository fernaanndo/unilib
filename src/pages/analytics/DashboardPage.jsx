import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Library,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { getDashboardData } from '../../data/mockService'

import './DashboardPage.css'

const AUTO_REFRESH_MS = 60_000

const formatCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
})

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'hace un momento'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="dashboard-tooltip">
      <div className="dashboard-tooltip__label">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="dashboard-tooltip__row">
          <span
            className="dashboard-tooltip__dot"
            style={{ background: entry.color }}
          />
          <span>{entry.name}</span>
          <span className="dashboard-tooltip__value">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const timerRef = useRef(null)

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const result = await getDashboardData()
      setData(result)
      setLastUpdate(Date.now())
      setSecondsAgo(0)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load + auto-refresh
  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(), AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchData])

  // Seconds-ago ticker
  useEffect(() => {
    if (!lastUpdate) return
    timerRef.current = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdate) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [lastUpdate])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-loading">
          <LoadingSkeleton type="card" width="100%" height="110px" />
          <LoadingSkeleton type="card" width="100%" height="110px" />
          <LoadingSkeleton type="card" width="100%" height="110px" />
          <LoadingSkeleton type="card" width="100%" height="110px" />
        </div>
        <LoadingSkeleton type="card" width="100%" height="350px" />
      </div>
    )
  }

  const { kpis, topBooks, loansByMonth, recentActivity } = data

  const topBooksReversed = [...topBooks].reverse()

  return (
    <div className="dashboard-page">
      {/* ─── Header ─── */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <div className="dashboard-header-actions">
          <div className="dashboard-refresh-info">
            <Clock size={14} />
            <span>
              Última actualización: hace {secondsAgo}s
            </span>
            <button
              className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={() => fetchData(true)}
              title="Actualizar datos"
              aria-label="Actualizar datos"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="dashboard-quick-actions">
            <Button
              variant="primary"
              size="sm"
              icon={ArrowUpRight}
              onClick={() => navigate('/loans/new')}
            >
              Nuevo préstamo
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={BookOpen}
              onClick={() => navigate('/catalog/new')}
            >
              Agregar libro
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Row 1: KPIs ─── */}
      <div className="dashboard-kpis">
        <StatCard
          icon={BookOpen}
          label="Préstamos Activos"
          value={kpis.prestamosActivos}
          trend={{ value: 12, isPositive: true }}
          className="stat-card--primary"
        />
        <StatCard
          icon={Library}
          label="Libros Disponibles"
          value={kpis.librosDisponibles}
          className="stat-card--success"
        />
        <StatCard
          icon={AlertTriangle}
          label="Usuarios Morosos"
          value={kpis.usuariosMorosos}
          trend={{ value: -5, isPositive: false }}
          className="stat-card--danger"
        />
        <StatCard
          icon={DollarSign}
          label="Multas Pendientes"
          value={formatCLP.format(kpis.multasPendientes)}
          className="stat-card--warning"
        />
      </div>

      {/* ─── Row 2: Top Books + Recent Activity ─── */}
      <div className="dashboard-row">
        {/* Left — Top 5 books chart */}
        <div className="dashboard-card">
          <h2 className="dashboard-card__title">Top 5 Libros del Mes</h2>
          <div className="dashboard-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topBooksReversed}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="titulo"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="prestamos"
                  name="Préstamos"
                  fill="#2D6A4F"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right — Recent activity */}
        <div className="dashboard-card">
          <h2 className="dashboard-card__title">Actividad Reciente</h2>
          <ul className="activity-list">
            {recentActivity.map((item) => {
              const isReturn = item.estado === 'Devuelto'
              const actionText = isReturn ? 'devolvió' : 'prestó'
              const dateField = isReturn
                ? item.fechaDevolucionReal
                : item.fechaPrestamo

              return (
                <li key={item.id} className="activity-item">
                  <Avatar
                    nombre={item.usuario?.nombre || ''}
                    apellido={item.usuario?.apellido || ''}
                    size="sm"
                  />
                  <div className="activity-item__info">
                    <span className="activity-item__text">
                      <strong>
                        {item.usuario?.nombre} {item.usuario?.apellido}
                      </strong>{' '}
                      <span
                        className={`activity-item__action ${
                          isReturn ? 'activity-item__action--return' : ''
                        }`}
                      >
                        {actionText}
                      </span>{' '}
                      <span className="activity-item__book">
                        {item.libro?.titulo || 'Libro desconocido'}
                      </span>
                    </span>
                  </div>
                  <span className="activity-item__time">
                    {timeAgo(dateField)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* ─── Row 3: Monthly Loans (full width) ─── */}
      <div className="dashboard-full-width">
        <div className="dashboard-card">
          <h2 className="dashboard-card__title">Préstamos Mensuales</h2>
          <div className="dashboard-chart-wrap dashboard-chart-wrap--tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={loansByMonth}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="prestamos"
                  name="Préstamos"
                  fill="#2D6A4F"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="devoluciones"
                  name="Devoluciones"
                  fill="#D4A373"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
