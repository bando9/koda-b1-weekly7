import { useEffect, useState, type FormEvent } from "react"
import { AlertCircle, Check } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { dashboardService, type WalletDto } from "@/service/dashboard-service"
import { formatRupiah, formatToRupiah } from "@/utils"
import UseAuth from "@/hooks/use-auth"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

export default function TransferPage() {
  const navigate = useNavigate()
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Pengguna"
  const initials = context?.initials ?? "U"
  const { accessToken } = UseAuth()

  const [wallet, setWallet] = useState<WalletDto | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState<boolean>(true)

  const [receiverWalletNumber, setReceiverWalletNumber] = useState<string>("")
  const [rawAmount, setRawAmount] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    dashboardService
      .getMyWallet(accessToken)
      .then((res) => {
        if (!isCancelled) setWallet(res)
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoadingWallet(false)
      })

    return () => {
      isCancelled = true
    }
  }, [accessToken])

  const availableBalance = wallet?.balance ?? 0
  const numericAmount = Number(rawAmount) || 0
  const trimmedWalletNumber = receiverWalletNumber.trim()

  const handleAmountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    setRawAmount(digitsOnly)
    if (errorMessage) setErrorMessage(null)
  }

  const handleOpenReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!trimmedWalletNumber) {
      setErrorMessage("Nomor dompet penerima wajib diisi.")
      return
    }

    if (
      wallet?.walletNumber &&
      trimmedWalletNumber.toLowerCase() === wallet.walletNumber.toLowerCase()
    ) {
      setErrorMessage("Tidak dapat melakukan transfer ke dompet sendiri.")
      return
    }

    if (numericAmount < 10000) {
      setErrorMessage("Minimal nominal transfer adalah Rp 10.000.")
      return
    }

    if (numericAmount > availableBalance) {
      setErrorMessage("Saldo tersedia tidak mencukupi untuk transaksi ini.")
      return
    }

    navigate("/dashboard/transfer/confirm", {
      state: {
        receiverWalletNumber: trimmedWalletNumber,
        amount: numericAmount,
        note: note.trim(),
        currentBalance: availableBalance,
      },
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            TRANSAKSI
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Transfer saldo
          </h1>
          <p className="text-sm text-[#64748B]">
            Kirim saldo dengan aman ke pengguna KodaWallet lain.
          </p>
        </div>

        <div className="hidden items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:flex">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#135D54] text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-[#1E293B]">
            {displayName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-8">
          <CardContent className="p-7 sm:p-9">
            <h2 className="mb-6 text-lg font-bold text-[#1E293B]">
              Detail transfer
            </h2>

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

            <form onSubmit={handleOpenReview} className="space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                  PENERIMA
                </p>

                <div className="space-y-2">
                  <Label
                    htmlFor="recipient-wallet"
                    className="text-xs font-medium text-[#64748B]"
                  >
                    Nomor dompet tujuan
                  </Label>
                  <Input
                    id="recipient-wallet"
                    type="text"
                    value={receiverWalletNumber}
                    onChange={(e) => {
                      setReceiverWalletNumber(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    placeholder="Contoh: W-123456789012"
                    className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                  />
                </div>

                {trimmedWalletNumber.length >= 4 && (
                  <div className="flex items-center justify-between rounded-2xl bg-[#EDF5F3] px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-[#135D54] text-sm font-semibold text-white">
                          KW
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-[#1E293B]">
                          {trimmedWalletNumber}
                        </p>
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          Dompet KodaWallet tujuan
                        </p>
                      </div>
                    </div>

                    <Check className="h-5 w-5 text-[#135D54]" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="transfer-amount"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Nominal transfer
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-[#1E293B]">
                    Rp
                  </span>
                  <Input
                    id="transfer-amount"
                    type="text"
                    inputMode="numeric"
                    value={rawAmount ? formatRupiah(numericAmount) : ""}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="h-11 rounded-xl border-transparent bg-transparent pl-9 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Minimal transfer Rp 10.000
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="transfer-note"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Catatan (opsional)
                </Label>
                <Input
                  id="transfer-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tulis catatan untuk penerima"
                  className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoadingWallet}
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  Tinjau transfer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="p-7 sm:p-8">
            <h2 className="mb-6 text-lg font-bold text-[#1E293B]">
              Dompet saya
            </h2>

            <div className="border-b border-slate-100 pb-6">
              <p className="mb-2 text-xs text-[#64748B]">Saldo tersedia</p>
              {isLoadingWallet ? (
                <div className="h-9 w-40 animate-pulse rounded-lg bg-slate-100" />
              ) : (
                <p className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                  {formatToRupiah(availableBalance)}
                </p>
              )}
            </div>

            <p className="pt-5 text-xs leading-relaxed text-[#64748B]">
              Pastikan nomor dompet penerima dan nominal sudah benar sebelum
              melanjutkan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
