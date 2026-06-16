import { books as booksData, CATEGORIAS } from './books'
import { users as usersData } from './users'
import { loans as loansData } from './loans'
import { fines as finesData } from './fines'
import { notifications as notificationsData } from './notifications'
import { removalRequests as removalRequestsData } from './removalRequests'
import { dashboardKPIs, loansByMonth, loansByCategory, dailyActivity, topBooks, delinquencyByMonth } from './stats'

// In-memory state (mutations persist during session)
let books = JSON.parse(JSON.stringify(booksData))
let users = JSON.parse(JSON.stringify(usersData))
let loans = JSON.parse(JSON.stringify(loansData))
let fines = JSON.parse(JSON.stringify(finesData))
let notifications = JSON.parse(JSON.stringify(notificationsData))
let removalRequests = JSON.parse(JSON.stringify(removalRequestsData))

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200))
}

function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// ============ BOOKS ============

export async function getBooks(filters = {}) {
  await delay()
  let result = [...books]

  if (filters.search) {
    const q = normalizeText(filters.search)
    result = result.filter(b =>
      normalizeText(b.titulo).includes(q) ||
      normalizeText(b.autor).includes(q) ||
      normalizeText(b.categoria).includes(q) ||
      b.isbn.includes(filters.search)
    )
  }

  if (filters.categoria) {
    result = result.filter(b => b.categoria === filters.categoria)
  }

  if (filters.disponibilidad === 'disponible') {
    result = result.filter(b => b.ejemplares.some(e => e.estado === 'Disponible'))
  } else if (filters.disponibilidad === 'prestado') {
    result = result.filter(b => b.ejemplares.every(e => e.estado !== 'Disponible'))
  }

  if (filters.anioDesde) {
    result = result.filter(b => b.anio >= filters.anioDesde)
  }
  if (filters.anioHasta) {
    result = result.filter(b => b.anio <= filters.anioHasta)
  }

  // Sorting
  if (filters.ordenar === 'titulo') {
    result.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))
  } else if (filters.ordenar === 'reciente') {
    result.sort((a, b) => b.anio - a.anio)
  } else if (filters.ordenar === 'popular') {
    // sort by number of loaned copies descending
    result.sort((a, b) => {
      const aLoaned = a.ejemplares.filter(e => e.estado === 'Prestado').length
      const bLoaned = b.ejemplares.filter(e => e.estado === 'Prestado').length
      return bLoaned - aLoaned
    })
  }

  return result
}

export async function getBookById(id) {
  await delay(200)
  return books.find(b => b.id === Number(id)) || null
}

export async function createBook(bookData) {
  await delay(400)
  const existingIsbn = books.find(b => b.isbn === bookData.isbn)
  if (existingIsbn) {
    throw new Error('ISBN duplicado. El libro ya se encuentra registrado.')
  }
  const newBook = {
    ...bookData,
    id: Math.max(...books.map(b => b.id)) + 1,
    ejemplares: bookData.ejemplares || [],
  }
  books.push(newBook)
  return newBook
}

export async function updateBook(id, bookData) {
  await delay(400)
  const index = books.findIndex(b => b.id === Number(id))
  if (index === -1) throw new Error('Libro no encontrado')
  books[index] = { ...books[index], ...bookData }
  return books[index]
}

export async function checkIsbnExists(isbn) {
  await delay(150)
  return books.some(b => b.isbn === isbn)
}

export function getCategorias() {
  return CATEGORIAS
}

// ============ USERS ============

export async function getUsers(filters = {}) {
  await delay()
  let result = [...users]
  if (filters.search) {
    const q = normalizeText(filters.search)
    result = result.filter(u =>
      normalizeText(u.nombre + ' ' + u.apellido).includes(q) ||
      normalizeText(u.email).includes(q) ||
      (u.rut && u.rut.includes(filters.search))
    )
  }
  if (filters.rol) {
    result = result.filter(u => u.rol === filters.rol)
  }
  if (filters.activo !== undefined) {
    result = result.filter(u => u.activo === filters.activo)
  }
  return result
}

export async function getUserById(id) {
  await delay(200)
  return users.find(u => u.id === Number(id)) || null
}

// ============ LOANS ============

export async function getLoans(filters = {}) {
  await delay()
  let result = [...loans]
  if (filters.estado) {
    result = result.filter(l => l.estado === filters.estado)
  }
  if (filters.usuarioId) {
    result = result.filter(l => l.usuarioId === Number(filters.usuarioId))
  }
  // Enrich with user and book names
  return result.map(l => ({
    ...l,
    usuario: users.find(u => u.id === l.usuarioId),
    libro: books.find(b => b.id === l.libroId),
  }))
}

export async function getLoansByUser(userId) {
  await delay()
  return loans
    .filter(l => l.usuarioId === Number(userId))
    .map(l => ({
      ...l,
      libro: books.find(b => b.id === l.libroId),
    }))
}

