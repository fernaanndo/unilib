import { useLocation, NavLink } from 'react-router-dom'
import {
  Search,
  BookOpen,
  Library,
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, ROLE_COLORS } from '../../data/permissions'
import './Sidebar.css'

const NAV_SECTIONS = [
  {
    label: 'GENERAL',
    items: [
      { to: '/busqueda', icon: Search, label: 'Busqueda', permission: null },
      { to: '/catalogo', icon: BookOpen, label: 'Catalogo', permission: 'view_catalog' },
    ],
  },
  {
    label: 'GESTION',
    requiredPermissions: ['manage_catalog', 'manage_loans', 'view_own_loans'],
    items: [
      { to: '/prestamos', icon: ArrowLeftRight, label: 'Prestamos', permission: 'manage_loans' },
      { to: '/mis-prestamos', icon: Library, label: 'Mis Prestamos', permission: 'view_own_loans', hideForRoles: ['bibliotecario', 'jefe', 'admin'] },
    ],
  },
  {
    label: 'SUPERVISION',
    requiredPermissions: ['view_analytics', 'view_dashboard'],
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: 'view_dashboard' },
      { to: '/analiticas', icon: BarChart3, label: 'Analiticas', permission: 'view_analytics' },
    ],
  },
  {
    label: 'ADMINISTRACION',
    requiredPermissions: ['*'],
    items: [
      { to: '/usuarios', icon: Users, label: 'Usuarios', permission: '*' },
      { to: '/configuracion', icon: Settings, label: 'Configuracion', permission: '*' },
    ],
  },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout, hasPermission } = useAuth()
  const location = useLocation()

  const isSectionVisible = (section) => {
    if (!section.requiredPermissions) return true
    return section.requiredPermissions.some((p) => hasPermission(p))
  }

  const isItemVisible = (item) => {
    if (item.hideForRoles && user && item.hideForRoles.includes(user.rol)) {
      return false
    }
    if (!item.permission) return true
    return hasPermission(item.permission)
  }

  const userInitial = user?.nombre?.charAt(0)?.toUpperCase() || '?'
  const userFullName = user ? `${user.nombre} ${user.apellido}` : ''
  const userRoleLabel = user ? ROLE_LABELS[user.rol] || user.rol : ''
  const userRoleColor = user ? ROLE_COLORS[user.rol] || '#6C6C80' : '#6C6C80'

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <NavLink to="/" className="sidebar-logo-link">
          <span className="sidebar-logo-mark">U</span>
          {!collapsed && (
            <span className="sidebar-logo-text">
              <span className="sidebar-logo-title">UNILIB</span>
              <span className="sidebar-logo-subtitle">Digital</span>
            </span>
          )}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => {
          if (!isSectionVisible(section)) return null

          const visibleItems = section.items.filter(isItemVisible)
          if (visibleItems.length === 0) return null

          return (
            <div key={section.label} className="sidebar-section">
              {!collapsed && <span className="sidebar-section-label">{section.label}</span>}
              <ul className="sidebar-menu">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon size={20} className="sidebar-link-icon" />
                        {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-footer">
        {/* User mini-card */}
        <div className="sidebar-user" title={collapsed ? `${userFullName} — ${userRoleLabel}` : undefined}>
          <div className="sidebar-user-avatar" style={{ background: userRoleColor }}>
            {userInitial}
          </div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userFullName}</span>
              <span className="sidebar-user-role" style={{ color: userRoleColor }}>
                {userRoleLabel}
              </span>
            </div>
          )}
        </div>

        {/* Logout */}
        <button className="sidebar-link sidebar-logout" onClick={logout} title={collapsed ? 'Cerrar sesion' : undefined}>
          <LogOut size={20} className="sidebar-link-icon" />
          {!collapsed && <span className="sidebar-link-label">Cerrar sesion</span>}
        </button>

        {/* Collapse toggle — desktop only */}
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Contraer'}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Mobile close button */}
      {mobileOpen && (
        <button className="sidebar-mobile-close" onClick={onMobileClose} aria-label="Cerrar menu">
          <ChevronLeft size={20} />
        </button>
      )}
    </aside>
  )
}
