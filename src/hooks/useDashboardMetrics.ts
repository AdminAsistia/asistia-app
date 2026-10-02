import { useState, useEffect } from 'react'
import { useNotification } from '@components/common'
import axios from 'axios'

interface DashboardMetrics {
  totalClientes: number
  citasEsteMes: number
  ingresosEsteMes: number
  ausencias: number
  citasPorMes: Array<{ mes: string; cantidad: number }>
  clientesPorTipo: Array<{ tipo: string; cantidad: number }>
  ingresosTrend: Array<{ mes: string; ingresos: number }>
}

interface UseDashboardMetricsReturn {
  data: DashboardMetrics | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * useDashboardMetrics - Hook para cargar métricas del dashboard
 *
 * Fetches:
 * - Total de clientes
 * - Citas este mes
 * - Ingresos este mes
 * - Ausencias
 * - Citas por mes (últimos 6 meses)
 * - Clientes por tipo
 * - Ingresos trend
 *
 * Backend endpoint:
 * GET /dashboard/metrics?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
 */
export function useDashboardMetrics(
  dateFrom?: string,
  dateTo?: string
): UseDashboardMetricsReturn {
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const notify = useNotification()

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await axios.get<DashboardMetrics>(
        `/dashboard/metrics${params.toString() ? `?${params}` : ''}`
      )

      setData(response.data)
    } catch (err) {
      let errorMessage = 'Error cargando métricas'

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          errorMessage = 'No tienes permisos para ver el dashboard'
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

  // Cargar en mount
  useEffect(() => {
    fetchMetrics()
  }, [dateFrom, dateTo])

  return { data, isLoading, error, refetch: fetchMetrics }
}

/**
 * Mock data para desarrollo
 * Usar en desarrollo cuando el backend no está disponible
 */
export function getDashboardMockData(): DashboardMetrics {
  return {
    totalClientes: 142,
    citasEsteMes: 38,
    ingresosEsteMes: 4250,
    ausencias: 3,
    citasPorMes: [
      { mes: 'Ago', cantidad: 28 },
      { mes: 'Sep', cantidad: 32 },
      { mes: 'Oct', cantidad: 38 },
      { mes: 'Nov', cantidad: 35 },
      { mes: 'Dic', cantidad: 42 },
      { mes: 'Ene', cantidad: 39 },
    ],
    clientesPorTipo: [
      { tipo: 'Nueva', cantidad: 18 },
      { tipo: 'Recurrente', cantidad: 98 },
      { tipo: 'VIP', cantidad: 26 },
    ],
    ingresosTrend: [
      { mes: 'Ago', ingresos: 2800 },
      { mes: 'Sep', ingresos: 3200 },
      { mes: 'Oct', ingresos: 4250 },
      { mes: 'Nov', ingresos: 3900 },
      { mes: 'Dic', ingresos: 4600 },
      { mes: 'Ene', ingresos: 4100 },
    ],
  }
}
