import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { hasPermission as checkPermission, getDefaultRoute } from '../data/permissions'

const DEMO_USERS = [
  { id: 1, nombre: 'María', apellido: 'González', email: 'maria.gonzalez@universidad.cl', rol: 'estudiante', carrera: 'Ing. Civil Informática' },
  { id: 2, nombre: 'Carlos', apellido: 'Muñoz', email: 'carlos.munoz@universidad.cl', rol: 'docente', carrera: 'Literatura' },
  { id: 3, nombre: 'Ana', apellido: 'Reyes', email: 'ana.reyes@universidad.cl', rol: 'bibliotecario', carrera: null },
  { id: 4, nombre: 'Roberto', apellido: 'Soto', email: 'roberto.soto@universidad.cl', rol: 'jefe', carrera: null },
  { id: 5, nombre: 'Fernando', apellido: 'Catalán', email: 'fernando.catalan@universidad.cl', rol: 'admin', carrera: null },
]

const SESSION_KEY = 'unilib_session'
const INACTIVITY_LIMIT = 30 * 60 * 1000 // 30 minutes
const CHECK_INTERVAL = 60 * 1000 // 60 seconds

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  hasPermission: () => false,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const lastActivity = useRef(Date.now())
  const navigate = useNavigate()

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        lastActivity.current = Date.now()
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [])

  // Inactivity timeout
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity.current
      if (elapsed >= INACTIVITY_LIMIT) {
        sessionStorage.removeItem(SESSION_KEY)
        setUser(null)
        navigate('/login')
      }
    }, CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [user, navigate])

  // Track user activity (throttled)
  useEffect(() => {
    if (!user) return

    let throttleTimer = null

    const updateActivity = () => {
      if (throttleTimer) return
      throttleTimer = setTimeout(() => {
        lastActivity.current = Date.now()
        throttleTimer = null
      }, 5000)
    }

    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('click', updateActivity)
    window.addEventListener('scroll', updateActivity)

    return () => {
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('click', updateActivity)
      window.removeEventListener('scroll', updateActivity)
      if (throttleTimer) clearTimeout(throttleTimer)
    }
  }, [user])

  const login = useCallback((email) => {
    const found = DEMO_USERS.find((u) => u.email === email)
    if (!found) return false

    const sessionUser = { ...found }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    lastActivity.current = Date.now()

    const defaultRoute = getDefaultRoute(sessionUser.rol)
    navigate(defaultRoute)
    return true
  }, [navigate])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
    navigate('/login')
  }, [navigate])

  const hasPermission = useCallback((permission) => {
    if (!user) return false
    return checkPermission(user.rol, permission)
  }, [user])

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return context
}

export default AuthContext
