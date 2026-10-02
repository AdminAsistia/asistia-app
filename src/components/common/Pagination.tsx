import clsx from 'clsx'
import { Button } from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showPages = pages.filter((page) => {
    if (totalPages <= 7) return true
    if (page === 1 || page === totalPages) return true
    if (Math.abs(page - currentPage) <= 1) return true
    return false
  })

  let lastShown = 0
  const pagesWithDots = showPages.map((page) => {
    const result = []
    if (page - lastShown > 1) {
      result.push({ type: 'dots' as const, key: `dots-${lastShown}` })
    }
    result.push({ type: 'page' as const, page })
    lastShown = page
    return result
  }).flat()

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </Button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {pagesWithDots.map((item) => {
          if (item.type === 'dots') {
            return (
              <span key={item.key} className="px-2 py-1 text-slate-500">
                ...
              </span>
            )
          }

          const page = item.page
          const isActive = currentPage === page

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={clsx(
                'px-3 py-1 text-sm rounded transition-colors',
                isActive
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        Siguiente
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </nav>
  )
}

interface SimplePaginationProps {
  isLoading?: boolean
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  onPrevious?: () => void
  onNext?: () => void
}

export function SimplePagination({
  isLoading = false,
  hasNextPage = false,
  hasPreviousPage = false,
  onPrevious,
  onNext,
}: SimplePaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={onPrevious}
        disabled={!hasPreviousPage || isLoading}
      >
        Anterior
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={onNext}
        disabled={!hasNextPage || isLoading}
      >
        Siguiente
      </Button>
    </div>
  )
}
