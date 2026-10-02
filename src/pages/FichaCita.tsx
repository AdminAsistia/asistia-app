import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayoutContainer } from '@components/layout'
import { AppointmentProtocolCard, ProtocolStep } from '@components/appointment'
import { ServicePhotosGallery, ServicePhoto } from '@components/appointment'
import { PaymentTracker, PaymentRecord, PaymentStatus } from '@components/appointment'
import { AppointmentNotes, Note } from '@components/appointment'
import { useAppointments } from '@hooks/useAppointments'
import { useClients } from '@hooks/useClients'
import clsx from 'clsx'

/**
 * FichaCita - Ficha de Cita Completa
 *
 * Componentes:
 * - Información de cliente y servicio
 * - Protocolo de servicio con progreso
 * - Galería de fotos (antes/después/progreso)
 * - Seguimiento de pagos
 * - Notas de la cita
 *
 * Funcionalidades:
 * - Ver todos los detalles de la cita
 * - Seguimiento del protocolo en tiempo real
 * - Gestión de fotos
 * - Registro de pagos
 * - Notas internas
 */
export function FichaCita() {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()

  // Hooks
  const { clients } = useClients()
  const { appointments } = useAppointments(new Date().toISOString().split('T')[0])

  // State
  const [appointment, setAppointment] = useState<any>(null)
  const [client, setClient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock protocol steps
  const [protocolSteps, setProtocolSteps] = useState<ProtocolStep[]>([
    {
      id: '1',
      order: 1,
      name: 'Limpieza Facial',
      description: 'Limpieza profunda con productos específicos para el tipo de piel',
      duration: 10,
      completed: true,
    },
    {
      id: '2',
      order: 2,
      name: 'Exfoliación',
      description: 'Exfoliación suave para eliminar células muertas',
      duration: 5,
      completed: true,
    },
    {
      id: '3',
      order: 3,
      name: 'Tratamiento Específico',
      description: 'Aplicación de suero o máscara según protocolo',
      duration: 15,
      completed: false,
    },
    {
      id: '4',
      order: 4,
      name: 'Masaje Facial',
      description: 'Masaje relajante para activar circulación',
      duration: 10,
      completed: false,
    },
    {
      id: '5',
      order: 5,
      name: 'Hidratación y Protección',
      description: 'Aplicación de crema hidratante y protector solar',
      duration: 5,
      completed: false,
    },
  ])

  // Mock photos
  const [photos, setPhotos] = useState<ServicePhoto[]>([
    {
      id: '1',
      type: 'before',
      url: 'https://via.placeholder.com/400x400?text=Antes',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Piel con textura y deshidratación',
    },
    {
      id: '2',
      type: 'progress',
      url: 'https://via.placeholder.com/400x400?text=Progreso',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Después de primera sesión',
    },
    {
      id: '3',
      type: 'after',
      url: 'https://via.placeholder.com/400x400?text=Después',
      date: new Date().toISOString(),
      notes: 'Piel más luminosa e hidratada',
    },
  ])

  // Mock payments
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: '1',
      method: 'card',
      amount: 30,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Depósito inicial',
    },
  ])

  // Mock notes
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      author: 'Dra. López',
      date: new Date().toISOString(),
      content: 'Cliente muy satisfecha con los resultados. Piel notoriamente más luminosa.',
      type: 'observation',
    },
    {
      id: '2',
      author: 'Admin',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      content: 'Próxima cita agendada para dos semanas. Cliente prefiere tardes.',
      type: 'follow-up',
    },
  ])

  // Load appointment and client
  useEffect(() => {
    setIsLoading(true)

    // Simular carga de datos
    if (appointmentId) {
      const foundAppointment = appointments.find((a) => a.id === appointmentId)
      if (foundAppointment) {
        setAppointment(foundAppointment)

        const foundClient = clients.find((c) => c.id === foundAppointment.clientId)
        if (foundClient) {
          setClient(foundClient)
        }
      }
    }

    setIsLoading(false)
  }, [appointmentId, appointments, clients])

  // Handlers
  const handleStepToggle = (stepId: string) => {
    setProtocolSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    )
  }

  const handleAddPayment = async () => {
    // TODO: Open payment dialog
    console.log('Add payment')
  }

  const handleUploadPhotos = async () => {
    // TODO: Open file upload dialog
    console.log('Upload photos')
  }

  const handleAddNote = async (content: string, type: Note['type']) => {
    const newNote: Note = {
      id: Date.now().toString(),
      author: 'Usuario Actual', // TODO: Get from auth
      date: new Date().toISOString(),
      content,
      type,
    }
    setNotes((prev) => [newNote, ...prev])
  }

  const paymentStatus: PaymentStatus = payments.length === 0 ? 'pending' : 'partial'
  const totalAmount = 60 // TODO: Get from service
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0)

  // Render loading
  if (isLoading || !appointment || !client) {
    return (
      <MainLayoutContainer title="Ficha de Cita" description="Detalles de la cita">
        <div className="space-y-4">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </MainLayoutContainer>
    )
  }

  // Render page
  return (
    <MainLayoutContainer title="Ficha de Cita" description={`${client.name} • ${appointment.serviceName}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/agenda')}
        className="mb-6 px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        ← Volver a Agenda
      </button>

      {/* Header Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-rose-50 to-rose-50/50 dark:from-rose-900/20 dark:to-rose-900/10 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Client */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Cliente</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{client.name}</h3>
            {client.phone && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">📞 {client.phone}</p>
            )}
          </div>

          {/* Service */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Servicio</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {appointment.serviceName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              ⏱️ {appointment.duration || 60} minutos
            </p>
          </div>

          {/* Date & Time */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Fecha y Hora</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {new Date(appointment.startTime).toLocaleDateString('es-ES')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {new Date(appointment.startTime).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Provider */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Profesional</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {appointment.provider}
            </h3>
            <p className={clsx('text-sm mt-2 px-2 py-1 rounded inline-block',
              appointment.status === 'completed'
                ? 'bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300'
                : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
            )}>
              {appointment.status === 'completed' ? '✓ Completada' : '⏳ En Progreso'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Protocol and Photos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Protocol */}
          <AppointmentProtocolCard
            steps={protocolSteps}
            onStepToggle={handleStepToggle}
          />

          {/* Photos */}
          <ServicePhotosGallery
            photos={photos}
            onUpload={handleUploadPhotos}
          />
        </div>

        {/* Right Column - Payment */}
        <div>
          <PaymentTracker
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            status={paymentStatus}
            payments={payments}
            onAddPayment={handleAddPayment}
          />
        </div>
      </div>

      {/* Notes */}
      <AppointmentNotes
        notes={notes}
        onAddNote={handleAddNote}
        isEditable={true}
      />
    </MainLayoutContainer>
  )
}
