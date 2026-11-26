import { useState } from "react"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Link, Navigate, useLocation, useNavigate } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dashboardService } from "@/service/dashboard-service"
import { topUpService } from "@/service/topup-service"
import { formatToRupiah } from "@/utils"
import UseAuth from "@/hooks/use-auth"

interface TopUpQrisState {
  topUpRequestId?: number
  referenceNo?: string
  providerReference?: string | null
  amount?: number
  currentBalance?: number
}

export default function TopUpQrisPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { accessToken } = UseAuth()

  const state = (location.state as TopUpQrisState | null) ?? {}
  const topUpRequestId = state.topUpRequestId
  const amount = state.amount ?? 0
  const currentBalance = state.currentBalance ?? 0
  const adminFee = 0

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!topUpRequestId) {
    return <Navigate to="/dashboard/top-up" replace />
  }

  const balanceAfterPayment = currentBalance + amount

  const handleSimulateQrisPayment = async () => {
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
          : "Gagal memverifikasi pembayaran QRIS. Silakan coba lagi."
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
              <span>Ubah metode pembayaran</span>
            </Link>
          </div>

          <Card className="rounded-3xl border-0 bg-[#F7F9F8] shadow-none">
            <CardContent className="p-8 sm:p-11">
              <div className="mb-7">
                <h1 className="mb-1.5 text-[28px] font-bold tracking-tight text-[#1E293B]">
                  Pembayaran QRIS
                </h1>
                <p className="text-xs text-[#64748B]">
                  Pindai kode QR melalui aplikasi pembayaranmu.
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

              <div className="my-6 flex flex-col items-center">
                <div className="flex h-52 w-52 items-center justify-center rounded-2xl bg-white p-4">
                  <svg
                    viewBox="0 0 120 120"
                    className="h-full w-full text-[#15221E]"
                    fill="currentColor"
                    aria-label="Kode QR Demo"
                  >
                    <path d="M8 8h32v32H8V8zm6 6v20h20V14H14zm5 5h10v10H19V19z" />
                    <path d="M80 8h32v32H80V8zm6 6v20h20V14H86zm5 5h10v10H91V19z" />
                    <path d="M8 80h32v32H8V80zm6 6v20h20V86H14zm5 5h10v10H19V91z" />

                    <rect x="46" y="8" width="6" height="12" />
                    <rect x="58" y="14" width="12" height="6" />
                    <rect x="46" y="26" width="12" height="6" />
                    <rect x="64" y="26" width="6" height="14" />

                    <rect x="8" y="46" width="14" height="6" />
                    <rect x="28" y="46" width="6" height="12" />
                    <rect x="14" y="58" width="12" height="6" />
                    <rect x="8" y="68" width="18" height="6" />

                    <rect x="42" y="42" width="10" height="10" />
                    <rect x="58" y="46" width="14" height="6" />
                    <rect x="46" y="58" width="6" height="16" />
                    <rect x="58" y="58" width="12" height="12" />
                    <rect x="76" y="46" width="12" height="6" />
                    <rect x="94" y="46" width="18" height="6" />
                    <rect x="82" y="58" width="6" height="14" />
                    <rect x="94" y="64" width="12" height="6" />

                    <rect x="46" y="80" width="12" height="6" />
                    <rect x="64" y="80" width="6" height="12" />
                    <rect x="46" y="92" width="6" height="20" />
                    <rect x="58" y="98" width="14" height="6" />
                    <rect x="76" y="80" width="14" height="14" />
                    <rect x="96" y="80" width="16" height="6" />
                    <rect x="96" y="92" width="6" height="20" />
                    <rect x="78" y="102" width="12" height="10" />
                    <rect x="106" y="96" width="6" height="16" />
                  </svg>
                </div>
                <p className="mt-3 text-[11px] text-[#64748B]">
                  Kode demo, bukan untuk pembayaran nyata.
                </p>
              </div>

              <div className="mt-6 space-y-4 text-sm">
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
                    Nominal isi saldo
                  </span>
                  <span className="col-span-7 text-sm font-bold text-[#1E293B]">
                    {formatToRupiah(amount)}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Metode pembayaran
                  </span>
                  <span className="col-span-7 text-sm font-bold text-[#1E293B]">
                    QRIS Instant
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Biaya admin
                  </span>
                  <span className="col-span-7 text-xs font-medium text-[#1E293B]">
                    {formatToRupiah(adminFee)}
                  </span>
                </div>
              </div>

              <hr className="my-6 border-t border-slate-200/80" />

              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-5 text-xs text-[#64748B]">
                  Saldo setelah pembayaran
                </span>
                <span className="col-span-7 text-lg font-bold tracking-tight text-[#1E293B]">
                  {formatToRupiah(balanceAfterPayment)}
                </span>
              </div>

              <div className="mt-8">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSimulateQrisPayment}
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memverifikasi QRIS...</span>
                    </span>
                  ) : (
                    "Simulasikan pembayaran QRIS"
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
