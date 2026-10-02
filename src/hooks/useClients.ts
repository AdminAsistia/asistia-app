import { useState, useEffect } from 'react'
import { useNotification } from '@components/common'
import axios from 'axios'

export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  skinType?: 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'
  allergies?: string
  notes?: string
  status: 'active' | 'inactive' | 'vip'
  totalAppointments: number
  lastAppointment?: string
  createdAt: string
  updatedAt: string
}

export interface DermicHistoryEntry {
  id: string
  clientId: string
  date: string
  treatment: string
  provider: string
  notes?: string
  photos?: Array<{ id: string; url: string }>
}

interface UseClientsReturn {
  clients: Client[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  getClientDetail: (id: string) => Promise<Client | null>
  getDermicHistory: (clientId: string) => Promise<DermicHistoryEntry[]>
  createClient: (data: CreateClientPayload) => Promise<Client | null>
  updateClient: (id: string, data: UpdateClientPayload) => Promise<Client | null>
  deleteClient: (id: string) => Promise<boolean>
  searchClients: (query: string) => Promise<Client[]>
}

export interface CreateClientPayload {
  name: string
  phone?: string
  email?: string
  address?: string
  skinType?: string
  allergies?: string
  notes?: string
  status?: 'active' | 'inactive' | 'vip'
}

export interface UpdateClientPayload {
  name?: string
  phone?: string
  email?: string
  address?: string
  skinType?: string
  allergies?: string
  notes?: string
  status?: 'active' | 'inactive' | 'vip'
}

/**
 * useClients - Hook para gestionar clientes
 *
 * Fetches:
 * - GET /clients - lista de clientes
 * - GET /clients/:id - detalles de cliente
 * - GET /clients/:id/dermic-history - historial dermatológico
 * - GET /clients/search?q=query - búsqueda de clientes
 *
 * Actions:
 * - POST /clients - crear cliente
 * - PATCH /clients/:id - actualizar cliente
 * - DELETE /clients/:id - eliminar cliente
 *
 * Response format (Client):
 * {
 *   id, name, phone, email, address,
 *   skinType, allergies, notes, status,
 *   totalAppointments, lastAppointment,
 *   createdAt, updatedAt
 * }
 */
export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const notify = useNotification()

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get<Client[]>('/clients')
      setClients(response.data)
    } catch (err) {
      let errorMessage = 'Error cargando clientes'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          errorMessage = 'No tienes permisos para ver clientes'
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

  const getClientDetail = async (id: string): Promise<Client | null> => {
    try {
      const response = await axios.get<Client>(`/clients/${id}`)
      return response.data
    } catch (err) {
      let errorMessage = 'Error cargando cliente'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage = 'Cliente no encontrado'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return null
    }
  }

  const getDermicHistory = async (clientId: string): Promise<DermicHistoryEntry[]> => {
    try {
      const response = await axios.get<DermicHistoryEntry[]>(
        `/clients/${clientId}/dermic-history`
      )
      return response.data
    } catch (err) {
      let errorMessage = 'Error cargando historial dermatológico'

      if (axios.isAxiosError(err)) {
        if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return []
    }
  }

  const createClient = async (data: CreateClientPayload): Promise<Client | null> => {
    try {
      const response = await axios.post<Client>('/clients', data)
      setClients([...clients, response.data])
      notify.success('Cliente creado exitosamente', 2000)
      return response.data
    } catch (err) {
      let errorMessage = 'Error creando cliente'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          errorMessage = err.response.data?.message || 'Datos inválidos'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return null
    }
  }

  const updateClient = async (
    id: string,
    data: UpdateClientPayload
  ): Promise<Client | null> => {
    try {
      const response = await axios.patch<Client>(`/clients/${id}`, data)
      setClients(clients.map((c) => (c.id === id ? response.data : c)))
      notify.success('Cliente actualizado', 2000)
      return response.data
    } catch (err) {
      let errorMessage = 'Error actualizando cliente'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage = 'Cliente no encontrado'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return null
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`/clients/${id}`)
      setClients(clients.filter((c) => c.id !== id))
      notify.success('Cliente eliminado', 2000)
      return true
    } catch (err) {
      let errorMessage = 'Error eliminando cliente'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage = 'Cliente no encontrado'
        } else if (!err.response) {
          errorMessage = 'No se puede conectar al servidor'
        }
      }

      notify.error(errorMessage)
      return false
    }
  }

  const searchClients = async (query: string): Promise<Client[]> => {
    try {
      if (!query.trim()) {
        return clients
      }

      const response = await axios.get<Client[]>('/clients/search', {
        params: { q: query },
      })
      return response.data
    } catch (err) {
      notify.error('Error en búsqueda')
      return clients
    }
  }

  // Fetch clients on mount
  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    getClientDetail,
    getDermicHistory,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
  }
}

