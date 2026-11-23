import type { UserRole } from "@/service/auth-api"

export const getHomePath = (role: UserRole) =>
  role === "ADMIN" ? "/admin" : "/dashboard"

export function resolveDestination(role: UserRole, from?: string) {
  const home = getHomePath(role)
  return from && (from === home || from.startsWith(`${home}/`)) ? from : home
}
