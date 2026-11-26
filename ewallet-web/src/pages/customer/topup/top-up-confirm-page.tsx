import { useState } from "react"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Link, Navigate, useLocation, useNavigate } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dashboardService } from "@/service/dashboard-service"
import { topUpService } from "@/service/topup-service"
import UseAuth from "@/hooks/use-auth"

interface TopUpConfirmState {
  topUpRequestId?: number
  referenceNo?: string
  providerReference?: string | null
  recipientName?: string
  amount?: number
  paymentMethod?: string
  currentBalance?: number
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount)
}

export default function TopUpConfirmPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { accessToken } = UseAuth()

  const state = (location.state as TopUpConfirmState | null) ?? {}
  const topUpRequestId = state.topUpRequestId
  const recipientName = state.recipientName ?? "Pengguna"
  const amount = state.amount ?? 0
  const paymentMethod = state.paymentMethod ?? "Mandiri Virtual Account"
  const currentBalance = state.currentBalance ?? 0

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!topUpRequestId) {
    return <Navigate to="/dashboard/top-up" replace />
  }

  const balanceAfterPayment = currentBalance + amount

  const handleSimulatePayment = async () => {
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const confirmed = await topUpService.confirmTopUp(
        topUpRequestId,
        accessToken
      )

      const updatedWallet = await dashboardService
        .getMyWallet(accessToken)
        .catch(() => null)

      navigate("/dashboard/top-up/success", {
        replace: true,
        state: {
          amount: confirmed.amount,
          referenceNumber: confirmed.referenceNo,
          newBalance: updatedWallet?.balance ?? balanceAfterPayment,
        },
      })
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Gagal mensimulasikan pembayaran. Silakan coba lagi."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <div className="w-full max-w-140">
          <div className="mb-5">
            <Link
              to="/dashboard/top-up"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#135D54] transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke isi saldo</span>
            </Link>
          </div>

          <Card className="rounded-3xl border-0 bg-[#F7F9F8] shadow-none">
            <CardContent className="p-8 sm:p-11">
              <div className="mb-8">
                <h1 className="mb-1.5 text-[28px] font-bold tracking-tight text-[#1E293B]">
                  Konfirmasi isi saldo
                </h1>
                <p className="text-xs text-[#64748B]">
                  Periksa detail sebelum simulasi pembayaran.
                </p>
              </div>

              {errorMessage && (
                <Alert
                  variant="destructive"
                  className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-700"
                >
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-xs font-medium">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    No. Referensi
                  </span>
                  <span className="col-span-7 text-xs font-semibold text-[#1E293B]">
                    {state.referenceNo ?? "-"}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Dompet tujuan
                  </span>
                  <span className="col-span-7 text-sm font-bold text-[#1E293B]">
                    {recipientName}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Nominal isi saldo
                  </span>
                  <span className="col-span-7 text-sm font-bold text-[#1E293B]">
                    Rp {formatRupiah(amount)}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Metode pembayaran
                  </span>
                  <span className="col-span-7 text-xs font-medium text-[#1E293B]">
                    {paymentMethod}
                  </span>
                </div>
              </div>

              <hr className="my-7 border-t border-slate-200/80" />

              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-5 text-xs text-[#64748B]">
                  Saldo setelah pembayaran
                </span>
                <span className="col-span-7 text-lg font-bold tracking-tight text-[#1E293B]">
                  Rp {formatRupiah(balanceAfterPayment)}
                </span>
              </div>

              <div className="mt-9">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSimulatePayment}
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses pembayaran...</span>
                    </span>
                  ) : (
                    "Simulasikan pembayaran"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