/**
 * Mock data para development
 */
export function getClientsMockData(): Client[] {
  return [
    {
      id: 'cli_1',
      name: 'María González López',
      phone: '+34 612 345 678',
      email: 'maria@example.com',
      address: 'Calle Principal 123, Huesca',
      skinType: 'sensitive',
      allergies: 'Ácido salicílico',
      notes: 'Piel reactiva, empezó recientemente',
      status: 'active',
      totalAppointments: 5,
      lastAppointment: '2026-10-01',
      createdAt: '2026-09-15',
      updatedAt: '2026-10-01',
    },
    {
      id: 'cli_2',
      name: 'Ana Rodríguez Santos',
      phone: '+34 623 456 789',
      email: 'ana@example.com',
      address: 'Avenida Central 456, Barbastro',
      skinType: 'oily',
      allergies: 'Ninguna',
      notes: 'Tratamiento acné, muy comprometida',
      status: 'vip',
      totalAppointments: 12,
      lastAppointment: '2026-09-28',
      createdAt: '2026-08-01',
      updatedAt: '2026-09-28',
    },
    {
      id: 'cli_3',
      name: 'Carmen Martínez Ruiz',
      phone: '+34 634 567 890',
      email: 'carmen@example.com',
      address: 'Plaza Mayor 789, Monzón',
      skinType: 'dry',
      allergies: 'Perfumes',
      notes: 'Cliente leal, interesada en rutinas completas',
      status: 'active',
      totalAppointments: 18,
      lastAppointment: '2026-09-25',
      createdAt: '2026-07-01',
      updatedAt: '2026-09-25',
    },
    {
      id: 'cli_4',
      name: 'Laura Pérez Gómez',
      phone: '+34 645 678 901',
      email: 'laura@example.com',
      skinType: 'combination',
      notes: 'Consulta inicial pendiente',
      status: 'active',
      totalAppointments: 1,
      lastAppointment: '2026-09-30',
      createdAt: '2026-09-30',
      updatedAt: '2026-09-30',
    },
    {
      id: 'cli_5',
      name: 'Sofia Díaz Moreno',
      phone: '+34 656 789 012',
      email: 'sofia@example.com',
      skinType: 'normal',
      allergies: 'Níquel (joyería)',
      notes: 'Mantenimiento preventivo',
      status: 'inactive',
      totalAppointments: 8,
      lastAppointment: '2026-08-15',
      createdAt: '2026-06-01',
      updatedAt: '2026-08-15',
    },
  ]
}

/**
 * Mock dermic history
 */
export function getDermicHistoryMockData(clientId: string): DermicHistoryEntry[] {
  const mockData: Record<string, DermicHistoryEntry[]> = {
    cli_1: [
      {
        id: 'hist_1',
        clientId: 'cli_1',
        date: '2026-10-01',
        treatment: 'Limpieza facial profunda',
        provider: 'Dra. López',
        notes: 'Se aplicó mascarilla calmante',
        photos: [
          { id: 'photo_1', url: '/images/before.jpg' },
          { id: 'photo_2', url: '/images/after.jpg' },
        ],
      },
      {
        id: 'hist_2',
        clientId: 'cli_1',
        date: '2026-09-15',
        treatment: 'Consulta inicial',
        provider: 'Dra. Silva',
        notes: 'Evaluación de piel, diagnosticado tipo sensible',
      },
    ],
    cli_2: [
      {
        id: 'hist_3',
        clientId: 'cli_2',
        date: '2026-09-28',
        treatment: 'Tratamiento acné avanzado',
        provider: 'Dra. López',
        notes: 'Sesión 5 de 8, mejora notable',
        photos: [
          { id: 'photo_3', url: '/images/progress.jpg' },
        ],
      },
      {
        id: 'hist_4',
        clientId: 'cli_2',
        date: '2026-09-21',
        treatment: 'Microdermoabrasión',
        provider: 'Dra. López',
        notes: 'Pulido complementario',
      },
      {
        id: 'hist_5',
        clientId: 'cli_2',
        date: '2026-09-14',
        treatment: 'Tratamiento acné avanzado',
        provider: 'Dra. Silva',
        notes: 'Sesión 4 de 8',
      },
    ],
  }

  return mockData[clientId] || []
}
