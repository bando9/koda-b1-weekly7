const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

const TOKEN_STORAGE_KEY = "ewallet_access_token"

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })

    if (!res.ok) {
      tokenStorage.clear()
      return null
    }

    const data = await res.json()
    if (data?.accessToken) {
      tokenStorage.set(data.accessToken)
      return data.accessToken
    }
    return null
  } catch {
    tokenStorage.clear()
    return null
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get()

  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`)
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      })
    } else {
      window.location.href = "/login"
      throw new Error("Sesi berakhir. Silakan login kembali.")
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const identityErrors = Array.isArray(errorBody?.errors)
      ? errorBody.errors.join(" ")
      : null
    throw new Error(
      identityErrors ??
        errorBody?.message ??
        errorBody?.detail ??
        "Terjadi kesalahan pada server."
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
