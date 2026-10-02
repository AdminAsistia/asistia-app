import { useState, useEffect } from 'react'
import { useNotification } from '@components/common'
import axios from 'axios'
import type { Appointment } from '@components/agenda/AgendaGrid'

interface UseAppointmentsReturn {
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createAppointment: (data: CreateAppointmentPayload) => Promise<Appointment | null>
  updateAppointment: (id: string, data: UpdateAppointmentPayload) => Promise<Appointment | null>
  deleteAppointment: (id: string) => Promise<boolean>
  rescheduleAppointment: (id: string, newStartTime: string) => Promise<Appointment | null>
}

export interface CreateAppointmentPayload {
  clientId: string
  serviceId: string
  date: string // "2026-10-02"
  startTime: string // "09:30"
  endTime: string // "10:00"
  providerId?: string
  notes?: string
}

export interface UpdateAppointmentPayload {
  status?: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
  providerId?: string
}

/**
 * useAppointments - Hook para gestionar citas
 *
 * Fetches:
 * - GET /appointments?date=YYYY-MM-DD
 * - Citas de un día específico
 * - Incluyendo cliente, servicio, proveedor, notas
 *
 * Actions:
 * - POST /appointments - crear cita
 * - PATCH /appointments/:id - actualizar cita
 * - DELETE /appointments/:id - eliminar cita
 * - PATCH /appointments/:id/reschedule - cambiar hora
 *
 * Response format:
 * {
 *   id, clientName, clientId, serviceName, serviceId,
 *   date, startTime, endTime, status, provider, providerId, notes
 * }
 */
export function useAppointments(date: string): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const notify = useNotification()

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get<Appointment[]>(
        `/appointments?date=${date}`
      )

      setAppointments(response.data)
    } catch (err) {
      let errorMessage = 'Error cargando citas'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          errorMessage = 'No tienes permisos para ver las citas'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      setError(errorMessage)
      notify.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const createAppointment = async (data: CreateAppointmentPayload): Promise<Appointment | null> => {
    try {
      const response = await axios.post<Appointment>(
        '/appointments',
        data
      )
      setAppointments([...appointments, response.data])
      notify.success('Cita creada exitosamente', 2000)
      return response.data
    } catch (err) {
      let errorMessage = 'Error creando cita'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          errorMessage = err.response.data?.message || 'Datos inválidos'
        } else if (err.response?.status === 409) {
          errorMessage = 'Ya existe una cita en esa hora'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return null
    }
  }

  const updateAppointment = async (
    id: string,
    data: UpdateAppointmentPayload
  ): Promise<Appointment | null> => {
    try {
      const response = await axios.patch<Appointment>(
        `/appointments/${id}`,
        data
      )
      setAppointments(
        appointments.map((apt) => (apt.id === id ? response.data : apt))
      )
      notify.success('Cita actualizada', 2000)
      return response.data
    } catch (err) {
      let errorMessage = 'Error actualizando cita'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage = 'Cita no encontrada'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return null
    }
  }

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`/appointments/${id}`)
      setAppointments(appointments.filter((apt) => apt.id !== id))
      notify.success('Cita eliminada', 2000)
      return true
    } catch (err) {
      let errorMessage = 'Error eliminando cita'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage = 'Cita no encontrada'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return false
    }
  }

  const rescheduleAppointment = async (id: string, newStartTime: string): Promise<Appointment | null> => {
    try {
      const response = await axios.patch<Appointment>(
        `/appointments/${id}/reschedule`,
        { startTime: newStartTime }
      )
      setAppointments(
        appointments.map((apt) => (apt.id === id ? response.data : apt))
      )
      notify.success('Cita reprogramada', 2000)
      return response.data
    } catch (err) {
      let errorMessage = 'Error reprogramando cita'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          errorMessage = 'Ya existe una cita en esa hora'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return null
    }
  }

  // Fetch appointments on mount and when date changes
  useEffect(() => {
    if (date) {
      fetchAppointments()
    }
  }, [date])

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    rescheduleAppointment,
  }
}

/**
 * Mock data untuk development
 */
export function getAgendaMockData(date: string): Appointment[] {
  return [
    {
      id: 'apt_1',
      clientName: 'María González',
      clientId: 'cli_1',
      serviceName: 'Limpieza facial profunda',
      serviceId: 'svc_1',
      startTime: '09:00',
      endTime: '09:30',
      status: 'confirmed',
      provider: 'Dra. López',
      notes: 'Primera vez, piel sensible',
      date,
    },
    {
      id: 'apt_2',
      clientName: 'Ana Rodríguez',
      clientId: 'cli_2',
      serviceName: 'Microdermoabrasión',
      serviceId: 'svc_2',
      startTime: '09:45',
      endTime: '10:15',
      status: 'confirmed',
      provider: 'Dra. López',
      date,
    },
    {
      id: 'apt_3',
      clientName: 'Carmen Martínez',
      clientId: 'cli_3',
      serviceName: 'Tratamiento acné',
      serviceId: 'svc_3',
      startTime: '10:30',
      endTime: '11:00',
      status: 'pending',
      provider: 'Dra. Silva',
      notes: 'Seguimiento de tratamiento',
      date,
    },
    {
      id: 'apt_4',
      clientName: 'Laura Pérez',
      clientId: 'cli_4',
      serviceName: 'Inyección de ácido hialurónico',
      serviceId: 'svc_4',
      startTime: '11:15',
      endTime: '11:45',
      status: 'confirmed',
      provider: 'Dra. López',
      date,
    },
    {
      id: 'apt_5',
      clientName: 'Sofia Díaz',
      clientId: 'cli_5',
      serviceName: 'Consulta',
      serviceId: 'svc_5',
      startTime: '13:00',
      endTime: '13:30',
      status: 'confirmed',
      provider: 'Dra. Silva',
      notes: 'Nuevo cliente - consulta inicial',
      date,
    },
    {
      id: 'apt_6',
      clientName: 'Eva Santos',
      clientId: 'cli_6',
      serviceName: 'Peeling químico',
      serviceId: 'svc_6',
      startTime: '14:00',
      endTime: '14:45',
      status: 'cancelled',
      provider: 'Dra. López',
      date,
    },
    {
      id: 'apt_7',
      clientName: 'Isabel Gómez',
      clientId: 'cli_7',
      serviceName: 'Tratamiento antienvejecimiento',
      serviceId: 'svc_7',
      startTime: '15:00',
      endTime: '15:30',
      status: 'confirmed',
      provider: 'Dra. Silva',
      date,
    },
  ]
}
