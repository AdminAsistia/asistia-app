import { useState } from 'react'
import { MainLayoutContainer } from '@components/shared'
import { KPICard, DashboardChart } from '@components/dashboard'
import { Input, Button, CardSkeleton } from '@components/common'
import { useDashboardMetrics, getDashboardMockData } from '@hooks/useDashboardMetrics'

/**
 * Dashboard - Página principal del sistema
 *
 * Muestra:
 * - KPI Cards (4): Total clientes, citas, ingresos, ausencias
 * - Charts: Citas por mes, clientes por tipo, ingresos trend
 * - Date range filters
 * - Refresh action
 *
 * Data flow:
 * 1. useDashboardMetrics fetches GET /dashboard/metrics
 * 2. Renderiza KPI cards en grid
 * 3. Renderiza charts en grid
 * 4. Soporta date filtering
 */
export default function Dashboard() {
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  // Fetch metrics
  const { data, isLoading, error, refetch } = useDashboardMetrics(dateFrom, dateTo)

  // Use mock data en desarrollo
  const metrics = data || getDashboardMockData()

  const handleDateChange = () => {
    // refetch se ejecuta automáticamente en useEffect cuando dateFrom/dateTo cambian
  }

  return (
    <MainLayoutContainer showFooter>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Bienvenido de vuelta. Aquí está el resumen de tu clínica.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            type="date"
            label="Desde"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            label="Hasta"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <div className="flex items-end gap-2">
            <Button variant="secondary" fullWidth onClick={handleDateChange}>
              Aplicar
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setDateFrom('')
                setDateTo('')
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          <CardSkeleton count={4} />
        ) : (
          <>
            <KPICard
              title="Total Clientes"
              value={metrics.totalClientes}
              subtitle="Clientes activos"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20H9m6 0H9" />
                </svg>
              }
              trend={{ value: 12, isPositive: true }}
              color="rose"
            />

            <KPICard
              title="Citas Este Mes"
              value={metrics.citasEsteMes}
              subtitle="Programadas"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              trend={{ value: 8, isPositive: true }}
              color="blue"
            />

            <KPICard
              title="Ingresos Este Mes"
              value={`€${metrics.ingresosEsteMes}`}
              subtitle="Total generado"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={{ value: 15, isPositive: true }}
              color="sage"
            />

            <KPICard
              title="Ausencias"
              value={metrics.ausencias}
              subtitle="Este mes"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 5v1m0-16V5m0 16H5m14 0h4m-4-4V5" />
                </svg>
              }
              trend={{ value: 25, isPositive: false }}
              color="warm"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {isLoading ? (
          <>
            <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          </>
        ) : (
          <>
            <DashboardChart
              title="Citas por Mes"
              subtitle="Últimos 6 meses"
              type="bar"
              data={metrics.citasPorMes.map((item) => ({
                label: item.mes,
                value: item.cantidad,
              }))}
              height={300}
            />

            <DashboardChart
              title="Clientes por Tipo"
              subtitle="Segmentación"
              type="donut"
              data={metrics.clientesPorTipo.map((item) => ({
                label: item.tipo,
                value: item.cantidad,
              }))}
              height={300}
            />
          </>
        )}
      </div>

      {/* Ingresos Trend */}
      <div className="mb-8">
        {isLoading ? (
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        ) : (
          <DashboardChart
            title="Ingresos Trend"
            subtitle="Últimos 6 meses"
            type="line"
            data={metrics.ingresosTrend.map((item) => ({
              label: item.mes,
              value: item.ingresos,
            }))}
            height={350}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button fullWidth variant="secondary">
          Crear Cita
        </Button>
        <Button fullWidth variant="secondary">
          Añadir Cliente
        </Button>
        <Button fullWidth variant="secondary">
          Ver Mensajes
        </Button>
        <Button fullWidth variant="secondary">
          Ver Reportes
        </Button>
      </div>
    </MainLayoutContainer>
  )
}
