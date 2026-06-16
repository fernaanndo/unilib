import { useState, useEffect, useCallback } from 'react'
import { Download } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

import Tabs from '../../components/ui/Tabs'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { getAnalyticsData, getLoans, getBooks } from '../../data/mockService'
import { useToast } from '../../context/ToastContext'

import './AnalyticsPage.css'

/* ─── Theme colors ─── */
const COLORS = {
  primary: '#1B4332',
  light: '#2D6A4F',
  accent: '#D4A373',
  success: '#40916C',
  warning: '#F4A261',
  danger: '#E63946',
  info: '#457B9D',
  grid: '#E8E6E1',
}

const INVENTORY_COLORS = {
  Disponible: COLORS.success,
  Prestado: COLORS.danger,
  Reservado: COLORS.warning,
  'Dado de baja': '#6C6C80',
}

const PERIOD_OPTIONS = [
  { value: 'week', label: 'Última semana' },
  { value: 'month', label: 'Último mes' },
  { value: 'quarter', label: 'Último trimestre' },
  { value: 'semester', label: 'Último semestre' },
  { value: 'year', label: 'Último año' },
]

const ANALYTICS_TABS = [
  { key: 'uso', label: 'Uso' },
  { key: 'morosidad', label: 'Morosidad' },
  { key: 'inventario', label: 'Inventario' },
]

/* ─── Custom Tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="analytics-tooltip">
      <div className="analytics-tooltip__label">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="analytics-tooltip__row">
          <span
            className="analytics-tooltip__dot"
            style={{ background: entry.color || entry.fill }}
          />
          <span>{entry.name}</span>
          <span className="analytics-tooltip__value">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Custom Pie Label ─── */
function renderPieLabel({ name, percent }) {
  if (percent < 0.04) return null
  return `${name} (${(percent * 100).toFixed(0)}%)`
}

