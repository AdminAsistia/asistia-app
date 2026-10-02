import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { AuthLayout } from '@components/shared'
import { LoginForm } from '@components/forms/LoginForm'

/**
 * LoginPage - Página de inicio de sesión
 *
 * Características:
 * - AuthLayout (centrado, sin sidebar)
 * - Formulario email + password
 * - Validación en cliente + servidor
 * - JWT token management
 * - Auto-redirect a Dashboard si ya está logueado
 *
 * Flujo:
 * 1. Usuario ingresa email + password
 * 2. LoginForm valida campos básicos
 * 3. POST a /auth/login
 * 4. Backend retorna {token, user}
 * 5. authStore guarda token + user
 * 6. localStorage persiste credenciales
 * 7. Redirige a Dashboard
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Auto-redirect si ya está logueado
  useEffect(() => {
    if (user?.id) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Accede a tu cuenta de AsistIA"
    >
      <LoginForm />
    </AuthLayout>
  )
}