export async function createLoan(data) {
  await delay(400)
  // Validate sanctions
  const userLoans = loans.filter(l => l.usuarioId === data.usuarioId && l.estado === 'Activo')
  const userFines = fines.filter(f => f.usuarioId === data.usuarioId && f.estado === 'Pendiente')

  if (userFines.length > 0) {
    throw new Error('Usuario con multa pendiente. Regularice su situación en el mesón de atención.')
  }

  const user = users.find(u => u.id === data.usuarioId)
  const maxBooks = user?.rol === 'docente' ? 5 : 3
  if (userLoans.length >= maxBooks) {
    throw new Error('Límite de préstamos alcanzado. Devuelva un ejemplar para continuar.')
  }

  // Check copy availability
  const book = books.find(b => b.id === data.libroId)
  const copy = book?.ejemplares.find(e => e.id === data.ejemplarId)
  if (!copy || copy.estado !== 'Disponible') {
    throw new Error('Ejemplar no disponible.')
  }

  // Create loan
  const maxDays = user?.rol === 'docente' ? 14 : 7
  const fechaPrestamo = new Date().toISOString().split('T')[0]
  const fechaDevolucion = new Date(Date.now() + maxDays * 86400000).toISOString().split('T')[0]

  const newLoan = {
    id: Math.max(...loans.map(l => l.id)) + 1,
    usuarioId: data.usuarioId,
    ejemplarId: data.ejemplarId,
    libroId: data.libroId,
    fechaPrestamo,
    fechaDevolucionEsperada: fechaDevolucion,
    fechaDevolucionReal: null,
    estado: 'Activo',
  }

  loans.push(newLoan)
  copy.estado = 'Prestado'

  return { ...newLoan, usuario: user, libro: book }
}

export async function returnLoan(loanId) {
  await delay(400)
  const loan = loans.find(l => l.id === Number(loanId))
  if (!loan) throw new Error('Préstamo no encontrado')

  loan.fechaDevolucionReal = new Date().toISOString().split('T')[0]
  loan.estado = 'Devuelto'

  // Update copy status
  const book = books.find(b => b.id === loan.libroId)
  const copy = book?.ejemplares.find(e => e.id === loan.ejemplarId)
  if (copy) copy.estado = 'Disponible'

  return loan
}

// ============ FINES ============

export async function getFines(filters = {}) {
  await delay()
  let result = [...fines]
  if (filters.estado) {
    result = result.filter(f => f.estado === filters.estado)
  }
  if (filters.usuarioId) {
    result = result.filter(f => f.usuarioId === Number(filters.usuarioId))
  }
  return result.map(f => ({
    ...f,
    usuario: users.find(u => u.id === f.usuarioId),
  }))
}

// ============ NOTIFICATIONS ============

export async function getNotifications(userId) {
  await delay(200)
  if (userId) {
    return notifications.filter(n => n.usuarioId === Number(userId) || n.usuarioId === null)
  }
  return [...notifications]
}

export async function markNotificationRead(notifId) {
  await delay(150)
  const n = notifications.find(n => n.id === Number(notifId))
  if (n) n.leida = true
  return n
}

// ============ REMOVAL REQUESTS ============

export async function getRemovalRequests() {
  await delay()
  return removalRequests.map(r => ({
    ...r,
    libro: books.find(b => b.id === r.libroId),
    solicitante: users.find(u => u.id === r.solicitadoPor),
  }))
}

export async function createRemovalRequest(data) {
  await delay(400)
  const newRequest = {
    ...data,
    id: Math.max(...removalRequests.map(r => r.id)) + 1,
    estado: 'Pendiente',
    fecha: new Date().toISOString().split('T')[0],
  }
  removalRequests.push(newRequest)
  return newRequest
}

export async function approveRemovalRequest(requestId) {
  await delay(400)
  const request = removalRequests.find(r => r.id === Number(requestId))
  if (!request) throw new Error('Solicitud no encontrada')
  request.estado = 'Aprobada'

  // Update copy status
  const book = books.find(b => b.id === request.libroId)
  const copy = book?.ejemplares.find(e => e.id === request.ejemplarId)
  if (copy) copy.estado = 'Dado de baja'

  return request
}

export async function rejectRemovalRequest(requestId) {
  await delay(400)
  const request = removalRequests.find(r => r.id === Number(requestId))
  if (!request) throw new Error('Solicitud no encontrada')
  request.estado = 'Rechazada'
  return request
}

// ============ STATS ============

export async function getDashboardData() {
  await delay()
  const activeLoanCount = loans.filter(l => l.estado === 'Activo').length
  const overdueLoanCount = loans.filter(l => l.estado === 'Vencido').length
  const pendingFines = fines.filter(f => f.estado === 'Pendiente')
  const availableCopies = books.reduce((sum, b) => sum + b.ejemplares.filter(e => e.estado === 'Disponible').length, 0)

  return {
    kpis: {
      ...dashboardKPIs,
      prestamosActivos: activeLoanCount,
      usuariosMorosos: overdueLoanCount,
      librosDisponibles: availableCopies,
      multasPendientes: pendingFines.reduce((sum, f) => sum + f.monto, 0),
    },
    topBooks,
    loansByMonth,
    recentActivity: loans.slice(-10).reverse().map(l => ({
      ...l,
      usuario: users.find(u => u.id === l.usuarioId),
      libro: books.find(b => b.id === l.libroId),
    })),
  }
}

export async function getAnalyticsData(filters = {}) {
  await delay(500)
  return {
    loansByMonth,
    loansByCategory,
    dailyActivity,
    topBooks,
    delinquencyByMonth,
  }
}
