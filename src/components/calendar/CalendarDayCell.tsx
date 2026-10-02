import { useMemo } from 'react'
import clsx from 'clsx'
import type { Appointment } from '@hooks/useAppointments'

interface CalendarDayCellProps {
  date: Date
  appointments: Appointment[]
  isCurrentMonth: boolean
  isToday: boolean
  onDayClick?: (date: Date) => void
  onAppointmentClick?: (appointment: Appointment) => void
  onAppointmentDragStart?: (appointment: Appointment, e: React.DragEvent) => void
  className?: string
}

/**
 * CalendarDayCell - Celda de un día en el calendario
 *
 * Muestra:
 * - Número del día
 * - Indicador de hoy
 * - Citas del día (max 3, con indicador de más)
 * - Color-coded por estado (confirmed/pending/completed/cancelled)
 *
 * Actions:
 * - Click en día
 * - Click en cita
 * - Drag-drop de cita para reprogramar
 */
export function CalendarDayCell({
  date,
  appointments,
  isCurrentMonth,
  isToday,
  onDayClick,
  onAppointmentClick,
  onAppointmentDragStart,
  className,
}: CalendarDayCellProps) {
  const dayNumber = date.getDate()

  // Sort appointments by time
  const sortedAppointments = useMemo(
    () =>
      [...appointments]
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 3), // Show max 3 appointments
    [appointments]
  )

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300 border-sage-300 dark:border-sage-700',
      pending: 'bg-warm-100 dark:bg-warm-900/40 text-warm-700 dark:text-warm-300 border-warm-300 dark:border-warm-700',
      completed: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
    }
    return colors[status as keyof typeof colors] || colors.confirmed
  }

  return (
    <div
      onClick={() => onDayClick?.(date)}
      className={clsx(
        'min-h-28 p-2 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors',
        isCurrentMonth
          ? 'bg-white dark:bg-slate-800'
          : 'bg-slate-50 dark:bg-slate-900/50',
        isToday && 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
        className
      )}
    >
      {/* Day Number */}
      <div className="flex items-center gap-1 mb-1">
        <span
          className={clsx(
            'text-sm font-bold',
            isToday
              ? 'text-rose-600 dark:text-rose-400'
              : isCurrentMonth
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
          )}
        >
          {dayNumber}
        </span>
        {isToday && (
          <span className="inline-block w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400" />
        )}
      </div>

      {/* Appointments */}
      <div className="space-y-1">
        {sortedAppointments.map((apt) => (
          <AppointmentBadge
            key={apt.id}
            appointment={apt}
            status={apt.status}
            onAppointmentClick={() => onAppointmentClick?.(apt)}
            onDragStart={(e) => onAppointmentDragStart?.(apt, e)}
          />
        ))}

        {/* More indicator */}
        {appointments.length > 3 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1 font-medium">
            +{appointments.length - 3} más
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * AppointmentBadge - Insignia de cita en el calendario
 */
function AppointmentBadge({
  appointment,
  status,
  onAppointmentClick,
  onDragStart,
}: {
  appointment: Appointment
  status: string
  onAppointmentClick: () => void
  onDragStart: (e: React.DragEvent) => void
}) {
  const getStatusConfig = (s: string) => {
    const configs = {
      confirmed: {
        bg: 'bg-sage-100 dark:bg-sage-900/40 hover:bg-sage-200 dark:hover:bg-sage-900/60',
        text: 'text-sage-700 dark:text-sage-300',
        border: 'border border-sage-300 dark:border-sage-700',
      },
      pending: {
        bg: 'bg-warm-100 dark:bg-warm-900/40 hover:bg-warm-200 dark:hover:bg-warm-900/60',
        text: 'text-warm-700 dark:text-warm-300',
        border: 'border border-warm-300 dark:border-warm-700',
      },
      completed: {
        bg: 'bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border border-blue-300 dark:border-blue-700',
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60',
        text: 'text-red-700 dark:text-red-300',
        border: 'border border-red-300 dark:border-red-700',
      },
    }
    return configs[s as keyof typeof configs] || configs.confirmed
  }

  const config = getStatusConfig(status)
  const time = new Date(appointment.startTime).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onAppointmentClick()
      }}
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        onDragStart(e)
      }}
      className={clsx(
        'px-2 py-1 rounded text-xs font-medium cursor-grab active:cursor-grabbing transition-all',
        config.bg,
        config.text,
        config.border,
        'truncate'
      )}
      title={`${time} - ${appointment.clientName}`}
    >
      <span className="font-semibold">{time}</span>
      <span className="ml-1 hidden sm:inline truncate">{appointment.clientName}</span>
    </div>
  )
}
