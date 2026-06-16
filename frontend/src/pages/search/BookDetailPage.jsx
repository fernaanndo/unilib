import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Edit, CalendarClock, MapPin, Barcode } from 'lucide-react';
import { getBookById, getBooks } from '../../data/mockService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import DataTable from '../../components/ui/DataTable';
import BookCard from '../../components/ui/BookCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import './BookDetailPage.css';

const COPY_COLUMNS = [
  {
    key: 'codigoBarras',
    label: 'Codigo de barras',
    render: (row) => (
      <span className="book-detail__barcode">
        <Barcode size={14} />
        {row.codigoBarras}
      </span>
    ),
  },
  {
    key: 'estado',
    label: 'Estado',
    render: (row) => <StatusBadge status={row.estado} size="sm" />,
  },
  {
    key: 'ubicacion',
    label: 'Ubicacion',
    render: (row) => (
      <span className="book-detail__location">
        <MapPin size={14} />
        {row.ubicacion || 'Sin asignar'}
      </span>
    ),
  },
];

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);

      const result = await getBookById(id);
      if (cancelled) return;

      if (!result) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBook(result);

      // Fetch related books (same category, exclude current)
      const related = await getBooks({ categoria: result.categoria });
      if (!cancelled) {
        setRelatedBooks(related.filter((b) => b.id !== result.id).slice(0, 4));
      }

      setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="book-detail">
        <div className="book-detail__back">
          <LoadingSkeleton type="text" width={180} />
        </div>
        <div className="book-detail__header">
          <div className="book-detail__cover-col">
            <LoadingSkeleton type="card" width="100%" height={400} />
          </div>
          <div className="book-detail__info-col">
            <LoadingSkeleton type="text" width="80%" height={36} />
            <LoadingSkeleton type="text" width="60%" />
            <LoadingSkeleton type="text" width="40%" />
            <LoadingSkeleton type="text" width="100%" height={80} />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="book-detail">
        <Link to="/busqueda" className="book-detail__back-link">
          <ArrowLeft size={18} />
          Volver a busqueda
        </Link>
        <EmptyState
          icon={BookOpen}
          title="Libro no encontrado"
          message="El libro que buscas no existe o ha sido eliminado del catalogo."
          actionLabel="Volver al catalogo"
          onAction={() => navigate('/busqueda')}
        />
      </div>
    );
  }

  const {
    titulo,
    autor,
    editorial,
    anio,
    categoria,
    isbn,
    sinopsis,
    portadaUrl,
    ubicacion,
    ejemplares = [],
  } = book;

  const totalEjemplares = ejemplares.length;
  const disponibles = ejemplares.filter((e) => e.estado === 'Disponible').length;

  const availabilityStatus = (() => {
    if (totalEjemplares === 0 || disponibles === 0) return 'none';
    if (disponibles === totalEjemplares) return 'full';
    return 'partial';
  })();

  const isPatron = user?.rol === 'estudiante' || user?.rol === 'docente';
  const isStaff = user?.rol === 'bibliotecario' || user?.rol === 'jefe' || user?.rol === 'admin';

  // Add ubicacion to copies for table display
  const copiesForTable = ejemplares.map((e) => ({
    ...e,
    ubicacion,
  }));

  return (
    <div className="book-detail">
      {/* Back link */}
      <Link to="/busqueda" className="book-detail__back-link">
        <ArrowLeft size={18} />
        Volver a busqueda
      </Link>

      {/* Header: Cover + Metadata */}
      <div className="book-detail__header">
        <div className="book-detail__cover-col">
          <div className="book-detail__cover">
            {portadaUrl ? (
              <img
                src={portadaUrl}
                alt={`Portada de ${titulo}`}
                className="book-detail__cover-img"
              />
            ) : (
              <div className="book-detail__cover-placeholder">
                <BookOpen size={64} strokeWidth={0.8} />
                <span className="book-detail__cover-label">Sin portada</span>
              </div>
            )}
          </div>
        </div>

        <div className="book-detail__info-col">
          <h1 className="book-detail__title">{titulo}</h1>

          <p className="book-detail__author">{autor}</p>

          <div className="book-detail__meta">
            {editorial && (
              <span className="book-detail__meta-item">
                {editorial}
              </span>
            )}
            {anio && (
              <span className="book-detail__meta-item">
                <CalendarClock size={14} />
                {anio}
              </span>
            )}
          </div>

          {categoria && (
            <span className="book-detail__category-badge">{categoria}</span>
          )}

          {isbn && (
            <p className="book-detail__isbn">
              <span className="book-detail__isbn-label">ISBN:</span> {isbn}
            </p>
          )}

          {sinopsis && (
            <div className="book-detail__synopsis">
              <h3 className="book-detail__section-label">Sinopsis</h3>
              <p className="book-detail__synopsis-text">{sinopsis}</p>
            </div>
          )}

          {/* Availability summary */}
          <div className={`book-detail__availability book-detail__availability--${availabilityStatus}`}>
            <span className="book-detail__availability-dot" aria-hidden="true" />
            <span className="book-detail__availability-text">
              {disponibles} de {totalEjemplares} ejemplares disponibles
            </span>
          </div>

          {/* Action buttons */}
          <div className="book-detail__actions">
            {isPatron && disponibles > 0 && (
              <Button
                variant="primary"
                disabled
                title="Acerquese al meson de atencion"
                icon={BookOpen}
              >
                Solicitar Prestamo
              </Button>
            )}
            {isPatron && disponibles === 0 && totalEjemplares > 0 && (
              <Button variant="secondary" icon={CalendarClock}>
                Reservar
              </Button>
            )}
            {isStaff && (
              <Button
                variant="secondary"
                icon={Edit}
                onClick={() => navigate(`/catalogo/${book.id}/editar`)}
              >
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Copies table */}
      {totalEjemplares > 0 && (
        <section className="book-detail__copies-section">
          <h2 className="book-detail__section-title">Ejemplares</h2>
          <DataTable
            columns={COPY_COLUMNS}
            data={copiesForTable}
            keyExtractor={(row) => row.id}
            className="book-detail__copies-table"
          />
        </section>
      )}

      {/* Related books */}
      {relatedBooks.length > 0 && (
        <section className="book-detail__related-section">
          <h2 className="book-detail__section-title">Materiales relacionados</h2>
          <div className="book-detail__related-grid">
            {relatedBooks.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                onClick={() => navigate(`/busqueda/${b.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
