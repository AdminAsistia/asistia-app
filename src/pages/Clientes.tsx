import { useState, useMemo } from 'react'
import { MainLayoutContainer } from '@components/layout'
import { ClientCard } from '@components/clients'
import { ClientDetailModal } from '@components/clients'
import { ClientForm } from '@components/clients'
import { useClients } from '@hooks/useClients'
import type { Client, CreateClientPayload, UpdateClientPayload } from '@hooks/useClients'
import clsx from 'clsx'

type FilterStatus = 'all' | 'active' | 'inactive' | 'vip'
type FormMode = 'create' | 'edit' | null

/**
 * Clientes - Página de gestión de clientes
 *
 * Funcionalidades:
 * - Búsqueda en tiempo real (nombre, email, teléfono)
 * - Filtros por estado (Todos, Activos, Inactivos, VIP)
 * - Grid responsive de tarjetas de clientes
 * - Crear nuevo cliente
 * - Ver detalles del cliente (incluyendo historial dermatológico)
 * - Editar cliente
 * - Eliminar cliente
 * - Estadísticas: total clientes, activos, VIP
 *
 * Flujo:
 * 1. Carga lista de clientes en mount
 * 2. Usuario puede buscar o filtrar
 * 3. Click en tarjeta abre modal de detalles
 * 4. Desde modal puede editar, eliminar o ver historial
 * 5. Botón "Crear" abre formulario vacío
 */
export function Clientes() {
  const {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    getDermicHistory,
  } = useClients()

  // UI State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Filter and search logic
  const filteredClients = useMemo(() => {
    let result = clients

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((c) => c.status === filterStatus)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.phone?.includes(query)
      )
    }

    return result
  }, [clients, filterStatus, searchQuery])

  // Statistics
  const stats = useMemo(
    () => ({
      total: clients.length,
      active: clients.filter((c) => c.status === 'active').length,
      inactive: clients.filter((c) => c.status === 'inactive').length,
      vip: clients.filter((c) => c.status === 'vip').length,
    }),
    [clients]
  )

  // Handlers
  const handleOpenDetail = (client: Client) => {
    setSelectedClient(client)
  }

  const handleCloseDetail = () => {
    setSelectedClient(null)
  }

  const handleOpenCreateForm = () => {
    setFormMode('create')
    setEditingClient(null)
    setSubmitError(null)
  }

  const handleOpenEditForm = (client: Client) => {
    setFormMode('edit')
    setEditingClient(client)
    setSubmitError(null)
    setSelectedClient(null) // Close detail modal
  }

  const handleCloseForm = () => {
    setFormMode(null)
    setEditingClient(null)
    setSubmitError(null)
  }

  const handleSubmitForm = async (data: CreateClientPayload | UpdateClientPayload) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (formMode === 'create') {
        const result = await createClient(data as CreateClientPayload)
        if (result) {
          handleCloseForm()
        } else {
          setSubmitError('No se pudo crear el cliente')
        }
      } else if (formMode === 'edit' && editingClient) {
        const result = await updateClient(editingClient.id, data as UpdateClientPayload)
        if (result) {
          handleCloseForm()
        } else {
          setSubmitError('No se pudo actualizar el cliente')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (await deleteClient(clientId)) {
      handleCloseDetail()
    }
  }

  const handleEditFromDetail = (client: Client) => {
    handleOpenEditForm(client)
  }

  // Render loading state
  if (isLoading && clients.length === 0) {
    return (
      <MainLayoutContainer title="Clientes" description="Gestión de clientes">
        <div className="space-y-4">
          {/* Search and Filters skeleton */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>

          {/* Filter buttons skeleton */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </MainLayoutContainer>
    )
  }

  return (
    <MainLayoutContainer title="Clientes" description="Gestión de clientes">
      {/* Header with Search and Create Button */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm focus:ring-1 focus:ring-rose-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-2.5 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition whitespace-nowrap"
        >
          + Crear
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        {[
          { value: 'all' as FilterStatus, label: 'Todos', count: stats.total },
          { value: 'active' as FilterStatus, label: 'Activos', count: stats.active },
          { value: 'inactive' as FilterStatus, label: 'Inactivos', count: stats.inactive },
          { value: 'vip' as FilterStatus, label: '👑 VIP', count: stats.vip },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={clsx(
              'px-3 py-2 rounded-lg font-medium text-sm transition',
              filterStatus === filter.value
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {filter.label}
            <span className="ml-2 text-xs opacity-80">({filter.count})</span>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {searchQuery || filterStatus !== 'all'
                ? 'No se encontraron clientes con estos criterios'
                : 'No hay clientes aún. ¡Crea el primero!'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              id={client.id}
              name={client.name}
              phone={client.phone}
              email={client.email}
              status={client.status}
              totalAppointments={client.totalAppointments}
              lastAppointment={client.lastAppointment}
              notes={client.notes}
              onClick={() => handleOpenDetail(client)}
              onEdit={() => handleOpenEditForm(client)}
              onDelete={() => handleDeleteClient(client.id)}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total Clientes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Activos</p>
            <p className="text-2xl font-bold text-sage-600 dark:text-sage-400 mt-1">
              {stats.active}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Inactivos</p>
            <p className="text-2xl font-bold text-slate-500 mt-1">{stats.inactive}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">VIP</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats.vip}</p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={handleCloseDetail}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteClient}
          onGetDermicHistory={getDermicHistory}
        />
      )}

      {/* Create/Edit Form Modal */}
      {formMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {formMode === 'create' ? 'Crear Cliente' : 'Editar Cliente'}
              </h2>
            </div>

            <div className="p-6">
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <ClientForm
                client={editingClient}
                isLoading={isSubmitting}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayoutContainer>
  )
}
