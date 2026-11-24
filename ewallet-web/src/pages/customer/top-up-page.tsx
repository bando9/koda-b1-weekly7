import { useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useOutletContext } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { formatToRupiah } from "@/utils"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

type PaymentMethodId = "bank_transfer" | "qris"

interface PaymentMethodOption {
  id: PaymentMethodId
  title: string
  description: string
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "bank_transfer",
    title: "Transfer bank",
    description: "Pembayaran simulasi",
  },
  {
    id: "qris",
    title: "QRIS",
    description: "Pembayaran simulasi",
  },
]

export default function TopUpPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Nadia"
  const initials = context?.initials ?? "NP"

  const [currentBalance, setCurrentBalance] = useState<number>(1250000)

  const [rawAmount, setRawAmount] = useState<string>("250000")
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodId>("bank_transfer")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const numericAmount = Number(rawAmount) || 0

  const handleAmountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    setRawAmount(digitsOnly)
    if (errorMessage) setErrorMessage(null)
    if (successMessage) setSuccessMessage(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (numericAmount < 10000) {
      setErrorMessage("Minimal nominal isi saldo adalah Rp 10.000.")
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const methodLabel =
        PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.title ?? ""

      setCurrentBalance((prev) => prev + numericAmount)
      setSuccessMessage(
        `Permintaan isi saldo sebesar ${formatToRupiah(numericAmount)} via ${methodLabel} berhasil dikonfirmasi.`
      )
    } catch {
      setErrorMessage(
        "Gagal memproses permintaan isi saldo. Silakan coba lagi."
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

            {successMessage && (
              <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs font-medium">
                  {successMessage}
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
                    value={rawAmount ? formatToRupiah(numericAmount) : ""}
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
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id
                    return (
                      <button
                        key={method.id}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          setSelectedMethod(method.id)
                          if (successMessage) setSuccessMessage(null)
                        }}
                        className={cn(
                          "cursor-pointer rounded-2xl p-5 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#135D54] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
                          isSelected
                            ? "bg-[#EDF5F3]"
                            : "bg-transparent hover:bg-slate-50"
                        )}
                      >
                        <p className="text-sm font-bold text-[#1E293B]">
                          {method.title}
                        </p>
                        <p className="mt-1 text-xs text-[#64748B]">
                          {method.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses pembayaran...</span>
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
              <p className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                {formatToRupiah(currentBalance)}
              </p>
            </div>

            <div className="flex items-center justify-between pt-5">
              <span className="text-xs text-[#64748B]">Status dompet</span>
              <Badge className="rounded-full bg-[#E6F4EE] px-3 py-1 text-[10px] font-bold tracking-wider text-[#135D54] uppercase shadow-none hover:bg-[#E6F4EE]">
                AKTIF
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
