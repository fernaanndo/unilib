export const ROLES = {
  ESTUDIANTE: 'estudiante',
  DOCENTE: 'docente',
  BIBLIOTECARIO: 'bibliotecario',
  JEFE: 'jefe',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  bibliotecario: 'Bibliotecario',
  jefe: 'Jefe de Biblioteca',
  admin: 'Administrador',
}

export const ROLE_COLORS = {
  estudiante: '#457B9D',
  docente: '#2D6A4F',
  bibliotecario: '#D4A373',
  jefe: '#E76F51',
  admin: '#1B4332',
}

export const PERMISSIONS = {
  estudiante: ['search', 'view_catalog', 'view_own_loans', 'reserve_book'],
  docente: ['search', 'view_catalog', 'view_own_loans', 'reserve_book', 'view_special_collections'],
  bibliotecario: ['search', 'view_catalog', 'view_own_loans', 'manage_catalog', 'manage_loans', 'scan_barcode'],
  jefe: ['search', 'view_catalog', 'view_own_loans', 'manage_catalog', 'manage_loans', 'approve_removals', 'view_analytics', 'view_dashboard', 'manage_policies'],
  admin: ['*'],
}

export const LOAN_LIMITS = {
  estudiante: { maxBooks: 3, maxDays: 7 },
  docente: { maxBooks: 5, maxDays: 14 },
}

export function hasPermission(role, permission) {
  const perms = PERMISSIONS[role]
  if (!perms) return false
  if (perms.includes('*')) return true
  return perms.includes(permission)
}

export function getDefaultRoute(role) {
  switch (role) {
    case ROLES.ADMIN:
    case ROLES.JEFE:
      return '/dashboard'
    case ROLES.BIBLIOTECARIO:
      return '/prestamos'
    case ROLES.DOCENTE:
    case ROLES.ESTUDIANTE:
    default:
      return '/busqueda'
  }
}
