import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import { getLoansByUser, getFines } from '../../data/mockService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './MyLoansPage.css'

export default function MyLoansPage() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [loans, setLoans] = useState([])
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [pastExpanded, setPastExpanded] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [loansData, finesData] = await Promise.all([
        getLoansByUser(user.id),
        getFines({ usuarioId: user.id }),
      ])
      setLoans(loansData)
      setFines(finesData)
    } catch {
      addToast('Error al cargar tus préstamos', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, addToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Group loans
  const { activeLoans, overdueLoans, pastLoans } = useMemo(() => {
    const active = loans.filter(l => l.estado === 'Activo')
    const overdue = loans.filter(l => l.estado === 'Vencido')
    const past = loans.filter(l => l.estado === 'Devuelto')
    return { activeLoans: active, overdueLoans: overdue, pastLoans: past }
  }, [loans])

  // Pending fines
  const pendingFines = useMemo(() => fines.filter(f => f.estado === 'Pendiente'), [fines])
  const totalFines = useMemo(() => pendingFines.reduce((sum, f) => sum + f.monto, 0), [pendingFines])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return 0
    const due = new Date(dateStr + 'T23:59:59')
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getCountdownClass = (days) => {
    if (days < 0) return 'my-loans-countdown--overdue'
    if (days <= 3) return 'my-loans-countdown--warning'
    return 'my-loans-countdown--safe'
  }

  const getCountdownText = (days) => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} día${Math.abs(days) !== 1 ? 's' : ''}`
    if (days === 0) return 'Vence hoy'
    if (days === 1) return 'Vence mañana'
    return `${days} días restantes`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="my-loans-page">
        <h1 className="my-loans-title">Mis Préstamos</h1>
        <div className="my-loans-skeleton-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="my-loans-skeleton-card">
              <LoadingSkeleton variant="rect" width="100%" height="180px" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const allActive = [...overdueLoans, ...activeLoans]

  return (
    <div className="my-loans-page">
      <h1 className="my-loans-title">Mis Préstamos</h1>

      {/* Fines section */}
      {pendingFines.length > 0 && (
        <div className="my-loans-fines">
          <div className="my-loans-fines__header">
            <AlertTriangle size={20} />
            <div>
              <h3 className="my-loans-fines__title">Multas pendientes</h3>
              <p className="my-loans-fines__total">Total: {formatCurrency(totalFines)}</p>
            </div>
          </div>
          <ul className="my-loans-fines__list">
            {pendingFines.map(fine => (
              <li key={fine.id} className="my-loans-fines__item">
                <span>{fine.motivo}</span>
                <span className="my-loans-fines__amount">{formatCurrency(fine.monto)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active loans */}
      {allActive.length > 0 ? (
        <>
          <h2 className="my-loans-section-title">
            Préstamos activos
            <span className="my-loans-section-count">{allActive.length}</span>
          </h2>
          <div className="my-loans-grid">
            {allActive.map(loan => {
              const days = getDaysRemaining(loan.fechaDevolucionEsperada)
              const isOverdue = loan.estado === 'Vencido' || days < 0

              return (
                <div
                  key={loan.id}
                  className={`my-loans-card ${isOverdue ? 'my-loans-card--overdue' : ''}`}
                >
                  {/* Book cover */}
                  <div className="my-loans-card__cover">
                    {loan.libro?.portadaUrl ? (
                      <img
                        src={loan.libro.portadaUrl}
                        alt={loan.libro.titulo}
                        className="my-loans-card__cover-img"
                      />
                    ) : (
                      <div className="my-loans-card__cover-placeholder">
                        <BookOpen size={28} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="my-loans-card__body">
                    <h3 className="my-loans-card__title">
                      {loan.libro?.titulo || 'Libro desconocido'}
                    </h3>
                    <p className="my-loans-card__author">
                      {loan.libro?.autor || '—'}
                    </p>

                    <div className="my-loans-card__dates">
                      <div className="my-loans-card__date">
                        <Calendar size={14} />
                        <span>Préstamo: {formatDate(loan.fechaPrestamo)}</span>
                      </div>
                      <div className="my-loans-card__date">
                        <Clock size={14} />
                        <span>Devolución: {formatDate(loan.fechaDevolucionEsperada)}</span>
                      </div>
                    </div>

                    <div className={`my-loans-countdown ${getCountdownClass(days)}`}>
                      {isOverdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
                      <span>{getCountdownText(days)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <EmptyState
          message="No tienes préstamos activos."
          icon={BookOpen}
        />
      )}

      {/* Past loans */}
      {pastLoans.length > 0 && (
        <div className="my-loans-past">
          <button
            type="button"
            className="my-loans-past__toggle"
            onClick={() => setPastExpanded(v => !v)}
          >
            <span className="my-loans-past__toggle-text">
              Préstamos devueltos
              <span className="my-loans-section-count">{pastLoans.length}</span>
            </span>
            {pastExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {pastExpanded && (
            <ul className="my-loans-past__list">
              {pastLoans.map(loan => (
                <li key={loan.id} className="my-loans-past__item">
                  <div className="my-loans-past__item-icon">
                    <CheckCircle size={16} />
                  </div>
                  <div className="my-loans-past__item-info">
                    <span className="my-loans-past__item-title">
                      {loan.libro?.titulo || 'Libro desconocido'}
                    </span>
                    <span className="my-loans-past__item-meta">
                      {loan.libro?.autor} — Devuelto el {formatDate(loan.fechaDevolucionReal)}
                    </span>
                  </div>
                  <StatusBadge status="Devuelto" size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
