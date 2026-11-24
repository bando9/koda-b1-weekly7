import type {
  AuthSessionResponse,
  AuthUserResponse,
  CurrentUserResponse,
  LoginPayload,
} from "@/service/auth-api"
import { createContext } from "react"

export type AuthStatus = "checking" | "authenticated" | "anonymous"

export interface AuthContextValue {
  status: AuthStatus
  user: AuthUserResponse | null
  accessToken: string | null
  expiresAtUtc: string | null
  isAuthenticated: boolean
  login: (credentials: LoginPayload) => Promise<AuthSessionResponse>
  refreshAccessToken: () => Promise<AuthSessionResponse>
  loadCurrentUser: () => Promise<CurrentUserResponse>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
