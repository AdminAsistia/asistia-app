import { useState, useMemo } from 'react'
import { MainLayoutContainer } from '@components/layout'
import { MessageCenter } from '@components/messages'
import { MessageThread, Message } from '@components/messages'

/**
 * Mensajes - Centro unificado de mensajes
 *
 * Funcionalidades:
 * - Lista de conversaciones por cliente
 * - Vista de hilo de conversación completo
 * - Soporta múltiples canales: WhatsApp, SMS, Email
 * - Búsqueda y filtrado de conversaciones
 * - Estados de mensajes (enviado, entregado, leído)
 *
 * Integración:
 * - WhatsApp para confirmaciones y recordatorios
 * - SMS como fallback
 * - Email para información detallada
 */
export function Mensajes() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null)

  // Mock messages (TODO: Fetch from API)
  const [messages] = useState<Message[]>([
    {
      id: '1',
      clientId: 'client-1',
      clientName: 'María García',
      channel: 'whatsapp',
      direction: 'outbound',
      content: 'Hola María, tu cita para mañana a las 10:00 está confirmada. ¿Tienes alguna pregunta?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      appointmentId: 'apt-1',
    },
    {
      id: '2',
      clientId: 'client-1',
      clientName: 'María García',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Perfecto, muchas gracias. ¿Puedo llegar 5 minutos antes?',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      id: '3',
      clientId: 'client-1',
      clientName: 'María García',
      channel: 'whatsapp',
      direction: 'outbound',
      content: 'Por supuesto, no hay problema. Te espero mañana a las 9:55. 😊',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
    },
    {
      id: '4',
      clientId: 'client-2',
      clientName: 'Laura Fernández',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Hola, quisiera agendar una cita para el próximo jueves si es posible',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'read',
    },
    {
      id: '5',
      clientId: 'client-2',
      clientName: 'Laura Fernández',
      channel: 'whatsapp',
      direction: 'outbound',
      content: 'Hola Laura, tengo disponibilidad el jueves a las 16:30. ¿Te viene bien?',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: 'sent',
    },
    {
      id: '6',
      clientId: 'client-3',
      clientName: 'Sofia López',
      channel: 'email',
      direction: 'outbound',
      content: 'Reporte del tratamiento realizad el 02/10/2026. Adjunto foto de progreso.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'delivered',
      appointmentId: 'apt-3',
    },
    {
      id: '7',
      clientId: 'client-4',
      clientName: 'Carmen Ruiz',
      channel: 'sms',
      direction: 'outbound',
      content: 'Recordatorio: Tu cita es hoy a las 18:00. Confirma tu asistencia respondiendo sí',
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      status: 'delivered',
      appointmentId: 'apt-4',
    },
  ])

  // Get selected conversation messages
  const selectedConversation = useMemo(() => {
    if (!selectedClientId) return []
    return messages.filter((m) => m.clientId === selectedClientId)
  }, [selectedClientId, messages])

  // Handlers
  const handleSelectConversation = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId)
    setSelectedClientName(clientName)
  }

  const handleSendMessage = async (content: string, channel: Message['channel']) => {
    // TODO: Call API to send message
    console.log('Sending message:', { content, channel, clientId: selectedClientId })
  }

  return (
    <MainLayoutContainer title="Mensajes" description="Centro unificado de mensajes con clientes">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Message Center - Left Column */}
        <div className="lg:col-span-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <MessageCenter
            messages={messages}
            onSelectConversation={handleSelectConversation}
            selectedClientId={selectedClientId || undefined}
          />
        </div>

        {/* Message Thread - Right Column */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {selectedClientId && selectedClientName ? (
            <MessageThread
              messages={selectedConversation}
              clientName={selectedClientName}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-slate-800 p-8">
              <p className="text-3xl text-slate-400 dark:text-slate-500 mb-3">💭</p>
              <p className="text-lg text-slate-900 dark:text-white font-semibold mb-1">
                Sin conversación seleccionada
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                Selecciona una conversación de la lista para ver los mensajes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total messages */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Mensajes</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{messages.length}</p>
        </div>

        {/* By channel */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">💬 WhatsApp</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {messages.filter((m) => m.channel === 'whatsapp').length}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">📱 SMS</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {messages.filter((m) => m.channel === 'sms').length}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">📧 Email</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {messages.filter((m) => m.channel === 'email').length}
          </p>
        </div>
      </div>

      {/* Help text */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Los mensajes se envían automáticamente para:</strong> Confirmación de citas,
          recordatorios 24h antes, actualizaciones de estado, y reportes después del servicio.
        </p>
      </div>
    </MainLayoutContainer>
  )
}
