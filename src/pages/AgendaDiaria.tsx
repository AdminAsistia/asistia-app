import { useState, useEffect } from 'react'
import { MainLayoutContainer } from '@components/shared'
import {
  AgendaGrid,
  AppointmentDetailModal,
  CreateAppointmentModal,
  type Appointment,
} from '@components/agenda'
import { Button } from '@components/common'
import { useAppointments, getAgendaMockData } from '@hooks/useAppointments'

/**
 * AgendaDiaria - Página de planificador diario
 *
 * Muestra:
 * - Selector de fecha (hoy, mañana, fecha custom)
 * - Grid horario (9am-7pm) con citas del día
 * - Citas como tarjetas draggable (rescheduling)
 * - Detail modal para ver/editar citas
 * - Create modal para nueva cita
 * - Quick actions (crear cita, hoy, mañana)
 *
 * Data flow:
 * 1. useAppointments fetches GET /appointments?date=YYYY-MM-DD
 * 2. AgendaGrid renderiza citas en grid horario
 * 3. Click cita → abre AppointmentDetailModal
 * 4. Drag-drop → rescheduleAppointment
 * 5. Crear Cita → abre CreateAppointmentModal
 *
 * Features:
 * - Date navigation (prev/next day, date picker)
 * - Drag-drop rescheduling
 * - Status change (confirmed/pending/completed/cancelled)
 * - Edit notes
 * - Delete appointment
 * - Create new appointment
 * - Mock data fallback para desarrollo
 */
export default function AgendaDiaria() {
  // Date state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  // Fetch appointments for selected date
  const { appointments, isLoading, createAppointment, updateAppointment, deleteAppointment, rescheduleAppointment } = useAppointments(selectedDate)

  // Use mock data if no real data
  const displayAppointments = appointments.length > 0 ? appointments : getAgendaMockData(selectedDate)

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Date navigation
  const handlePrevDay = () => {
    const prev = new Date(selectedDate)
    prev.setDate(prev.getDate() - 1)
    setSelectedDate(prev.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const next = new Date(selectedDate)
    next.setDate(next.getDate() + 1)
    setSelectedDate(next.toISOString().split('T')[0])
  }

  const handleToday = () => {
    const today = new Date()
    setSelectedDate(today.toISOString().split('T')[0])
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  // Appointment handlers
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailModal(true)
  }

  const handleStatusChange = async (appointmentId: string, status: Appointment['status']) => {
    await updateAppointment(appointmentId, { status })
    setSelectedAppointment(null)
    setShowDetailModal(false)
  }

  const handleEditNotes = async (appointmentId: string, notes: string) => {
    await updateAppointment(appointmentId, { notes })
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    await deleteAppointment(appointmentId)
  }

  const handleReschedule = async (appointmentId: string, newStartTime: string) => {
    await rescheduleAppointment(appointmentId, newStartTime)
  }

  const handleCreateAppointment = async (data: any) => {
    await createAppointment(data)
    setShowCreateModal(false)
  }

  // Format date for display
  const displayDate = new Date(selectedDate)
  const dateLabel = displayDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Is today?
  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  return (
    <MainLayoutContainer showFooter>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Agenda Diaria
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Gestiona las citas del día, reschedule y edita detalles
        </p>
      </div>

      {/* Date Navigation */}
      <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Date Display + Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevDay}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              ←
            </button>

            <div className="flex-1">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {!isToday && (
              <Button variant="secondary" size="sm" onClick={handleToday}>
                Hoy
              </Button>
            )}
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              + Crear Cita
            </Button>
          </div>
        </div>

        {/* Date Info */}
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <span className="capitalize">{dateLabel}</span>
          {isToday && (
            <span className="ml-2 px-2 py-1 bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300 rounded text-xs font-medium">
              Hoy
            </span>
          )}
        </div>
      </div>

      {/* Appointments Grid */}
      <AgendaGrid
        appointments={displayAppointments}
        isLoading={isLoading}
        onAppointmentClick={handleAppointmentClick}
        onAppointmentDrop={handleReschedule}
        startHour={9}
        endHour={19}
        slotDuration={30}
        className="mb-8"
      />

      {/* Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Total de Citas</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {displayAppointments.length}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Confirmadas</p>
          <p className="text-2xl font-bold text-sage-600 dark:text-sage-400 mt-1">
            {displayAppointments.filter((a) => a.status === 'confirmed').length}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Pendientes</p>
          <p className="text-2xl font-bold text-warm-600 dark:text-warm-400 mt-1">
            {displayAppointments.filter((a) => a.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Modals */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedAppointment(null)
        }}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteAppointment}
        onEditNotes={handleEditNotes}
      />

      <CreateAppointmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAppointment}
        date={selectedDate}
        clients={[
          { id: 'cli_1', name: 'María González' },
          { id: 'cli_2', name: 'Ana Rodríguez' },
          { id: 'cli_3', name: 'Carmen Martínez' },
          { id: 'cli_4', name: 'Laura Pérez' },
        ]}
        services={[
          { id: 'svc_1', name: 'Limpieza facial profunda' },
          { id: 'svc_2', name: 'Microdermoabrasión' },
          { id: 'svc_3', name: 'Tratamiento acné' },
          { id: 'svc_4', name: 'Inyección de ácido hialurónico' },
          { id: 'svc_5', name: 'Consulta' },
        ]}
        providers={[
          { id: 'prv_1', name: 'Dra. López' },
          { id: 'prv_2', name: 'Dra. Silva' },
        ]}
      />
    </MainLayoutContainer>
  )
}
