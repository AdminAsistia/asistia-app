import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useUIStore } from '@store/uiStore'

// Layout
import MainLayout from '@components/layout/MainLayout'
import AuthLayout from '@components/layout/AuthLayout'

// Pages
import LoginPage from '@pages/LoginPage'
import DashboardPage from '@pages/DashboardPage'
import AgendaPage from '@pages/AgendaPage'
import MessagesPage from '@pages/MessagesPage'
import AppointmentDetailPage from '@pages/AppointmentDetailPage'
import ServicesPage from '@pages/ServicesPage'
import CalendarPage from '@pages/CalendarPage'
import AutomationPage from '@pages/AutomationPage'
import ReactivationPage from '@pages/ReactivationPage'
import NotFoundPage from '@pages/NotFoundPage'

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  const { token, hydrate } = useAuthStore()
  const { isDarkMode, setDarkMode } = useUIStore()

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    hydrate()

    // Set dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true'
    if (darkMode) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }, [hydrate, setDarkMode])

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Agenda - Daily Schedule */}
          <Route path="agenda" element={<AgendaPage />} />

          {/* Appointment Detail */}
          <Route path="citas/:appointmentId" element={<AppointmentDetailPage />} />

          {/* Calendar */}
          <Route path="calendario" element={<CalendarPage />} />

          {/* Messages */}
          <Route path="mensajes" element={<MessagesPage />} />

          {/* Services Catalog */}
          <Route path="servicios" element={<ServicesPage />} />

          {/* Automation Monitor */}
          <Route path="automatizacion" element={<AutomationPage />} />

          {/* Reactivation */}
          <Route path="reactivacion" element={<ReactivationPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}
