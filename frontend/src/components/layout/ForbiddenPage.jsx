import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import './ErrorPage.css'

export default function ForbiddenPage() {
  return (
    <div className="error-page">
      <div className="error-page-content">
        <ShieldX size={56} className="error-page-icon" />
        <h1 className="error-page-code">403</h1>
        <p className="error-page-message">No tienes permisos para acceder a esta página</p>
        <p className="error-page-hint">
          Contacta al administrador si crees que esto es un error.
        </p>
        <Link to="/" className="error-page-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
