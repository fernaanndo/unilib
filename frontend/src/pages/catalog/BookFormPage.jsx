import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { getBookById, createBook, updateBook, checkIsbnExists, getCategorias } from '../../data/mockService'
import { useToast } from '../../context/ToastContext'
import './BookFormPage.css'

const CURRENT_YEAR = new Date().getFullYear()

function generateBarcode() {
  const num = Math.floor(Math.random() * 9000) + 1000
  return `UNI-${num}`
}

export default function BookFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const isEdit = Boolean(id)
  const categorias = getCategorias()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [isbn, setIsbn] = useState('')
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [editorial, setEditorial] = useState('')
  const [anio, setAnio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [ejemplares, setEjemplares] = useState([])

  // Validation errors
  const [errors, setErrors] = useState({})

  // Load book data in edit mode
  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setLoading(true)

    getBookById(id).then((book) => {
      if (cancelled || !book) {
        if (!cancelled && !book) {
          addToast('Libro no encontrado', 'error')
          navigate('/catalogo')
        }
        return
      }
      setIsbn(book.isbn || '')
      setTitulo(book.titulo || '')
      setAutor(book.autor || '')
      setEditorial(book.editorial || '')
      setAnio(String(book.anio || ''))
      setCategoria(book.categoria || '')
      setUbicacion(book.ubicacion || '')
      setSinopsis(book.sinopsis || '')
      setEjemplares(book.ejemplares || [])
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [id, isEdit, navigate, addToast])

  // ISBN duplicate check
  const handleIsbnBlur = useCallback(async () => {
    if (!isbn.trim()) return
    // In edit mode, skip check for the current book's ISBN
    try {
      const exists = await checkIsbnExists(isbn.trim())
      if (exists && !isEdit) {
        setErrors((prev) => ({ ...prev, isbn: 'ISBN duplicado' }))
      } else {
        setErrors((prev) => {
          const next = { ...prev }
          delete next.isbn
          return next
        })
      }
    } catch {
      // silently ignore check errors
    }
  }, [isbn, isEdit])

  // Validate form
  const validate = () => {
    const newErrors = {}

    if (!isbn.trim()) newErrors.isbn = 'ISBN es requerido'
    if (!titulo.trim()) newErrors.titulo = 'Titulo es requerido'
    if (!autor.trim()) newErrors.autor = 'Autor es requerido'
    if (!editorial.trim()) newErrors.editorial = 'Editorial es requerida'
    if (!anio.trim()) {
      newErrors.anio = 'Anio es requerido'
    } else {
      const year = Number(anio)
      if (isNaN(year) || year < 1900 || year > CURRENT_YEAR) {
        newErrors.anio = `Debe ser un numero entre 1900 y ${CURRENT_YEAR}`
      }
    }
    if (!categoria) newErrors.categoria = 'Categoria es requerida'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add copy row
  const handleAddCopy = () => {
    setEjemplares((prev) => [
      ...prev,
      { id: Date.now(), codigoBarras: generateBarcode(), estado: 'Disponible', isNew: true },
    ])
  }

  // Remove copy row
  const handleRemoveCopy = (copyId) => {
    setEjemplares((prev) => prev.filter((e) => e.id !== copyId))
  }

  // Update copy barcode
  const handleCopyBarcodeChange = (copyId, value) => {
    setEjemplares((prev) =>
      prev.map((e) => (e.id === copyId ? { ...e, codigoBarras: value } : e))
    )
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const bookData = {
        isbn: isbn.trim(),
        titulo: titulo.trim(),
        autor: autor.trim(),
        editorial: editorial.trim(),
        anio: Number(anio),
        categoria,
        ubicacion: ubicacion.trim(),
        sinopsis: sinopsis.trim(),
        portadaUrl: null,
        ejemplares: ejemplares.map(({ isNew, ...rest }) => rest),
      }

      if (isEdit) {
        await updateBook(id, bookData)
        addToast('Libro actualizado exitosamente', 'success')
      } else {
        await createBook(bookData)
        addToast('Libro creado exitosamente', 'success')
      }

      navigate('/catalogo')
    } catch (err) {
      addToast(err.message || 'Error al guardar el libro', 'error')
    } finally {
      setSaving(false)
    }
  }

  const categoriaOptions = categorias.map((c) => ({ value: c, label: c }))

  if (loading) {
    return (
      <div className="book-form-page">
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="book-form-page">
      <Link to="/catalogo" className="book-form-back">
        <ArrowLeft size={16} />
        Volver al catalogo
      </Link>

      <h1>{isEdit ? 'Editar libro' : 'Agregar nuevo libro'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="book-form-card">
          <div className="book-form-grid">
            {/* Left column */}
            <Input
              label="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              onBlur={handleIsbnBlur}
              error={errors.isbn}
              required
              placeholder="978-0-000-00000-0"
              disabled={isEdit}
            />
            <Input
              label="Editorial"
              value={editorial}
              onChange={(e) => setEditorial(e.target.value)}
              error={errors.editorial}
              required
              placeholder="Nombre de la editorial"
            />
            <Input
              label="Titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              error={errors.titulo}
              required
              placeholder="Titulo del libro"
            />
            <Input
              label="Autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              error={errors.autor}
              required
              placeholder="Nombre del autor"
            />

            {/* Right column */}
            <Input
              label="Anio de publicacion"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              error={errors.anio}
              required
              placeholder="2024"
              type="number"
              min="1900"
              max={CURRENT_YEAR}
            />
            <Select
              label="Categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              options={categoriaOptions}
              error={errors.categoria}
              required
              placeholder="Seleccionar categoria"
            />
            <Input
              label="Ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ej: Estante A-1"
            />

            {/* Full-width synopsis */}
            <div className="book-form-full">
              <label className="book-form-textarea-label">Sinopsis</label>
              <textarea
                className="book-form-textarea"
                value={sinopsis}
                onChange={(e) => setSinopsis(e.target.value)}
                placeholder="Breve descripcion del libro..."
              />
            </div>
          </div>

          {/* Copies section */}
          <div className="book-form-section">
            <div className="book-form-section-header">
              <h2>Ejemplares</h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={handleAddCopy}
              >
                Agregar ejemplar
              </Button>
            </div>

            {ejemplares.length === 0 ? (
              <div className="book-form-copies-empty">
                No hay ejemplares registrados. Agregue al menos uno.
              </div>
            ) : (
              <table className="book-form-copies-table">
                <thead>
                  <tr>
                    <th>Codigo de barras</th>
                    <th>Estado</th>
                    <th style={{ width: '48px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {ejemplares.map((copy) => (
                    <tr key={copy.id}>
                      <td>
                        {copy.isNew ? (
                          <input
                            className="book-form-copy-input"
                            type="text"
                            value={copy.codigoBarras}
                            onChange={(e) => handleCopyBarcodeChange(copy.id, e.target.value)}
                            placeholder="UNI-0000"
                          />
                        ) : (
                          copy.codigoBarras
                        )}
                      </td>
                      <td>{copy.estado}</td>
                      <td>
                        <button
                          type="button"
                          className="book-form-copy-remove"
                          onClick={() => handleRemoveCopy(copy.id)}
                          aria-label="Eliminar ejemplar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="book-form-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/catalogo')}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
