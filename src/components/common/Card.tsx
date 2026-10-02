import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
}

interface CardSectionProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div
      className={clsx(
        'card',
        hoverable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={clsx('card-header', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={clsx('card-body', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={clsx('card-footer', className)}>
      {children}
    </div>
  )
}
