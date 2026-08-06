import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isStaff, useAuthStore } from '@/store/auth'

export const RequireAuth = ({
  children,
  staffOnly = false,
  adminOnly = false,
}: {
  children: ReactNode
  staffOnly?: boolean
  adminOnly?: boolean
}) => {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/admin" replace />
  if (staffOnly && !isStaff(user.role)) return <Navigate to="/account" replace />

  return <>{children}</>
}
