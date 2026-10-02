import { useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Message } from './MessageThread'

interface ConversationSummary {
  clientId: string
  clientName: string
  lastMessage: Message
  unreadCount: number
  messageCount: number
}

interface MessageCenterProps {
  messages: Message[]
  onSelectConversation?: (clientId: string, clientName: string) => void
  selectedClientId?: string
  className?: string
}

/**
 * MessageCenter - Centro de mensajes con lista de conversaciones
 *
 * Muestra:
 * - Lista de conversaciones por cliente
 * - Último mensaje y timestamp
 * - Contador de mensajes sin leer
 * - Canal de último mensaje
 * - Búsqueda y filtro de conversaciones
 */
export function MessageCenter({
  messages,
  onSelectConversation,
  selectedClientId,
  className,
}: MessageCenterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterChannel, setFilterChannel] = useState<'all' | 'whatsapp' | 'sms' | 'email'>(
    'all'
  )

  // Group messages by client and create summaries
  const conversations = useMemo(() => {
    const grouped: Record<string, Message[]> = {}

    messages.forEach((msg) => {
      if (!grouped[msg.clientId]) {
        grouped[msg.clientId] = []
      }
      grouped[msg.clientId].push(msg)
    })

    // Create summaries
    const summaries: ConversationSummary[] = Object.entries(grouped).map(
      ([clientId, clientMessages]) => {
        // Sort by timestamp descending
        const sorted = [...clientMessages].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        return {
          clientId,
          clientName: sorted[0].clientName,
          lastMessage: sorted[0],
          unreadCount: sorted.filter((m) => m.direction === 'inbound' && m.status !== 'read')
            .length,
          messageCount: clientMessages.length,
        }
      }
    )

    return summaries
      .filter((conv) => {
        // Search filter
        if (
          searchTerm &&
          !conv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false
        }

        // Channel filter
        if (filterChannel !== 'all' && conv.lastMessage.channel !== filterChannel) {
          return false
        }

        return true
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
      )
  }, [messages, searchTerm, filterChannel])

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

  const getChannelColor = (channel: Message['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'sms':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      case 'email':
        return 'bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300'
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300'
    }
  }

  return (
    <div className={clsx('flex flex-col h-full bg-white dark:bg-slate-800', className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mensajes</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 mb-3 text-sm"
        />

        {/* Channel filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'whatsapp', 'sms', 'email'] as const).map((channel) => (
            <button
              key={channel}
              onClick={() => setFilterChannel(channel)}
              className={clsx(
                'px-3 py-1 rounded text-sm font-medium transition',
                filterChannel === channel
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              )}
            >
              {channel === 'all' ? 'Todos' : channel === 'whatsapp' ? '💬 WhatsApp' : channel === 'sms' ? '📱 SMS' : '📧 Email'}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <button
              key={conv.clientId}
              onClick={() => onSelectConversation?.(conv.clientId, conv.clientName)}
              className={clsx(
                'w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition',
                selectedClientId === conv.clientId &&
                  'bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500'
              )}
            >
              {/* Client name and unread badge */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {conv.clientName}
                </h3>
                {conv.unreadCount > 0 && (
                  <span className="px-2 py-1 rounded-full bg-rose-500 text-white text-xs font-bold">
                    {conv.unreadCount}
                  </span>
                )}
              </div>

              {/* Last message preview */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                {conv.lastMessage.direction === 'outbound' ? 'Tú: ' : ''}{conv.lastMessage.content}
              </p>

              {/* Footer: timestamp, channel, count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getChannelIcon(conv.lastMessage.channel)}</span>
                  <span className={clsx('text-xs px-2 py-1 rounded', getChannelColor(conv.lastMessage.channel))}>
                    {conv.lastMessage.channel.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(conv.lastMessage.timestamp).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Message count */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {conv.messageCount} {conv.messageCount === 1 ? 'mensaje' : 'mensajes'}
              </p>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <p className="text-2xl text-slate-400 dark:text-slate-500 mb-2">🔇</p>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm ? 'No se encontraron conversaciones' : 'Sin mensajes aún'}
            </p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}
          {conversations.some((c) => c.unreadCount > 0) && (
            <>
              {' • '}
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} sin leer
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
