import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayoutContainer } from '@components/layout'
import { CalendarGrid } from '@components/calendar'
import { useAppointments } from '@hooks/useAppointments'
import clsx from 'clsx'

/**
 * Calendario - Vista de Calendario Mensual
 *
 * Componentes:
 * - Navegación de meses (anterior, hoy, siguiente)
 * - Grilla de calendario (6 semanas × 7 días)
 * - Citas color-coded por estado
 * - Estadísticas de citas
 * - Integración con ficha de cita
 *
 * Funcionalidades:
 * - Ver mes completo con navegación
 * - Click en cita → Ir a ficha
 * - Drag-drop para reprogramar citas
 * - Filtro por estado (opcional)
 * - Estadísticas en tiempo real
 */
export function Calendario() {
  const navigate = useNavigate()

  // State
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Hooks - Get all appointments (wide date range to ensure coverage)
  const yearStart = new Date(currentMonth.getFullYear() - 1, 0, 1).toISOString().split('T')[0]
  const yearEnd = new Date(currentMonth.getFullYear() + 1, 11, 31).toISOString().split('T')[0]
  const { appointments } = useAppointments(yearStart, yearEnd)

  // Calculate statistics
  const appointmentStats = useMemo(() => {
    const stats = {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }
    return stats
  }, [appointments])

  // Handlers
  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const handleToday = () => {
    setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  }

  const handleDayClick = (date: Date) => {
    // Navigate to create appointment with date pre-filled
    // TODO: Open create appointment dialog with date
    console.log('Day clicked:', date)
  }

  const handleAppointmentClick = (appointmentId: string) => {
    navigate(`/ficha-cita/${appointmentId}`)
  }

  const handleReschedule = async (appointmentId: string, newDate: Date) => {
    // TODO: Call API to reschedule appointment
    console.log('Reschedule appointment:', appointmentId, 'to', newDate)
  }

  // Format month name
  const monthName = currentMonth.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  const isCurrentMonth =
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear()

  return (
    <MainLayoutContainer title="Calendario" description="Vista mensual de citas y eventos">
      {/* Header with Navigation */}
      <div className="mb-8">
        {/* Title and Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
            {monthName}
          </h1>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
            >
              ← Anterior
            </button>

            <button
              onClick={handleToday}
              className={clsx(
                'px-4 py-2 rounded-lg border transition',
                isCurrentMonth
                  ? 'bg-rose-500 dark:bg-rose-600 text-white border-rose-500 dark:border-rose-600'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              Hoy
            </button>

            <button
              onClick={handleNextMonth}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {/* Total */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {appointmentStats.total}
            </p>
          </div>

          {/* Confirmed */}
          <div className="p-4 rounded-lg bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800">
            <p className="text-xs text-sage-600 dark:text-sage-400 mb-1">Confirmadas</p>
            <p className="text-2xl font-bold text-sage-700 dark:text-sage-300">
              {appointmentStats.confirmed}
            </p>
          </div>

          {/* Pending */}
          <div className="p-4 rounded-lg bg-warm-50 dark:bg-warm-900/20 border border-warm-200 dark:border-warm-800">
            <p className="text-xs text-warm-600 dark:text-warm-400 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-warm-700 dark:text-warm-300">
              {appointmentStats.pending}
            </p>
          </div>

          {/* Completed */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Completadas</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {appointmentStats.completed}
            </p>
          </div>

          {/* Cancelled */}
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">Canceladas</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {appointmentStats.cancelled}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        month={currentMonth}
        appointments={appointments}
        onDayClick={handleDayClick}
        onAppointmentClick={(apt) => handleAppointmentClick(apt.id)}
        onReschedule={handleReschedule}
      />
    </MainLayoutContainer>
  )
}
