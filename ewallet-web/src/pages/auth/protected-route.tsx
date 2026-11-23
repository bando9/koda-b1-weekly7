import SessionChecking from "@/components/shared/session-checking"
import UseAuth from "@/hooks/use-auth"
import type { UserRole } from "@/service/auth-api"
import { Navigate, useLocation } from "react-router"

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}) {
  const { status, isAuthenticated, user } = UseAuth()

  const location = useLocation()

  if (status === "checking") <SessionChecking />

  if (!isAuthenticated || !user)
    return <Navigate to="/login" replace state={{ from: location }} />

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/forbidden" replace />

  return children
}
