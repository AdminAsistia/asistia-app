import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'bg-slate-200 dark:bg-slate-700 rounded animate-pulse',
            className
          )}
        />
      ))}
    </>
  )
}

export function SkeletonText() {
  return <Skeleton className="h-4 w-full mb-2" />
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={clsx(
          'border-2 border-slate-200 dark:border-slate-700 border-t-rose-600 rounded-full animate-spin',
          sizes[size]
        )}
      />
    </div>
  )
}

export function LoadingOverlay({ isLoading = true }: { isLoading?: boolean }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Spinner size="lg" />
    </div>
  )
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  )
}