/* ─── Custom Legend ─── */
function CustomLegend({ payload }) {
  return (
    <div className="analytics-legend">
      {payload?.map((entry) => (
        <div key={entry.value} className="analytics-legend__item">
          <span
            className="analytics-legend__dot"
            style={{ background: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const formatCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
})

export default function AnalyticsPage() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('uso')
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [overdueLoans, setOverdueLoans] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [inventoryAlerts, setInventoryAlerts] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [analyticsResult, loansResult, booksResult] = await Promise.all([
        getAnalyticsData({ period }),
        getLoans({ estado: 'Vencido' }),
        getBooks(),
      ])
      setAnalytics(analyticsResult)
      setOverdueLoans(loansResult)

      // Calculate inventory states from all book copies
      const stateCounts = { Disponible: 0, Prestado: 0, Reservado: 0, 'Dado de baja': 0 }
      const alerts = []

      booksResult.forEach((book) => {
        book.ejemplares.forEach((copy) => {
          const estado = copy.estado || 'Disponible'
          if (stateCounts[estado] !== undefined) {
            stateCounts[estado]++
          }
        })
        const available = book.ejemplares.filter((e) => e.estado === 'Disponible').length
        if (available === 0) {
          alerts.push({
            id: book.id,
            titulo: book.titulo,
            autor: book.autor,
            totalCopies: book.ejemplares.length,
            categoria: book.categoria,
          })
        }
      })

      setInventoryData(
        Object.entries(stateCounts).map(([name, value]) => ({
          name,
          value,
          fill: INVENTORY_COLORS[name] || '#9C9CAF',
        }))
      )
      setInventoryAlerts(alerts)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExport = (format) => {
    addToast({
      type: 'info',
      message: `Exportación de ${format} iniciada`,
    })
  }

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <h1>Analíticas y Reportes</h1>
        </div>
        <LoadingSkeleton type="card" width="100%" height="60px" />
        <div style={{ marginTop: 24 }}>
          <LoadingSkeleton type="card" width="100%" height="380px" />
        </div>
      </div>
    )
  }

  const { loansByMonth, loansByCategory, dailyActivity, delinquencyByMonth } =
    analytics

  /* ─── Overdue table columns ─── */
  const overdueColumns = [
    {
      key: 'usuario',
      label: 'Usuario',
      render: (row) =>
        row.usuario
          ? `${row.usuario.nombre} ${row.usuario.apellido}`
          : 'Desconocido',
    },
    {
      key: 'libro',
      label: 'Libro',
      render: (row) => row.libro?.titulo || 'N/A',
    },
    {
      key: 'diasAtraso',
      label: 'Días de Atraso',
      sortable: true,
      render: (row) => {
        const expected = new Date(row.fechaDevolucionEsperada)
        const now = new Date()
        const days = Math.max(
          0,
          Math.floor((now - expected) / (1000 * 60 * 60 * 24))
        )
        return days
      },
    },
    {
      key: 'montoMulta',
      label: 'Monto Multa',
      render: (row) => {
        const expected = new Date(row.fechaDevolucionEsperada)
        const now = new Date()
        const days = Math.max(
          0,
          Math.floor((now - expected) / (1000 * 60 * 60 * 24))
        )
        return formatCLP.format(days * 500)
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
  ]

  /* ─── Inventory alert columns ─── */
  const alertColumns = [
    { key: 'titulo', label: 'Título', sortable: true },
    { key: 'autor', label: 'Autor' },
    { key: 'categoria', label: 'Categoría' },
    {
      key: 'totalCopies',
      label: 'Ejemplares Totales',
      sortable: true,
    },
  ]

  return (
    <div className="analytics-page">
      {/* ─── Header ─── */}
      <div className="analytics-header">
        <h1>Analíticas y Reportes</h1>
        <div className="analytics-header-actions">
          <Button variant="outline" size="sm" icon={Download} onClick={() => handleExport('PDF')}>
            PDF
          </Button>
          <Button variant="outline" size="sm" icon={Download} onClick={() => handleExport('Excel')}>
            Excel
          </Button>
          <Button variant="outline" size="sm" icon={Download} onClick={() => handleExport('CSV')}>
            CSV
          </Button>
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="analytics-controls">
        <div className="analytics-period-select">
          <Select
            label="Período"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={PERIOD_OPTIONS}
          />
        </div>
        <Tabs
          tabs={ANALYTICS_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="analytics-tabs"
        />
      </div>

      {/* ═══════════ Tab: Uso ═══════════ */}
      {activeTab === 'uso' && (
        <>
          <div className="analytics-chart-row">
            {/* Bar — Préstamos por Mes */}
            <div className="analytics-card">
              <h2 className="analytics-card__title">Préstamos por Mes</h2>
              <div className="analytics-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={loansByMonth}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    <Bar
                      dataKey="prestamos"
                      name="Préstamos"
                      fill={COLORS.light}
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                    <Bar
                      dataKey="devoluciones"
                      name="Devoluciones"
                      fill={COLORS.accent}
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie — Distribución por Categoría */}
            <div className="analytics-card">
              <h2 className="analytics-card__title">
                Distribución por Categoría
              </h2>
              <div className="analytics-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loansByCategory}
                      dataKey="cantidad"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={renderPieLabel}
                      labelLine={{ stroke: '#999', strokeWidth: 1 }}
                    >
                      {loansByCategory.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Line — Actividad Diaria */}
          <div className="analytics-chart-full">
            <div className="analytics-card">
              <h2 className="analytics-card__title">Actividad Diaria</h2>
              <div className="analytics-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyActivity}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    <Line
                      type="monotone"
                      dataKey="prestamos"
                      name="Préstamos"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="devoluciones"
                      name="Devoluciones"
                      stroke={COLORS.accent}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="consultas"
                      name="Consultas"
                      stroke={COLORS.info}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════ Tab: Morosidad ═══════════ */}
      {activeTab === 'morosidad' && (
        <>
          {/* Bar — Tendencia de Morosidad */}
          <div className="analytics-card">
            <h2 className="analytics-card__title">
              Tendencia de Morosidad
            </h2>
            <div className="analytics-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={delinquencyByMonth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Bar
                    dataKey="vencidos"
                    name="Vencidos"
                    fill={COLORS.danger}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="multasGeneradas"
                    name="Multas Generadas"
                    fill={COLORS.warning}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table — Usuarios con préstamos vencidos */}
          <div className="analytics-card">
            <h2 className="analytics-card__title">
              Usuarios con Préstamos Vencidos
            </h2>
            <DataTable
              columns={overdueColumns}
              data={overdueLoans}
              emptyMessage="No hay préstamos vencidos actualmente."
            />
          </div>
        </>
      )}

      {/* ═══════════ Tab: Inventario ═══════════ */}
      {activeTab === 'inventario' && (
        <>
          {/* Pie — Libros por Estado */}
          <div className="analytics-card">
            <h2 className="analytics-card__title">Libros por Estado</h2>
            <div className="analytics-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={renderPieLabel}
                    labelLine={{ stroke: '#999', strokeWidth: 1 }}
                  >
                    {inventoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table — Inventory alerts */}
          <div className="analytics-card">
            <h2 className="analytics-card__title">
              Alertas de Inventario
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
              Libros sin ejemplares disponibles actualmente
            </p>
            <DataTable
              columns={alertColumns}
              data={inventoryAlerts}
              emptyMessage="Todos los libros tienen al menos un ejemplar disponible."
            />
          </div>
        </>
      )}
    </div>
  )
}
