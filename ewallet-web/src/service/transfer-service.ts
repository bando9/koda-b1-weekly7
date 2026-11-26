import { apiRequest } from "./auth-api"

export interface CreateTransferPayload {
  receiverWalletNumber: string
  amount: number
  description?: string
}

export interface TransferResponseDto {
  transactionId: number
  referenceNo: string
  senderWalletId: number
  receiverWalletId: number
  receiverWalletNumber: string
  amount: number
  status: string
  description: string | null
  senderBalanceAfter: number
  completedAtUtc: string
}

export const transferService = {
  createTransfer: (
    payload: CreateTransferPayload,
    accessToken: string | null
  ) =>
    apiRequest<TransferResponseDto>("/transfers", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
}
