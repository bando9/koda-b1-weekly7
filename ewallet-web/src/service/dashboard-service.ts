import { apiFetch } from "@/lib/api"

export interface UserProfileDto {
  id: number
  fullName: string
  userName: string
  email: string
  phoneNumber: string
  status: string
  roles: string[]
}

export interface WalletDto {
  id: number
  walletNumber: string
  balance: number
  status: "ACTIVE" | "SUSPENDED" | "FROZEN" | string
  createdAtUtc: string
  updatedAtUtc: string | null
}

export interface TransactionDto {
  id: number
  referenceNo: string
  type: "TOPUP" | "TRANSFER" | string
  status: "SUCCESS" | "PENDING" | "FAILED" | "REJECTED" | string
  direction: "IN" | "OUT"
  amount: number
  description: string | null
  createdAtUtc: string
  completedAtUtc: string | null
}

export interface PagedTransactionsDto {
  items: TransactionDto[]
  page: number
  pageSize: number
  totalCount: number
}

export interface TransactionFilterParams {
  search?: string
  type?: string
  status?: string
  days?: number
  page?: number
  pageSize?: number
}

export const dashboardService = {
  getProfile: () => apiFetch<UserProfileDto>("/profile"),
  getMyWallet: () => apiFetch<WalletDto>("/wallets/me"),
  getRecentTransactions: (page = 1, pageSize = 5) =>
    apiFetch<PagedTransactionsDto>(
      `/wallets/me/transactions?page=${page}&pageSize=${pageSize}`
    ),

  getTransactions: (params: TransactionFilterParams) => {
    const query = new URLSearchParams()
    if (params.search?.trim()) query.set("search", params.search.trim())
    if (params.type && params.type !== "all") query.set("type", params.type)
    if (params.status && params.status !== "all")
      query.set("status", params.status)
    if (params.days && params.days > 0) query.set("days", String(params.days))
    query.set("page", String(params.page ?? 1))
    query.set("pageSize", String(params.pageSize ?? 4))

    return apiFetch<PagedTransactionsDto>(
      `/wallets/me/transactions?${query.toString()}`
    )
  },
}
