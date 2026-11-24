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

export const dashboardService = {
  getProfile: () => apiFetch<UserProfileDto>("/profile"),
  getMyWallet: () => apiFetch<WalletDto>("/wallets/me"),
  getRecentTransactions: (page = 1, pageSize = 5) =>
    apiFetch<PagedTransactionsDto>(
      `/wallets/me/transactions?page=${page}&pageSize=${pageSize}`
    ),
}
