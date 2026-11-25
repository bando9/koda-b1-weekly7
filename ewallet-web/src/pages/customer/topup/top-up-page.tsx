import { useEffect, useState, type FormEvent } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { dashboardService, type WalletDto } from "@/service/dashboard-service"
import { topUpService, type PaymentMethodDto } from "@/service/topup-service"
import { formatRupiah, formatToRupiah } from "@/utils"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

export default function TopUpPage() {
  const navigate = useNavigate()
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Pengguna"
  const initials = context?.initials ?? "U"

  const [wallet, setWallet] = useState<WalletDto | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([])
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null)

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [rawAmount, setRawAmount] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadInitialData() {
      try {
        const [walletRes, methodsRes] = await Promise.all([
          dashboardService.getMyWallet(),
          topUpService.getPaymentMethods(),
        ])

        if (!isCancelled) {
          setWallet(walletRes)

          const activeMethods = Array.isArray(methodsRes)
            ? methodsRes.filter((m) => m.isActive !== false)
            : []

          setPaymentMethods(activeMethods)

          if (activeMethods.length > 0) {
            setSelectedMethodId(activeMethods[0].id)
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Gagal memuat data wallet dan metode pembayaran."
          )
        }
      } finally {
        if (!isCancelled) {
          setIsInitialLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      isCancelled = true
    }
  }, [])

  const currentBalance = wallet?.balance ?? 0
  const isWalletActive = wallet?.status === "ACTIVE"
  const numericAmount = Number(rawAmount) || 0

  const handleAmountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    setRawAmount(digitsOnly)
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (numericAmount < 10000) {
      setErrorMessage("Minimal nominal isi saldo adalah Rp 10.000.")
      return
    }

    const chosenMethod = paymentMethods.find((m) => m.id === selectedMethodId)
    if (!chosenMethod) {
      setErrorMessage("Silakan pilih metode pembayaran terlebih dahulu.")
      return
    }

    try {
      setIsSubmitting(true)

      const createdTopUp = await topUpService.createTopUp({
        paymentMethodId: chosenMethod.id,
        amount: numericAmount,
      })

      if (chosenMethod.code.toUpperCase() === "QRIS") {
        navigate("/dashboard/top-up/qris", {
          state: {
            topUpRequestId: createdTopUp.topUpRequestId,
            referenceNo: createdTopUp.referenceNo,
            providerReference: createdTopUp.providerReference,
            amount: createdTopUp.amount,
            currentBalance,
          },
        })
        return
      }

      navigate("/dashboard/top-up/confirm", {
        state: {
          topUpRequestId: createdTopUp.topUpRequestId,
          referenceNo: createdTopUp.referenceNo,
          providerReference: createdTopUp.providerReference,
          recipientName: displayName,
          amount: createdTopUp.amount,
          paymentMethod: chosenMethod.name,
          currentBalance,
        },
      })
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Gagal membuat permintaan isi saldo."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            TRANSAKSI
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Isi saldo
          </h1>
          <p className="text-sm text-[#64748B]">
            Pilih nominal dan metode pembayaran yang tersedia.
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
            <div className="mb-7">
              <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                Buat permintaan isi saldo
              </h2>
              <p className="text-xs text-[#64748B]">
                Saldo baru bertambah setelah pembayaran dikonfirmasi.
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

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2.5">
                <Label
                  htmlFor="topup-amount"
                  className="text-xs font-semibold text-[#64748B]"
                >
                  Nominal isi saldo
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-[#1E293B]">
                    Rp
                  </span>
                  <Input
                    id="topup-amount"
                    type="text"
                    inputMode="numeric"
                    disabled={isSubmitting}
                    value={rawAmount ? formatRupiah(numericAmount) : ""}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="h-11 rounded-xl border-transparent bg-transparent pl-9 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="block text-xs font-semibold text-[#64748B]">
                  Metode pembayaran
                </Label>

                {isInitialLoading ? (
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-20 animate-pulse rounded-2xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <p className="text-xs text-[#64748B]">
                    Belum ada metode pembayaran yang tersedia.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedMethodId === method.id
                      return (
                        <button
                          key={method.id}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setSelectedMethodId(method.id)}
                          className={cn(
                            "cursor-pointer rounded-2xl p-5 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#135D54] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
                            isSelected
                              ? "bg-[#EDF5F3]"
                              : "bg-transparent hover:bg-slate-50"
                          )}
                        >
                          <p className="text-sm font-bold text-[#1E293B]">
                            {method.name}
                          </p>
                          <p className="mt-1 text-xs text-[#64748B]">
                            {method.provider
                              ? `${method.provider} · Simulasi`
                              : "Pembayaran simulasi"}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isInitialLoading ||
                    paymentMethods.length === 0
                  }
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Membuat permintaan...</span>
                    </span>
                  ) : (
                    "Lanjutkan pembayaran"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="p-7 sm:p-8">
            <h2 className="mb-6 text-lg font-bold text-[#1E293B]">
              Ringkasan akun
            </h2>

            <div className="border-b border-slate-100 pb-6">
              <p className="mb-2 text-xs text-[#64748B]">Saldo saat ini</p>
              {isInitialLoading ? (
                <div className="h-9 w-40 animate-pulse rounded-lg bg-slate-100" />
              ) : (
                <p className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                  {formatToRupiah(currentBalance)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-5">
              <span className="text-xs text-[#64748B]">Status dompet</span>
              <Badge className="rounded-full bg-[#E6F4EE] px-3 py-1 text-[10px] font-bold tracking-wider text-[#135D54] uppercase shadow-none hover:bg-[#E6F4EE]">
                {isInitialLoading
                  ? "MEMUAT"
                  : isWalletActive
                    ? "AKTIF"
                    : (wallet?.status ?? "NONAKTIF")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
