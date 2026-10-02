import { ReactNode } from 'react'
import clsx from 'clsx'

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  children: ReactNode
  className?: string
  size?: 'sm' | 'md'
}

export function Badge({ variant = 'primary', children, className, size = 'md' }: BadgeProps) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    info: 'badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  }

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
  }

  return (
    <span
      className={clsx(
        'badge',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// Badges especializados para estados comunes
export function AppointmentStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    confirmada: 'success',
    pendiente: 'warning',
    completada: 'info',
    cancelada: 'danger',
    no_show: 'danger',
  }

  const labelMap: Record<string, string> = {
    confirmada: 'Confirmada',
    pendiente: 'Pendiente',
    completada: 'Completada',
    cancelada: 'Cancelada',
    no_show: 'No Show',
  }

  return (
    <Badge variant={statusMap[status] || 'info'}>
      {labelMap[status] || status}
    </Badge>
  )
}

export function MessageStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, 'success' | 'warning' | 'info'> = {
    no_leido: 'info',
    en_progreso: 'warning',
    respondido: 'success',
  }

  const labelMap: Record<string, string> = {
    no_leido: 'No leído',
    en_progreso: 'En progreso',
    respondido: 'Respondido',
  }

  return (
    <Badge variant={statusMap[status] || 'info'} size="sm">
      {labelMap[status] || status}
    </Badge>
  )
}

export function CustomerTypeBadge({ tipo }: { tipo: string }) {
  const variantMap: Record<string, 'primary' | 'success' | 'warning'> = {
    nueva: 'warning',
    recurrente: 'info',
    vip: 'primary',
  }

  const labelMap: Record<string, string> = {
    nueva: 'Nueva',
    recurrente: 'Recurrente',
    vip: 'VIP',
  }

  return (
    <Badge variant={variantMap[tipo] || 'info'} size="sm">
      {labelMap[tipo] || tipo}
    </Badge>
  )
}
