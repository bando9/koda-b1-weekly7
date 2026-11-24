import { Check } from "lucide-react"
import { Link, Navigate, useLocation } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatToRupiah } from "@/utils"

interface TransferSuccessState {
  recipientName?: string
  amount?: number
  referenceNumber?: string
  remainingBalance?: number
}

export default function TransferSuccessPage() {
  const location = useLocation()

  const state = (location.state as TransferSuccessState | null) ?? {}

  if (!state.referenceNumber || !state.amount) {
    return <Navigate to="/dashboard/transfer" replace />
  }

  const recipientName = state.recipientName ?? "-"
  const amount = state.amount
  const referenceNumber = state.referenceNumber

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased">
      <header className="px-8 py-7 sm:px-12 sm:py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-xl font-bold tracking-tight text-[#1E293B]"
        >
          koda <span className="ml-1 font-semibold text-[#135D54]">wallet</span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-16">
        <Card className="w-full max-w-140 rounded-3xl border-0 bg-[#F7F9F8] shadow-none">
          <CardContent className="flex flex-col items-center px-8 py-12 text-center sm:px-12 sm:py-14">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#E9F1EE]">
              <Check className="h-10 w-10 stroke-[3.2] text-[#135D54]" />
            </div>

            <h1 className="mb-2 text-[28px] font-bold tracking-tight text-[#1E293B]">
              Transfer berhasil
            </h1>
            <p className="text-sm text-[#64748B]">
              {formatToRupiah(amount)} berhasil dikirim ke {recipientName}.
            </p>

            <div className="mt-7 text-xs text-[#64748B]">
              <p>
                No. referensi &nbsp;
                <span className="font-medium text-[#475569]">
                  {referenceNumber}
                </span>
              </p>
            </div>

            <div className="mt-10 w-full max-w-md space-y-5">
              <Button
                nativeButton={false}
                className="h-12 w-full justify-start rounded-xl bg-[#135D54] px-5 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44]"
                render={
                  <Link to="/dashboard/activities">
                    Lihat riwayat transaksi
                  </Link>
                }
              />

              <div>
                <Link
                  to="/dashboard"
                  className="inline-block text-xs font-semibold text-[#135D54] hover:underline"
                >
                  Kembali ke beranda
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
