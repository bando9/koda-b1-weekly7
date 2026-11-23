import SessionChecking from "@/components/shared/session-checking"
import UseAuth from "@/hooks/use-auth"
import { resolveDestination } from "@/lib/auth-route"
import { Navigate, useLocation } from "react-router"

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { status, isAuthenticated, user } = UseAuth()
  const location = useLocation()

  if (status === "checking") <SessionChecking />

  if (isAuthenticated && user) {
    const from = (location.state as { from?: { pathname: string } } | null)
      ?.from?.pathname
    return <Navigate to={resolveDestination(user.role, from)} replace />
  }

  return children
}
