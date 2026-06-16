import { useState } from 'react'
import { Settings, Save, BookOpen, Clock } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { LOAN_LIMITS } from '../../data/permissions'
import { useToast } from '../../context/ToastContext'
import './SettingsPage.css'

export default function SettingsPage() {
  const { addToast } = useToast()

  // Loan policies
  const [estudianteMaxBooks, setEstudianteMaxBooks] = useState(LOAN_LIMITS.estudiante.maxBooks)
  const [estudianteMaxDays, setEstudianteMaxDays] = useState(LOAN_LIMITS.estudiante.maxDays)
  const [docenteMaxBooks, setDocenteMaxBooks] = useState(LOAN_LIMITS.docente.maxBooks)
  const [docenteMaxDays, setDocenteMaxDays] = useState(LOAN_LIMITS.docente.maxDays)

  // Fines
  const [finePerDay, setFinePerDay] = useState(500)

  // Notifications
  const [reminderDays, setReminderDays] = useState(2)

  // Saving states
  const [savingLoans, setSavingLoans] = useState(false)
  const [savingFines, setSavingFines] = useState(false)
  const [savingNotif, setSavingNotif] = useState(false)

  const handleSaveLoans = async () => {
    if (estudianteMaxBooks < 1 || estudianteMaxDays < 1 || docenteMaxBooks < 1 || docenteMaxDays < 1) {
      addToast('Los valores deben ser mayores a 0', 'error')
      return
    }
    setSavingLoans(true)
    await new Promise((r) => setTimeout(r, 500))
    setSavingLoans(false)
    addToast('Configuración de préstamos actualizada', 'success')
  }

  const handleSaveFines = async () => {
    if (finePerDay < 0) {
      addToast('El monto debe ser mayor o igual a 0', 'error')
      return
    }
    setSavingFines(true)
    await new Promise((r) => setTimeout(r, 500))
    setSavingFines(false)
    addToast('Configuración de multas actualizada', 'success')
  }

  const handleSaveNotif = async () => {
    if (reminderDays < 1 || reminderDays > 30) {
      addToast('Los días deben estar entre 1 y 30', 'error')
      return
    }
    setSavingNotif(true)
    await new Promise((r) => setTimeout(r, 500))
    setSavingNotif(false)
    addToast('Configuración de notificaciones actualizada', 'success')
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Settings size={28} />
        <h1>Configuración del Sistema</h1>
      </div>

      {/* Section 1: Loan Policies */}
      <section className="settings-card">
        <div className="settings-card__header">
          <BookOpen size={20} />
          <h2>Políticas de Préstamo</h2>
        </div>

        <div className="settings-card__body">
          <div className="settings-role-group">
            <h3 className="settings-role-title">Estudiante</h3>
            <div className="settings-fields-row">
              <Input
                label="Máximo libros simultáneos"
                type="number"
                value={estudianteMaxBooks}
                onChange={(e) => setEstudianteMaxBooks(Number(e.target.value))}
                min={1}
                max={20}
              />
              <Input
                label="Días máximos de préstamo"
                type="number"
                value={estudianteMaxDays}
                onChange={(e) => setEstudianteMaxDays(Number(e.target.value))}
                min={1}
                max={90}
              />
            </div>
          </div>

          <div className="settings-role-group">
            <h3 className="settings-role-title">Docente</h3>
            <div className="settings-fields-row">
              <Input
                label="Máximo libros simultáneos"
                type="number"
                value={docenteMaxBooks}
                onChange={(e) => setDocenteMaxBooks(Number(e.target.value))}
                min={1}
                max={30}
              />
              <Input
                label="Días máximos de préstamo"
                type="number"
                value={docenteMaxDays}
                onChange={(e) => setDocenteMaxDays(Number(e.target.value))}
                min={1}
                max={180}
              />
            </div>
          </div>

          <div className="settings-card__actions">
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSaveLoans}
              loading={savingLoans}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Fines */}
      <section className="settings-card">
        <div className="settings-card__header">
          <Clock size={20} />
          <h2>Multas</h2>
        </div>

        <div className="settings-card__body">
          <div className="settings-fields-row settings-fields-row--single">
            <Input
              label="Monto por día de atraso (CLP)"
              type="number"
              value={finePerDay}
              onChange={(e) => setFinePerDay(Number(e.target.value))}
              min={0}
              max={50000}
              helperText="Valor en pesos chilenos que se cobra por cada día de retraso"
            />
          </div>

          <div className="settings-card__actions">
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSaveFines}
              loading={savingFines}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </section>

      {/* Section 3: Notifications */}
      <section className="settings-card">
        <div className="settings-card__header">
          <Clock size={20} />
          <h2>Notificaciones</h2>
        </div>

        <div className="settings-card__body">
          <div className="settings-fields-row settings-fields-row--single">
            <Input
              label="Días antes del vencimiento para enviar recordatorio"
              type="number"
              value={reminderDays}
              onChange={(e) => setReminderDays(Number(e.target.value))}
              min={1}
              max={30}
              helperText="Se enviará un correo electrónico al usuario antes de la fecha de devolución"
            />
          </div>

          <div className="settings-card__actions">
            <Button
              variant="primary"
              icon={Save}
              onClick={handleSaveNotif}
              loading={savingNotif}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
