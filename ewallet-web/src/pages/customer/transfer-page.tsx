import { useMemo, useState, type FormEvent } from "react"
import { AlertCircle, Check, CheckCircle2, Loader2 } from "lucide-react"
import { useOutletContext } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatRupiah, formatToRupiah } from "@/utils"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

interface RecipientUser {
  id: string
  name: string
  username: string
  walletNumber: string
  initials: string
}

// Data contoh pengguna untuk pencarian penerima
const MOCK_RECIPIENTS: RecipientUser[] = [
  {
    id: "usr-1",
    name: "Bima Pratama",
    username: "bima",
    walletNumber: "KW •••• 2941",
    initials: "BP",
  },
  {
    id: "usr-2",
    name: "Rina Wulandari",
    username: "rina",
    walletNumber: "KW •••• 5108",
    initials: "RW",
  },
]

export default function TransferPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Nadia"
  const initials = context?.initials ?? "NP"

  // State simulasi saldo tersedia
  const [availableBalance, setAvailableBalance] = useState<number>(1250000)

  // State form transfer (default disesuaikan dengan gambar)
  const [recipientQuery, setRecipientQuery] = useState<string>("bima")
  const [rawAmount, setRawAmount] = useState<string>("75000")
  const [note, setNote] = useState<string>("Bayar makan siang")

  // State UI & modal tinjauan
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const numericAmount = Number(rawAmount) || 0

  // Cari penerima berdasarkan username atau nomor dompet
  const matchedRecipient = useMemo(() => {
    const query = recipientQuery.trim().toLowerCase().replace(/^@/, "")
    if (!query) return null

    return (
      MOCK_RECIPIENTS.find(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.walletNumber.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query)
      ) ?? null
    )
  }, [recipientQuery])

  const handleAmountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    setRawAmount(digitsOnly)
    if (errorMessage) setErrorMessage(null)
    if (successMessage) setSuccessMessage(null)
  }

  const handleOpenReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!matchedRecipient) {
      setErrorMessage(
        "Penerima tidak ditemukan. Periksa username atau nomor dompet."
      )
      return
    }

    if (numericAmount < 1000) {
      setErrorMessage("Minimal nominal transfer adalah Rp 1.000.")
      return
    }

    if (numericAmount > availableBalance) {
      setErrorMessage("Saldo tersedia tidak mencukupi untuk transaksi ini.")
      return
    }

    setIsReviewOpen(true)
  }

  const handleConfirmTransfer = async () => {
    if (!matchedRecipient) return

    setIsSubmitting(true)
    try {
      // Simulasi API transfer
      await new Promise((resolve) => setTimeout(resolve, 600))

      setAvailableBalance((prev) => prev - numericAmount)
      setSuccessMessage(
        `Transfer sebesar ${formatToRupiah(numericAmount)} ke ${matchedRecipient.name} berhasil dikirim.`
      )
      setIsReviewOpen(false)
    } catch {
      setErrorMessage("Gagal memproses transfer. Silakan coba lagi.")
      setIsReviewOpen(false)
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

            {successMessage && (
              <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs font-medium">
                  {successMessage}
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
                    htmlFor="recipient-search"
                    className="text-xs font-medium text-[#64748B]"
                  >
                    Cari username / nomor dompet
                  </Label>
                  <Input
                    id="recipient-search"
                    type="text"
                    value={recipientQuery}
                    onChange={(e) => {
                      setRecipientQuery(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                      if (successMessage) setSuccessMessage(null)
                    }}
                    placeholder="Masukkan username atau nomor dompet"
                    className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                  />
                </div>

                {matchedRecipient && (
                  <div className="flex items-center justify-between rounded-2xl bg-[#EDF5F3] px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-[#135D54] text-sm font-semibold text-white">
                          {matchedRecipient.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-[#1E293B]">
                          {matchedRecipient.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          @{matchedRecipient.username} &nbsp;·&nbsp;{" "}
                          {matchedRecipient.walletNumber}
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
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99]"
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
              <p className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                {formatToRupiah(availableBalance)}
              </p>
            </div>

            <p className="pt-5 text-xs leading-relaxed text-[#64748B]">
              Pastikan penerima dan nominal sudah benar sebelum melanjutkan.
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E293B]">
              Tinjau transfer
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Periksa kembali detail penerima dan nominal sebelum mengirim
              saldo.
            </DialogDescription>
          </DialogHeader>

          {matchedRecipient && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center gap-3 rounded-xl bg-[#EDF5F3] p-3.5">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#135D54] text-xs font-semibold text-white">
                    {matchedRecipient.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-[#1E293B]">
                    {matchedRecipient.name}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    @{matchedRecipient.username} ·{" "}
                    {matchedRecipient.walletNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 rounded-xl border border-slate-100 p-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Nominal transfer</span>
                  <span className="font-bold text-[#1E293B]">
                    {formatToRupiah(numericAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Biaya transaksi</span>
                  <span className="font-semibold text-[#135D54]">Gratis</span>
                </div>
                {note.trim() && (
                  <div className="flex justify-between gap-4 border-t border-slate-100 pt-2.5">
                    <span className="text-[#64748B]">Catatan</span>
                    <span className="text-right font-medium text-[#1E293B]">
                      {note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => setIsReviewOpen(false)}
              className="rounded-xl text-xs font-semibold text-[#64748B]"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmTransfer}
              className="rounded-xl bg-[#135D54] text-xs font-semibold text-white hover:bg-[#0F4C44]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </span>
              ) : (
                "Kirim sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
