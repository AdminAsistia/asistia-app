import { useMemo } from 'react'
import clsx from 'clsx'

export interface Message {
  id: string
  clientId: string
  clientName: string
  channel: 'whatsapp' | 'sms' | 'email'
  direction: 'inbound' | 'outbound'
  content: string
  timestamp: string // ISO datetime
  status: 'sent' | 'delivered' | 'read' | 'failed'
  appointmentId?: string
}

interface MessageThreadProps {
  messages: Message[]
  clientName: string
  onSendMessage?: (content: string, channel: Message['channel']) => Promise<void>
  isLoading?: boolean
  className?: string
}

/**
 * MessageThread - Hilo de conversación con un cliente
 *
 * Muestra:
 * - Conversación completa (inbound y outbound)
 * - Messages agrupados por fecha
 * - Estado de entrega (enviado, entregado, leído)
 * - Canal de comunicación (WhatsApp, SMS, Email)
 * - Timestamps en Spanish locale
 */
export function MessageThread({
  messages,
  clientName,
  onSendMessage,
  isLoading = false,
  className,
}: MessageThreadProps) {
  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: Record<string, Message[]> = {}

    messages.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toISOString().split('T')[0]
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(msg)
    })

    return groups
  }, [messages])

  // Get channel icon
  const getChannelIcon = (channel: Message['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return '💬'
      case 'sms':
        return '📱'
      case 'email':
        return '📧'
      default:
        return '💭'
    }
  }

  // Get channel label
  const getChannelLabel = (channel: Message['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp'
      case 'sms':
        return 'SMS'
      case 'email':
        return 'Email'
      default:
        return 'Mensaje'
    }
  }

  // Get status icon
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return '✓'
      case 'delivered':
        return '✓✓'
      case 'read':
        return '✓✓'
      case 'failed':
        return '✗'
      default:
        return '•'
    }
  }

  // Get status color
  const getStatusColor = (status: Message['status'], direction: Message['direction']) => {
    if (direction === 'inbound') return 'text-slate-400 dark:text-slate-500'

    switch (status) {
      case 'sent':
        return 'text-slate-400 dark:text-slate-500'
      case 'delivered':
        return 'text-blue-500 dark:text-blue-400'
      case 'read':
        return 'text-sage-500 dark:text-sage-400'
      case 'failed':
        return 'text-red-500 dark:text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  return (
    <div className={clsx('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{clientName}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {messages.length} mensajes
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
          <div key={dateKey}>
            {/* Date Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-500 dark:text-slate-400 px-2">
                {new Date(dateKey).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {dayMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={clsx(
                    'flex gap-3',
                    msg.direction === 'outbound' && 'justify-end'
                  )}
                >
                  {/* Inbound message (left) */}
                  {msg.direction === 'inbound' && (
                    <div className="flex gap-2">
                      <div className="text-lg pt-1">{getChannelIcon(msg.channel)}</div>
                      <div className="max-w-sm">
                        <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-900 dark:text-white break-words">
                            {msg.content}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-2 px-3">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {getChannelLabel(msg.channel)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Outbound message (right) */}
                  {msg.direction === 'outbound' && (
                    <div className="flex gap-2 justify-end">
                      <div className="max-w-sm">
                        <div className="px-3 py-2 rounded-lg bg-rose-500 dark:bg-rose-600 text-white">
                          <p className="text-sm break-words">{msg.content}</p>
                        </div>
                        <div className="mt-1 flex items-center justify-end gap-2 px-3">
                          <span
                            className={clsx(
                              'text-xs',
                              getStatusColor(msg.status, msg.direction)
                            )}
                          >
                            {getStatusIcon(msg.status)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg pt-1">{getChannelIcon(msg.channel)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">😶</p>
            <p className="text-slate-600 dark:text-slate-400">
              No hay mensajes con este cliente
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      {onSendMessage && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
          {/* Channel selector */}
          <div className="flex gap-2 mb-3">
            <button className="px-3 py-1 rounded text-sm font-medium bg-rose-500 text-white">
              💬 WhatsApp
            </button>
            <button className="px-3 py-1 rounded text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition">
              📱 SMS
            </button>
            <button className="px-3 py-1 rounded text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition">
              📧 Email
            </button>
          </div>

          {/* TODO: Add message input form */}
          <textarea
            placeholder="Escribe un mensaje..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>
      )}
    </div>
  )
}
