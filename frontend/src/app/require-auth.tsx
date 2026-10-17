import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/features/users/api/use-users'
import type { Role } from '@/features/users/types'

type RequireAuthProps = {
  children: ReactNode
  /** Only users with this role may see the page; others go to the home page */
  role?: Role
}

// Guards a route: signed-out users go to /sign-in and come back here afterwards.
export function RequireAuth({ children, role }: RequireAuthProps) {
  const { data: user, isLoading } = useCurrentUser()
  const location = useLocation()

  if (isLoading) return <Skeleton className="h-64" />
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/sign-in?redirect=${redirect}`} replace />
  }
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}
