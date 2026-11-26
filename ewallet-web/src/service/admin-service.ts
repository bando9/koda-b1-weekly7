import { apiRequest } from "./auth-api"

export interface AdminUserSummaryDto {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  newUsersThisMonth: number
}

export interface AdminUserItemDto {
  id: number
  fullName: string
  userName: string
  email: string
  phoneNumber: string | null
  status: "ACTIVE" | "SUSPENDED" | string
  roles: string[]
  wallet: {
    id: number
    walletNumber: string
    balance: number
    status: string
  } | null
  createdAtUtc: string
}

export interface PagedAdminUsersDto {
  items: AdminUserItemDto[]
  page: number
  pageSize: number
  totalCount: number
}

export const adminService = {
  getUsersSummary: (accessToken: string | null) =>
    apiRequest<AdminUserSummaryDto>("/admin/users/summary", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  getUsers: (
    accessToken: string | null,
    params?: {
      search?: string
      status?: string
      page?: number
      pageSize?: number
    }
  ) => {
    const query = new URLSearchParams()
    if (params?.search?.trim()) query.set("search", params.search.trim())
    if (params?.status && params.status !== "all")
      query.set("status", params.status)
    query.set("page", String(params?.page ?? 1))
    query.set("pageSize", String(params?.pageSize ?? 10))

    return apiRequest<PagedAdminUsersDto>(`/admin/users?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },

  getUserById: (id: number) =>
    apiRequest<AdminUserItemDto>(`/admin/users/${id}`),

  updateUserStatus: (id: number, status: "ACTIVE" | "SUSPENDED") =>
    apiRequest<{ id: number; status: string }>(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
}
