import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { NotificationCenter } from '@components/common'
import clsx from 'clsx'

interface MainLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

/**
 * MainLayout - Layout para todas las vistas de la app principal
 * Incluye: Header (fijo), Sidebar (responsivo), Contenido, Footer (opcional)
 *
 * Uso:
 * <MainLayout>
 *   <div>Contenido de la página</div>
 * </MainLayout>
 */
export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Notifications Toast Center */}
      <NotificationCenter />

      {/* Header Fijo */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto md:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>

          {/* Footer */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  )
}

/**
 * MainLayoutContainer - Versión con container max-width para contenido centrado
 */
export function MainLayoutContainer({ children, showFooter = true }: MainLayoutProps) {
  return (
    <MainLayout showFooter={showFooter}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </MainLayout>
  )
}
