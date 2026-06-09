import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Bell, ChevronRight, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLE_COLORS } from '../../data/permissions'
import './Header.css'

const ROUTE_LABELS = {
  busqueda: 'Busqueda',
  catalogo: 'Catalogo',
  prestamos: 'Prestamos',
  'mis-prestamos': 'Mis Prestamos',
  analiticas: 'Analiticas',
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  configuracion: 'Configuracion',
  nuevo: 'Nuevo',
  editar: 'Editar',
}

function buildBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return [{ label: 'Inicio', path: '/' }]

  const crumbs = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`
    const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    crumbs.push({ label, path: currentPath })
  }

  return crumbs
}

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const breadcrumbs = buildBreadcrumbs(location.pathname)
  const userInitial = user?.nombre?.charAt(0)?.toUpperCase() || '?'
  const userFullName = user ? `${user.nombre} ${user.apellido}` : ''
  const userRoleLabel = user ? ROLE_LABELS[user.rol] || user.rol : ''
  const userRoleColor = user ? ROLE_COLORS[user.rol] || '#6C6C80' : '#6C6C80'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <nav className="header-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="breadcrumb-item">
              {index > 0 && <ChevronRight size={14} className="breadcrumb-separator" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="breadcrumb-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="header-right">
        {/* Notification bell */}
        <button className="header-icon-btn header-notifications" aria-label="Notificaciones">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        {/* User dropdown */}
        <div className="header-user-dropdown" ref={dropdownRef}>
          <button
            className="header-user-btn"
            onClick={() => setDropdownOpen(prev => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="header-user-avatar" style={{ background: userRoleColor }}>
              {userInitial}
            </div>
            <span className="header-user-name">{user?.nombre || ''}</span>
          </button>

          {dropdownOpen && (
            <div className="header-dropdown-menu">
              <div className="header-dropdown-header">
                <span className="header-dropdown-name">{userFullName}</span>
                <span className="header-dropdown-role" style={{ color: userRoleColor }}>
                  {userRoleLabel}
                </span>
              </div>
              <div className="header-dropdown-divider" />
              <button className="header-dropdown-item" onClick={logout}>
                <LogOut size={16} />
                <span>Cerrar sesion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
