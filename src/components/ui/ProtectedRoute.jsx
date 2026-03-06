import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from './Skeleton'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location          = useLocation()

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <Skeleton height="40px" width="200px" />
        <br />
        <Skeleton height="200px" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return <Outlet />
}
