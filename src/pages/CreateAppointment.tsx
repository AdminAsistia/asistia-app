import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MainLayoutContainer } from '@components/layout'
import { AppointmentForm, AppointmentFormData } from '@components/appointment'
import { useClients } from '@hooks/useClients'
import { useAppointments } from '@hooks/useAppointments'

/**
 * CreateAppointment - Página de creación de nuevas citas
 *
 * Funcionalidades:
 * - Formulario de cita con preselección de fecha (desde calendario)
 * - Integración con lista de clientes
 * - Integración con lista de servicios disponibles
 * - Validaciones en tiempo real
 * - Redirección a ficha de cita después de crear
 *
 * Parámetros URL (query):
 * - date: Fecha preseleccionada (YYYY-MM-DD)
 */
export function CreateAppointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hooks
  const { clients } = useClients()
  const { appointments, addAppointment } = useAppointments(
    new Date().toISOString().split('T')[0]
  )

  // Mock services (TODO: Fetch from API or hook)
  const services = [
    { id: '1', name: 'Limpieza Facial', duration: 30, price: 40 },
    { id: '2', name: 'Peeling Químico', duration: 45, price: 60 },
    { id: '3', name: 'Tratamiento Acné', duration: 60, price: 80 },
    { id: '4', name: 'Masaje Facial', duration: 30, price: 50 },
    { id: '5', name: 'Hidratación Profunda', duration: 45, price: 55 },
  ]

  // Parse preselected date from URL
  const preselectedDateStr = searchParams.get('date')
  const preselectedDate = preselectedDateStr ? new Date(preselectedDateStr) : undefined

  // Handlers
  const handleSubmit = async (formData: AppointmentFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Create appointment
      const newAppointment = {
        id: Date.now().toString(),
        clientId: formData.clientId,
        serviceName: formData.serviceName,
        startTime: formData.startTime,
        endTime: formData.endTime,
        provider: formData.provider || 'No asignado',
        status: formData.status,
        notes: formData.notes || '',
        duration: Math.round(
          (new Date(formData.endTime).getTime() -
            new Date(formData.startTime).getTime()) /
            60000
        ),
      }

      // TODO: Call API endpoint to create appointment
      // await createAppointmentAPI(newAppointment)

      // For now, use mock (would call API in production)
      console.log('Creating appointment:', newAppointment)

      // Redirect to ficha de cita
      navigate(`/ficha-cita/${newAppointment.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cita')
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/calendario')
  }

  return (
    <MainLayoutContainer
      title="Nueva Cita"
      description="Crear una nueva cita"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/calendario')}
        className="mb-6 px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        ← Volver a Calendario
      </button>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">⚠️ {error}</p>
        </div>
      )}

      {/* Form Container */}
      <div className="max-w-2xl">
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <AppointmentForm
            preselectedDate={preselectedDate}
            clients={clients}
            services={services}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            mode="create"
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Tip:</strong> La hora de fin se calcula automáticamente según la duración
          del servicio. Puedes modificarla manualmente si es necesario.
        </p>
      </div>
    </MainLayoutContainer>
  )
}
