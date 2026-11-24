// src/services/topUpService.ts
import { apiFetch } from "@/lib/api"

export interface TopUpResponseDto {
  topUpRequestId: number
  transactionId: number
  referenceNo: string
  walletId: number
  paymentMethodCode: string
  amount: number
  status: string
  transactionStatus: string
  providerReference: string | null
  createdAtUtc: string
  expiresAtUtc: string | null
  paidAtUtc: string | null
}

export interface CreateTopUpPayload {
  paymentMethodId: number
  amount: number
}

export const topUpService = {
  createTopUp: (payload: CreateTopUpPayload) =>
    apiFetch<TopUpResponseDto>("/topups", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTopUpById: (id: number) => apiFetch<TopUpResponseDto>(`/topups/${id}`),

  confirmTopUp: (id: number) =>
    apiFetch<TopUpResponseDto>(`/topups/${id}/confirm`, {
      method: "POST",
    }),
}
