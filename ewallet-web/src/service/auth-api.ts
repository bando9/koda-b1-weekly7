const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

export type UserRole = "ADMIN" | "CUSTOMER"

export interface AuthUserResponse {
  id: number
  fullName: string
  userName: string
  email: string
  phoneNumber: string
  role: UserRole
  walletId: number
  balance: number
}

export interface AuthSessionResponse {
  message?: string
  user: AuthUserResponse
  accessToken: string
  tokenType: string
  expiresAtUtc: string
}

export interface CurrentUserResponse {
  id: number
  email: string
  roles: UserRole[]
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  userName: string
  email: string
  phoneNumber: string
  password: string
}

interface ProblemDetailsResponse {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  credentials?: RequestCredentials
  headers?: Record<string, string>
  body?: BodyInit | null
}

export class ApiError extends Error {
  public readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export async function apiRequest<TResponse>(
  path: string,
  {
    method = "GET",
    credentials = "omit",
    headers,
    body,
  }: ApiRequestOptions = {}
): Promise<TResponse> {
  if (!API_BASE_URL) {
    throw new ApiError(0, "VITE_API_BASE_URL belum dikonfigurasi.")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials,
    headers: { Accept: "application/json", ...headers },
    body,
  }).catch(() => {
    throw new ApiError(
      0,
      "Tidak dapat menghubungi API. Periksa server, jaringan, dan CORS."
    )
  })

  const isJson = response.headers.get("content-type")?.includes("json")
  const data = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const problem = data as ProblemDetailsResponse | null
    const firstValidationErr = Object.values(problem?.errors ?? {}).flat()[0]

    const message =
      response.status === 429
        ? "Terlalu banyak request. Silakan coba kembali nanti."
        : response.status >= 500
          ? "Server sedang mengalami gangguan."
          : (firstValidationErr ??
            problem?.detail ??
            problem?.title ??
            "Request gagal.")

    throw new ApiError(response.status, message)
  }

  return data as TResponse
}

const validateSession = (data: unknown): AuthSessionResponse => {
  const session = data as Partial<AuthSessionResponse> | null

  if (
    !session?.accessToken ||
    !session?.expiresAtUtc ||
    !session?.user?.id ||
    !session?.user?.email
  ) {
    throw new Error("Format response authentication tidak sesuai.")
  }

  return session as AuthSessionResponse
}

export const loginUser = async ({
  identifier,
  password,
}: LoginPayload): Promise<AuthSessionResponse> => {
  const data = await apiRequest<unknown>("/api/v1/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: identifier.trim(), password }),
  })

  return validateSession(data)
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthUserResponse> => {
  return apiRequest<AuthUserResponse>("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      fullName: payload.fullName.trim(),
      userName: payload.userName.trim(),
      email: payload.email.trim(),
      phoneNumber: payload.phoneNumber.trim(),
    }),
  })
}

let refreshInFlight: Promise<AuthSessionResponse> | null = null

export const refreshSession = (): Promise<AuthSessionResponse> => {
  refreshInFlight ??= apiRequest<unknown>("/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
  })
    .then(validateSession)
    .finally(() => {
      refreshInFlight = null
    })

  return refreshInFlight
}

export const getCurrentUser = async (
  accessToken: string | null
): Promise<CurrentUserResponse> => {
  if (!accessToken) {
    throw new ApiError(401, "Access Token tidak tersedia.")
  }

  return apiRequest<CurrentUserResponse>("/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const logoutUser = async (): Promise<void> => {
  await apiRequest<unknown>("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  })
}
