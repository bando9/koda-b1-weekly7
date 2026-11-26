import { apiRequest } from "./auth-api"

export interface PaymentMethodDto {
  id: number
  code: string
  name: string
  provider?: string | null
  isActive: boolean
}

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
  getPaymentMethods: () => apiRequest<PaymentMethodDto[]>("/payment-methods"),

  createTopUp: (payload: CreateTopUpPayload, accessToken: string | null) =>
    apiRequest<TopUpResponseDto>("/topups", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  getTopUpById: (id: number, accessToken: string | null) =>
    apiRequest<TopUpResponseDto>(`/topups/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  confirmTopUp: (id: number, accessToken: string | null) =>
    apiRequest<TopUpResponseDto>(`/topups/${id}/confirm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
}
