import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../data/permissions'
import { BookOpen, Mail, Lock, ChevronDown, Eye, EyeOff, Library } from 'lucide-react'
import './LoginPage.css'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('estudiante')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const emailDomain = email.includes('@') ? email.split('@')[1] : null
  const domainValid = emailDomain === 'universidad.cl'
  const domainInvalid = emailDomain !== null && emailDomain !== '' && !domainValid
    && !('universidad.cl'.startsWith(emailDomain))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('El correo electrónico es obligatorio')
      return
    }

    if (!email.endsWith('@universidad.cl')) {
      setError('El correo debe ser institucional (@universidad.cl)')
      return
    }

    if (!password) {
      setError('La contraseña es obligatoria')
      return
    }

    setLoading(true)

    // Brief delay to feel real
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = login(email, role)
    if (!success) {
      setError('No se pudo iniciar sesión. Intente nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* ─── Left: Branding ─── */}
      <div className="login-branding">
        <div className="login-branding-content">
          <div className="login-branding-icon">
            <Library size={30} strokeWidth={1.5} />
          </div>
          <h1 className="login-branding-title">UNILIB</h1>
          <p className="login-branding-subtitle">Digital</p>
          <hr className="login-branding-divider" />
          <p className="login-branding-tagline">
            Plataforma integral de gestión bibliotecaria para la comunidad universitaria
          </p>
        </div>
      </div>

      {/* ─── Right: Form ─── */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <h2 className="login-form-heading">Iniciar Sesión</h2>
          <p className="login-form-subheading">
            Ingresa con tu correo institucional
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                Correo institucional
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <Mail size={17} strokeWidth={1.8} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className={`login-input${domainInvalid ? ' has-error' : ''}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="nombre@universidad.cl"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
              {email.length > 0 && (
                <div
                  className={`login-domain-hint ${
                    domainValid
                      ? 'login-domain-hint--valid'
                      : domainInvalid
                        ? 'login-domain-hint--invalid'
                        : ''
                  }`}
                >
                  {domainValid && 'Dominio institucional verificado'}
                  {domainInvalid && 'El dominio debe ser @universidad.cl'}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                Contraseña
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <Lock size={17} strokeWidth={1.8} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input login-input--with-toggle"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff size={17} strokeWidth={1.8} />
                    : <Eye size={17} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-role">
                Rol de acceso
              </label>
              <div className="login-select-wrapper">
                <span className="login-select-icon">
                  <BookOpen size={17} strokeWidth={1.8} />
                </span>
                <select
                  id="login-role"
                  className="login-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <span className="login-select-chevron">
                  <ChevronDown size={17} strokeWidth={1.8} />
                </span>
              </div>
            </div>

            {/* Demo note */}
            <div className="login-demo-note">
              <span className="login-demo-note-icon">
                <BookOpen size={15} strokeWidth={1.8} />
              </span>
              <span>
                Modo demostración — seleccione un rol para explorar el sistema
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <div className="login-footer">
            UNILIB Digital &middot; Sistema de Gestión Bibliotecaria
          </div>
        </div>
      </div>
    </div>
  )
}
