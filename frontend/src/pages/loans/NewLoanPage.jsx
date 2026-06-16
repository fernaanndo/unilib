import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  BookOpen,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Package,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import SearchBar from '../../components/ui/SearchBar'
import Avatar from '../../components/ui/Avatar'
import StatusBadge from '../../components/ui/StatusBadge'
import BookCard from '../../components/ui/BookCard'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import { getUsers, getBooks, getLoansByUser, getFines, createLoan } from '../../data/mockService'
import { useToast } from '../../context/ToastContext'
import { ROLE_LABELS, LOAN_LIMITS } from '../../data/permissions'
import './NewLoanPage.css'

const STEPS = [
  { key: 1, label: 'Seleccionar Usuario' },
  { key: 2, label: 'Seleccionar Libro' },
  { key: 3, label: 'Confirmar Préstamo' },
]

export default function NewLoanPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 state
  const [userSearch, setUserSearch] = useState('')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userLoans, setUserLoans] = useState([])
  const [userFines, setUserFines] = useState([])
  const [userInfoLoading, setUserInfoLoading] = useState(false)

  // Step 2 state
  const [bookSearch, setBookSearch] = useState('')
  const [books, setBooks] = useState([])
  const [booksLoading, setBooksLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedCopy, setSelectedCopy] = useState(null)

  // Step 3 state
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdLoan, setCreatedLoan] = useState(null)
  const [submitError, setSubmitError] = useState('')

  // Fetch users on search
  const fetchUsers = useCallback(async () => {
    if (!userSearch.trim()) {
      setUsers([])
      return
    }
    setUsersLoading(true)
    try {
      const data = await getUsers({ search: userSearch })
      // Only show estudiante and docente
      setUsers(data.filter(u => u.rol === 'estudiante' || u.rol === 'docente'))
    } catch {
      addToast('Error al buscar usuarios', 'error')
    } finally {
      setUsersLoading(false)
    }
  }, [userSearch, addToast])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  // Fetch user info on selection
  const fetchUserInfo = useCallback(async (userId) => {
    setUserInfoLoading(true)
    try {
      const [loans, fines] = await Promise.all([
        getLoansByUser(userId),
        getFines({ usuarioId: userId }),
      ])
      setUserLoans(loans.filter(l => l.estado === 'Activo'))
      setUserFines(fines.filter(f => f.estado === 'Pendiente'))
    } catch {
      addToast('Error al cargar información del usuario', 'error')
    } finally {
      setUserInfoLoading(false)
    }
  }, [addToast])

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    fetchUserInfo(user.id)
  }

  // User eligibility
  const userLoanLimit = selectedUser
    ? (LOAN_LIMITS[selectedUser.rol]?.maxBooks || 3)
    : 3

  const hasPendingFines = userFines.length > 0
  const isAtLimit = userLoans.length >= userLoanLimit
  const isUserEligible = selectedUser && !hasPendingFines && !isAtLimit && !userInfoLoading

  // Fetch books on step 2
  const fetchBooks = useCallback(async () => {
    setBooksLoading(true)
    try {
      const data = await getBooks({
        disponibilidad: 'disponible',
        search: bookSearch || undefined,
      })
      setBooks(data)
    } catch {
      addToast('Error al cargar libros', 'error')
    } finally {
      setBooksLoading(false)
    }
  }, [bookSearch, addToast])

  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(fetchBooks, 300)
      return () => clearTimeout(timer)
    }
  }, [currentStep, fetchBooks])

  // Available copies for selected book
  const availableCopies = useMemo(() => {
    if (!selectedBook) return []
    return selectedBook.ejemplares.filter(e => e.estado === 'Disponible')
  }, [selectedBook])

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    const copies = book.ejemplares.filter(e => e.estado === 'Disponible')
    setSelectedCopy(copies.length === 1 ? copies[0] : null)
  }

  // Due date calculation
  const dueDate = useMemo(() => {
    if (!selectedUser) return ''
    const days = LOAN_LIMITS[selectedUser.rol]?.maxDays || 7
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }, [selectedUser])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  // Submit loan
  const handleSubmit = async () => {
    if (!selectedUser || !selectedBook || !selectedCopy) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const loan = await createLoan({
        usuarioId: selectedUser.id,
        libroId: selectedBook.id,
        ejemplarId: selectedCopy.id,
      })
      setCreatedLoan(loan)
      setSuccess(true)
      addToast('Préstamo creado exitosamente', 'success')
    } catch (err) {
      setSubmitError(err.message || 'Error al crear el préstamo')
      addToast(err.message || 'Error al crear el préstamo', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Step navigation
  const goNext = () => setCurrentStep(s => Math.min(s + 1, 3))
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  // Success view
  if (success && createdLoan) {
    return (
      <div className="new-loan-page">
        <div className="new-loan-success">
          <div className="new-loan-success__icon">
            <CheckCircle size={56} strokeWidth={1.2} />
          </div>
          <h2 className="new-loan-success__title">Préstamo registrado</h2>
          <p className="new-loan-success__text">
            El préstamo ha sido creado exitosamente. Se ha enviado un correo de confirmación al usuario.
          </p>
          <div className="new-loan-success__details">
            <div className="new-loan-success__detail">
              <span className="new-loan-success__label">Usuario</span>
              <span>{createdLoan.usuario?.nombre} {createdLoan.usuario?.apellido}</span>
            </div>
            <div className="new-loan-success__detail">
              <span className="new-loan-success__label">Libro</span>
              <span>{createdLoan.libro?.titulo}</span>
            </div>
            <div className="new-loan-success__detail">
              <span className="new-loan-success__label">Fecha devolución</span>
              <span>{formatDate(createdLoan.fechaDevolucionEsperada)}</span>
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate('/prestamos')}>
            Ir a préstamos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="new-loan-page">
      {/* Header */}
      <div className="new-loan-header">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/prestamos')}
          size="sm"
        >
          Volver
        </Button>
        <h1>Nuevo Préstamo</h1>
      </div>

      {/* Steps indicator */}
      <div className="new-loan-steps">
        {STEPS.map((step, idx) => (
          <div key={step.key} className="new-loan-steps__item">
            {idx > 0 && (
              <div className={`new-loan-steps__line ${currentStep > idx ? 'new-loan-steps__line--done' : ''}`} />
            )}
            <div
              className={`new-loan-steps__circle ${
                currentStep === step.key
                  ? 'new-loan-steps__circle--active'
                  : currentStep > step.key
                    ? 'new-loan-steps__circle--done'
                    : ''
              }`}
            >
              {currentStep > step.key ? (
                <CheckCircle size={16} />
              ) : (
                step.key
              )}
            </div>
            <span
              className={`new-loan-steps__label ${
                currentStep >= step.key ? 'new-loan-steps__label--active' : ''
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Select User */}
      {currentStep === 1 && (
        <div className="new-loan-step">
          <h2 className="new-loan-step__title">
            <User size={20} />
            Seleccionar Usuario
          </h2>

          <SearchBar
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Buscar por nombre, email o RUT..."
            className="new-loan-step__search"
          />

          {usersLoading && (
            <div className="new-loan-user-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="new-loan-user-card">
                  <LoadingSkeleton variant="text" />
                </div>
              ))}
            </div>
          )}

          {!usersLoading && users.length > 0 && (
            <div className="new-loan-user-list">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`new-loan-user-card ${selectedUser?.id === user.id ? 'new-loan-user-card--selected' : ''}`}
                  onClick={() => handleSelectUser(user)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelectUser(user)
                    }
                  }}
                >
                  <Avatar nombre={user.nombre} apellido={user.apellido} size="md" />
                  <div className="new-loan-user-card__info">
                    <span className="new-loan-user-card__name">
                      {user.nombre} {user.apellido}
                    </span>
                    <span className="new-loan-user-card__email">{user.email}</span>
                  </div>
                  <StatusBadge status={ROLE_LABELS[user.rol] || user.rol} size="sm" />
                </div>
              ))}
            </div>
          )}

          {!usersLoading && userSearch.trim() && users.length === 0 && (
            <p className="new-loan-empty">No se encontraron usuarios.</p>
          )}

          {/* Selected user info */}
          {selectedUser && !userInfoLoading && (
            <div className="new-loan-user-info">
              <div className="new-loan-user-info__row">
                <span>Préstamos activos:</span>
                <strong>{userLoans.length} / {userLoanLimit}</strong>
              </div>

              {hasPendingFines && (
                <div className="new-loan-user-warning new-loan-user-warning--error">
                  <AlertTriangle size={16} />
                  <span>
                    Este usuario tiene {userFines.length} multa{userFines.length > 1 ? 's' : ''} pendiente{userFines.length > 1 ? 's' : ''}.
                    No puede solicitar préstamos.
                  </span>
                </div>
              )}

              {isAtLimit && (
                <div className="new-loan-user-warning new-loan-user-warning--error">
                  <AlertTriangle size={16} />
                  <span>
                    El usuario ha alcanzado el límite de {userLoanLimit} préstamos activos.
                  </span>
                </div>
              )}
            </div>
          )}

          {selectedUser && userInfoLoading && (
            <div className="new-loan-user-info">
              <LoadingSkeleton variant="text" />
            </div>
          )}

          <div className="new-loan-step__actions">
            <Button
              variant="primary"
              onClick={goNext}
              disabled={!isUserEligible}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Book */}
      {currentStep === 2 && (
        <div className="new-loan-step">
          <h2 className="new-loan-step__title">
            <BookOpen size={20} />
            Seleccionar Libro
          </h2>

          <SearchBar
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            placeholder="Buscar por título, autor o categoría..."
            className="new-loan-step__search"
          />

          {booksLoading && (
            <div className="new-loan-book-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="new-loan-book-skeleton">
                  <LoadingSkeleton variant="rect" width="100%" height="200px" />
                </div>
              ))}
            </div>
          )}

          {!booksLoading && books.length > 0 && (
            <div className="new-loan-book-grid">
              {books.map(book => (
                <div
                  key={book.id}
                  className={`new-loan-book-wrapper ${selectedBook?.id === book.id ? 'new-loan-book-wrapper--selected' : ''}`}
                  onClick={() => handleSelectBook(book)}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}

          {!booksLoading && books.length === 0 && (
            <p className="new-loan-empty">No se encontraron libros disponibles.</p>
          )}

          {/* Copy selection */}
          {selectedBook && availableCopies.length > 1 && (
            <div className="new-loan-copies">
              <h3 className="new-loan-copies__title">
                <Package size={16} />
                Seleccionar ejemplar
              </h3>
              <div className="new-loan-copies__list">
                {availableCopies.map(copy => (
                  <button
                    key={copy.id}
                    type="button"
                    className={`new-loan-copy-btn ${selectedCopy?.id === copy.id ? 'new-loan-copy-btn--selected' : ''}`}
                    onClick={() => setSelectedCopy(copy)}
                  >
                    {copy.codigoBarras}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="new-loan-step__actions">
            <Button variant="secondary" onClick={goBack}>
              Volver
            </Button>
            <Button
              variant="primary"
              onClick={goNext}
              disabled={!selectedBook || !selectedCopy}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {currentStep === 3 && (
        <div className="new-loan-step">
          <h2 className="new-loan-step__title">
            <CheckCircle size={20} />
            Confirmar Préstamo
          </h2>

          <div className="new-loan-summary">
            {/* User info */}
            <div className="new-loan-summary__section">
              <h3 className="new-loan-summary__heading">
                <User size={16} />
                Usuario
              </h3>
              <div className="new-loan-summary__user">
                <Avatar
                  nombre={selectedUser.nombre}
                  apellido={selectedUser.apellido}
                  size="lg"
                />
                <div>
                  <p className="new-loan-summary__name">
                    {selectedUser.nombre} {selectedUser.apellido}
                  </p>
                  <p className="new-loan-summary__meta">
                    {ROLE_LABELS[selectedUser.rol]}
                  </p>
                </div>
              </div>
            </div>

            {/* Book info */}
            <div className="new-loan-summary__section">
              <h3 className="new-loan-summary__heading">
                <BookOpen size={16} />
                Libro
              </h3>
              <div className="new-loan-summary__book">
                <div className="new-loan-summary__book-cover">
                  {selectedBook.portadaUrl ? (
                    <img src={selectedBook.portadaUrl} alt={selectedBook.titulo} />
                  ) : (
                    <div className="new-loan-summary__book-placeholder">
                      <BookOpen size={28} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="new-loan-summary__name">{selectedBook.titulo}</p>
                  <p className="new-loan-summary__meta">{selectedBook.autor}</p>
                </div>
              </div>
            </div>

            {/* Loan details */}
            <div className="new-loan-summary__section">
              <h3 className="new-loan-summary__heading">
                <Calendar size={16} />
                Detalles
              </h3>
              <div className="new-loan-summary__details">
                <div className="new-loan-summary__detail">
                  <span className="new-loan-summary__label">Ejemplar</span>
                  <span>{selectedCopy.codigoBarras}</span>
                </div>
                <div className="new-loan-summary__detail">
                  <span className="new-loan-summary__label">Fecha préstamo</span>
                  <span>{formatDate(new Date().toISOString().split('T')[0])}</span>
                </div>
                <div className="new-loan-summary__detail">
                  <span className="new-loan-summary__label">Fecha devolución</span>
                  <span className="new-loan-summary__due-date">{formatDate(dueDate)}</span>
                </div>
                <div className="new-loan-summary__detail">
                  <span className="new-loan-summary__label">Plazo</span>
                  <span>{LOAN_LIMITS[selectedUser.rol]?.maxDays || 7} días</span>
                </div>
              </div>
            </div>

            <p className="new-loan-summary__note">
              Se enviará un correo de confirmación al usuario con los detalles del préstamo y la fecha de devolución.
            </p>
          </div>

          {submitError && (
            <div className="new-loan-error">
              <AlertTriangle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="new-loan-step__actions">
            <Button variant="secondary" onClick={goBack} disabled={submitting}>
              Volver
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={submitting}
            >
              Confirmar préstamo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
