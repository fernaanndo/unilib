import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import NotFoundPage from './components/layout/NotFoundPage'
import ForbiddenPage from './components/layout/ForbiddenPage'
import LoginPage from './pages/auth/LoginPage'
import SearchPage from './pages/search/SearchPage'
import BookDetailPage from './pages/search/BookDetailPage'
import CatalogPage from './pages/catalog/CatalogPage'
import BookFormPage from './pages/catalog/BookFormPage'
import RemovalRequestsPage from './pages/catalog/RemovalRequestsPage'
import LoansPage from './pages/loans/LoansPage'
import NewLoanPage from './pages/loans/NewLoanPage'
import MyLoansPage from './pages/loans/MyLoansPage'
import DashboardPage from './pages/analytics/DashboardPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import UsersPage from './pages/admin/UsersPage'
import UserDetailPage from './pages/admin/UserDetailPage'
import SettingsPage from './pages/admin/SettingsPage'
import './App.css'

const { ESTUDIANTE, DOCENTE, BIBLIOTECARIO, JEFE, ADMIN } = {
  ESTUDIANTE: 'estudiante',
  DOCENTE: 'docente',
  BIBLIOTECARIO: 'bibliotecario',
  JEFE: 'jefe',
  ADMIN: 'admin',
}

const ALL_ROLES = [ESTUDIANTE, DOCENTE, BIBLIOTECARIO, JEFE, ADMIN]
const STAFF_ROLES = [BIBLIOTECARIO, JEFE, ADMIN]
const SUPERVISOR_ROLES = [JEFE, ADMIN]

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/busqueda" replace />} />

              {/* Búsqueda — todos los roles */}
              <Route path="busqueda" element={<SearchPage />} />
              <Route path="busqueda/:id" element={<BookDetailPage />} />

              {/* Catálogo — todos pueden ver, staff puede gestionar */}
              <Route path="catalogo" element={<CatalogPage />} />
              <Route element={<ProtectedRoute allowedRoles={STAFF_ROLES} />}>
                <Route path="catalogo/nuevo" element={<BookFormPage />} />
                <Route path="catalogo/:id/editar" element={<BookFormPage />} />
                <Route path="catalogo/bajas" element={<RemovalRequestsPage />} />
              </Route>

              {/* Préstamos — staff gestiona */}
              <Route element={<ProtectedRoute allowedRoles={STAFF_ROLES} />}>
                <Route path="prestamos" element={<LoansPage />} />
                <Route path="prestamos/nuevo" element={<NewLoanPage />} />
              </Route>

              {/* Mis préstamos — estudiantes y docentes */}
              <Route element={<ProtectedRoute allowedRoles={[ESTUDIANTE, DOCENTE]} />}>
                <Route path="mis-prestamos" element={<MyLoansPage />} />
              </Route>

              {/* Analíticas — supervisores */}
              <Route element={<ProtectedRoute allowedRoles={SUPERVISOR_ROLES} />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="analiticas" element={<AnalyticsPage />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute allowedRoles={[ADMIN]} />}>
                <Route path="usuarios" element={<UsersPage />} />
                <Route path="usuarios/:id" element={<UserDetailPage />} />
                <Route path="configuracion" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
