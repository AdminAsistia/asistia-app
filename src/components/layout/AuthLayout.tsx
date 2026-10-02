import { useUIStore } from '@store/uiStore'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

/**
 * AuthLayout - Layout para páginas de autenticación (Login, Register, Reset Password)
 * Características:
 * - Sin Header ni Sidebar
 * - Contenido centrado (600px max)
 * - Fondo con patrón/gradiente
 * - Tema claro/oscuro soportado
 *
 * Uso:
 * <AuthLayout title="Inicia sesión" subtitle="Accede a tu cuenta de AsistIA">
 *   <LoginForm />
 * </AuthLayout>
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { theme } = useUIStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background Pattern (decorativo) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200 dark:bg-rose-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sage-200 dark:bg-sage-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">A</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            AsistIA
          </h1>

          {title && (
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          {children}
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} AsistIA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * AuthLayoutMinimal - Versión simplificada sin decoraciones
 */
export function AuthLayoutMinimal({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Minimal Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">A</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          {children}
        </div>
      </div>
    </div>
  )
}
