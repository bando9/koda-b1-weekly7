import {
  Loader2,
  Inbox,
  ShieldAlert,
  ClockAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState({
  title = "Memuat data...",
  description = "Mohon tunggu sebentar, kami sedang menyiapkan informasi untukmu.",
  variant = "spinner", // "spinner" | "skeleton"
}) {
  if (variant === "skeleton") {
    return (
      <Card className="w-full rounded-3xl border-0 bg-white p-6 shadow-none ring-0 md:p-8">
        <CardContent className="space-y-4 p-0">
          <Skeleton className="h-6 w-40 rounded-lg bg-[#F1F5F9]" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 rounded-md bg-[#E2E8F0]" />
                  <Skeleton className="h-3 w-24 rounded-md bg-[#E2E8F0]" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-[#E2E8F0]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-none ring-0">
      <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-0">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1D61E7]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h3 className="mb-1.5 text-base font-bold text-[#0F172A]">{title}</h3>
        <p className="max-w-xs text-xs leading-relaxed text-[#64748B]">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export function EmptyState({
  title = "Belum ada transaksi",
  description = "Riwayat transaksi atau data yang kamu cari belum tersedia saat ini.",
  actionLabel,
  onAction,
}) {
  return (
    <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-none ring-0">
      <CardContent className="flex min-h-[240px] flex-col items-center justify-center p-0">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#64748B]">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mb-1.5 text-base font-bold text-[#0F172A]">{title}</h3>
        <p className="max-w-xs text-xs leading-relaxed text-[#64748B]">
          {description}
        </p>

        {actionLabel && onAction && (
          <Button
            type="button"
            onClick={onAction}
            className="mt-6 h-11 cursor-pointer rounded-xl bg-[#1D61E7] px-5 text-xs font-semibold text-white shadow-none hover:bg-[#1652C8]"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function ForbiddenState({
  title = "Akses Ditolak",
  description = "Kamu tidak memiliki izin untuk mengakses halaman ini atau akunmu sedang ditangguhkan.",
  onBack,
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F7FA] p-6 font-sans antialiased">
      <Card className="w-full max-w-[440px] rounded-3xl border-0 bg-white p-8 text-center shadow-none ring-0">
        <CardContent className="flex flex-col items-center p-0">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <Badge
            variant="secondary"
            className="mb-3 rounded-full border-0 bg-[#FEE2E2] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#DC2626] hover:bg-[#FEE2E2]"
          >
            403 FORBIDDEN
          </Badge>

          <h2 className="mb-2 text-[22px] font-bold tracking-tight text-[#0F172A]">
            {title}
          </h2>
          <p className="mb-7 max-w-xs text-xs leading-relaxed text-[#64748B]">
            {description}
          </p>

          <Button
            type="button"
            onClick={onBack}
            className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
          >
            Kembali ke Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function SessionExpiredState({
  title = "Sesi Telah Berakhir",
  description = "Demi keamanan akun KodaWallet kamu, silakan masuk kembali untuk melanjutkan aktivitas.",
  onLogin,
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F7FA] p-6 font-sans antialiased">
      <Card className="w-full max-w-[440px] rounded-3xl border-0 bg-white p-8 text-center shadow-none ring-0">
        <CardContent className="flex flex-col items-center p-0">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF3C7] text-[#D97706]">
            <ClockAlert className="h-7 w-7" />
          </div>

          <Badge
            variant="secondary"
            className="mb-3 rounded-full border-0 bg-[#FEF3C7] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#B45309] hover:bg-[#FEF3C7]"
          >
            SESSION EXPIRED
          </Badge>

          <h2 className="mb-2 text-[22px] font-bold tracking-tight text-[#0F172A]">
            {title}
          </h2>
          <p className="mb-7 max-w-xs text-xs leading-relaxed text-[#64748B]">
            {description}
          </p>

          <Button
            type="button"
            onClick={onLogin}
            className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
          >
            Masuk Kembali
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function TransferSuccessState({
  amount = "Rp75.000",
  recipientName = "Bima Pratama",
  recipientWallet = "KW-****-2941",
  referenceId = "TRX-20261117-8912",
  date = "17 Nov 2026, 14:30 WIB",
  note = "Bayar makan siang",
  onDone,
  onNewTransfer,
}) {
  const details = [
    { label: "Penerima", value: `${recipientName} (${recipientWallet})` },
    { label: "No. Referensi", value: referenceId },
    { label: "Waktu", value: date },
    { label: "Catatan", value: note },
  ]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F7FA] p-6 font-sans antialiased">
      <Card className="w-full max-w-[460px] rounded-3xl border-0 bg-white p-8 shadow-none ring-0">
        <CardContent className="p-0">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#16A34A]">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <Badge
              variant="secondary"
              className="mb-3 rounded-full border-0 bg-[#DCFCE7] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#15803D] hover:bg-[#DCFCE7]"
            >
              SUCCESS
            </Badge>

            <h2 className="mb-1 text-[22px] font-bold tracking-tight text-[#0F172A]">
              Transfer Berhasil
            </h2>
            <p className="mb-5 text-xs text-[#64748B]">
              Saldo telah dikirim ke rekening KodaWallet tujuan.
            </p>

            <p className="mb-6 text-[32px] leading-none font-bold tracking-tight text-[#16A34A]">
              {amount}
            </p>
          </div>

          <div className="mb-7 space-y-3.5 rounded-2xl bg-[#F8FAFC] p-5">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 text-xs"
              >
                <span className="font-medium text-[#64748B]">{item.label}</span>
                <span className="text-right font-bold text-[#0F172A]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={onDone}
              className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
            >
              Selesai
            </Button>

            {onNewTransfer && (
              <Button
                type="button"
                variant="ghost"
                onClick={onNewTransfer}
                className="h-11 w-full cursor-pointer rounded-xl bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] hover:bg-[#E2E8F0]"
              >
                Transfer Lagi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ============================================================================
   6. TRANSFER REJECTED STATE (Transfer Gagal / Ditolak)
============================================================================ */
export function TransferRejectedState({
  amount = "Rp75.000",
  recipientName = "Bima Pratama",
  reason = "Saldo tidak mencukupi atau akun tujuan sedang ditangguhkan.",
  referenceId = "TRX-20261117-8913",
  onRetry,
  onBack,
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F7FA] p-6 font-sans antialiased">
      <Card className="w-full max-w-[460px] rounded-3xl border-0 bg-white p-8 shadow-none ring-0">
        <CardContent className="p-0">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
              <XCircle className="h-7 w-7" />
            </div>

            <Badge
              variant="secondary"
              className="mb-3 rounded-full border-0 bg-[#FEE2E2] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#DC2626] hover:bg-[#FEE2E2]"
            >
              REJECTED
            </Badge>

            <h2 className="mb-1 text-[22px] font-bold tracking-tight text-[#0F172A]">
              Transfer Ditolak
            </h2>
            <p className="mb-5 text-xs text-[#64748B]">
              Transaksi tidak dapat diproses. Saldo kamu tidak terpotong.
            </p>

            <p className="mb-6 text-[32px] leading-none font-bold tracking-tight text-[#0F172A]">
              {amount}
            </p>
          </div>

          <div className="mb-7 space-y-3 rounded-2xl bg-[#FEF2F2] p-5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#64748B]">Penerima</span>
              <span className="font-bold text-[#0F172A]">{recipientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#64748B]">No. Referensi</span>
              <span className="font-bold text-[#0F172A]">{referenceId}</span>
            </div>
            <div className="border-t border-[#FEE2E2] pt-2.5">
              <p className="mb-1 font-semibold text-[#DC2626]">Alasan:</p>
              <p className="leading-relaxed text-[#7F1D1D]">{reason}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={onRetry}
              className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
            >
              Coba Lagi
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="h-11 w-full cursor-pointer rounded-xl bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] hover:bg-[#E2E8F0]"
              >
                Kembali ke Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
