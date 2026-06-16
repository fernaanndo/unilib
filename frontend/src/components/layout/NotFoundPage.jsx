import { Link } from 'react-router-dom'
import { BookX } from 'lucide-react'
import './ErrorPage.css'

export default function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-page-content">
        <BookX size={56} className="error-page-icon" />
        <h1 className="error-page-code">404</h1>
        <p className="error-page-message">Página no encontrada</p>
        <p className="error-page-hint">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="error-page-link">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
