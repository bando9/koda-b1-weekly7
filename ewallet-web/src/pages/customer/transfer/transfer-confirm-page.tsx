import { useState } from "react"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Link, Navigate, useLocation, useNavigate } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { transferService } from "@/service/transfer-service"
import { formatToRupiah } from "@/utils"
import UseAuth from "@/hooks/use-auth"

interface TransferConfirmState {
  receiverWalletNumber?: string
  amount?: number
  note?: string
  currentBalance?: number
}

export default function TransferConfirmPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { accessToken } = UseAuth()

  const state = (location.state as TransferConfirmState | null) ?? {}
  const receiverWalletNumber = state.receiverWalletNumber
  const amount = state.amount ?? 0
  const note = state.note ?? ""
  const currentBalance = state.currentBalance ?? 0

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!receiverWalletNumber || amount <= 0) {
    return <Navigate to="/dashboard/transfer" replace />
  }

  const remainingBalance = currentBalance - amount

  const handleConfirmTransfer = async () => {
    setErrorMessage(null)

    if (remainingBalance < 0) {
      setErrorMessage("Saldo tidak mencukupi untuk melanjutkan transfer.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await transferService.createTransfer(
        {
          receiverWalletNumber,
          amount,
          description: note.trim() ? note.trim() : undefined,
        },
        accessToken
      )

      navigate("/dashboard/transfer/success", {
        replace: true,
        state: {
          recipientName: result.receiverWalletNumber,
          amount: result.amount,
          note: result.description ?? note,
          referenceNumber: result.referenceNo,
          remainingBalance: result.senderBalanceAfter,
        },
      })
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Gagal memproses transfer. Silakan coba lagi."
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
              to="/dashboard/transfer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#135D54] transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke transfer</span>
            </Link>
          </div>

          <Card className="rounded-3xl border-0 bg-[#F7F9F8] shadow-none">
            <CardContent className="p-8 sm:p-11">
              <div className="mb-8">
                <h1 className="mb-1.5 text-[28px] font-bold tracking-tight text-[#1E293B]">
                  Konfirmasi transfer
                </h1>
                <p className="text-xs text-[#64748B]">
                  Periksa kembali detail sebelum mengirim.
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
                    Dompet penerima
                  </span>
                  <span className="col-span-7 text-sm font-bold text-[#1E293B]">
                    {receiverWalletNumber}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Nominal
                  </span>
                  <span className="col-span-7 text-sm font-bold text-[#1E293B]">
                    {formatToRupiah(amount)}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-xs text-[#64748B]">
                    Catatan
                  </span>
                  <span className="col-span-7 text-xs font-medium text-[#1E293B]">
                    {note.trim() ? note : "-"}
                  </span>
                </div>
              </div>

              <hr className="my-7 border-t border-slate-200/80" />

              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-5 text-xs text-[#64748B]">
                  Sisa saldo setelah transfer
                </span>
                <span className="col-span-7 text-lg font-bold tracking-tight text-[#1E293B]">
                  {formatToRupiah(remainingBalance)}
                </span>
              </div>

              <div className="mt-9">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmTransfer}
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengirim saldo...</span>
                    </span>
                  ) : (
                    "Konfirmasi transfer"
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
