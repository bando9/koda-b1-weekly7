import { useEffect, useState } from "react"
import { ArrowUpRight, Plus, RefreshCw } from "lucide-react"
import { Link, useOutletContext } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  dashboardService,
  type TransactionDto,
  type UserProfileDto,
  type WalletDto,
} from "@/service/dashboard-service"
import { formatToRupiah } from "@/utils"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatMaskedWalletNumber(walletNumber?: string): string {
  if (!walletNumber) return "W •••• ••••"
  const last4 = walletNumber.slice(-4)
  return `W •••• ${last4}`
}

function formatIndonesianDate(isoString: string): string {
  const date = new Date(isoString)
  const datePart = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(":", ".")

  return `${datePart} · ${timePart}`
}

function formatTodayHeader(): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

function mapTransactionStatus(status: string): {
  label: string
  colorClass: string
} {
  switch (status.toUpperCase()) {
    case "SUCCESS":
      return { label: "Berhasil", colorClass: "text-[#135D54]" }
    case "PENDING":
      return { label: "Diproses", colorClass: "text-amber-600" }
    default:
      return { label: "Gagal", colorClass: "text-red-600" }
  }
}

export default function CustomerDashboardPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()

  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [wallet, setWallet] = useState<WalletDto | null>(null)
  const [transactions, setTransactions] = useState<TransactionDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let isCancelled = false

    async function fetchDashboard() {
      try {
        const [profileRes, walletRes, txRes] = await Promise.all([
          dashboardService.getProfile(),
          dashboardService.getMyWallet(),
          dashboardService.getRecentTransactions(1, 5),
        ])

        if (!isCancelled) {
          setProfile(profileRes)
          setWallet(walletRes)
          setTransactions(txRes.items)
          setError(null)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat data dashboard."
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      isCancelled = true
    }
  }, [refreshKey])

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setRefreshKey((prev) => prev + 1)
  }

  const displayName = profile?.fullName ?? context?.displayName ?? "Pengguna"
  const initials = profile?.fullName
    ? getInitials(profile.fullName)
    : (context?.initials ?? "U")

  const isWalletActive = wallet?.status === "ACTIVE"

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            PERSONAL WALLET
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Beranda
          </h1>
          <p className="text-sm text-[#64748B]">
            {formatTodayHeader()} &nbsp;•&nbsp; Selamat datang kembali,{" "}
            {displayName.split(" ")[0]}.
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

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="gap-1.5 border-red-200 bg-white text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Lagi
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-0 bg-[#135D54] text-white shadow-none lg:col-span-8">
          <CardContent className="flex h-full flex-col justify-between p-7 sm:p-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold tracking-wider text-white/80 uppercase">
                SALDO TERSEDIA
              </p>
              {isLoading ? (
                <div className="h-11 w-56 animate-pulse rounded-xl bg-white/20" />
              ) : (
                <p className="text-4xl font-bold tracking-tight sm:text-[42px]">
                  {formatToRupiah(wallet?.balance ?? 0)}
                </p>
              )}
            </div>

            <div className="mt-7 space-y-4">
              <p className="text-sm text-white/85">
                Nomor dompet &nbsp;·&nbsp;{" "}
                <span className="font-medium tracking-wide text-white">
                  {isLoading
                    ? "Memuat..."
                    : formatMaskedWalletNumber(wallet?.walletNumber)}
                </span>
              </p>

              <div>
                <Badge className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#135D54] hover:bg-white">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isWalletActive ? "bg-[#135D54]" : "bg-amber-500"
                    }`}
                  />
                  {isLoading
                    ? "Memuat"
                    : isWalletActive
                      ? "Aktif"
                      : (wallet?.status ?? "Nonaktif")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="flex h-full flex-col justify-between p-7">
            <div>
              <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                Aksi cepat
              </h2>
              <p className="text-xs text-[#64748B]">
                Transaksi yang sering digunakan
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                className="h-12 w-full justify-start gap-2.5 rounded-xl bg-[#135D54] px-4 text-sm font-semibold text-white shadow-none hover:bg-[#0F4C44]"
                render={
                  <Link to="/dashboard/top-up">
                    <Plus className="h-4 w-4" />
                    <span>Isi Saldo</span>
                  </Link>
                }
              ></Button>

              <Button
                variant="secondary"
                className="h-12 w-full justify-start gap-2.5 rounded-xl bg-[#EDF5F3] px-4 text-sm font-semibold text-[#135D54] shadow-none hover:bg-[#E1EFEA]"
                render={
                  <Link to="/dashboard/transfer">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>Transfer</span>
                  </Link>
                }
              ></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-none">
        <CardContent className="p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                Aktivitas terakhir
              </h2>
              <p className="text-xs text-[#64748B]">
                Pantau pergerakan uang di dompetmu
              </p>
            </div>

            <Link
              to="/dashboard/activities"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#135D54] hover:underline"
            >
              <span>Lihat semua</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#1E293B]">
                Belum ada aktivitas transaksi
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Mulai dengan melakukan Isi Saldo atau Transfer ke sesama
                pengguna.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isIncome = tx.direction === "IN"
                const statusInfo = mapTransactionStatus(tx.status)
                const title =
                  tx.description ||
                  (tx.type === "TOPUP" ? "Top up saldo" : "Transfer dana")

                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-1 items-center gap-2 py-5 sm:grid-cols-12 sm:gap-4"
                  >
                    <div className="sm:col-span-5">
                      <p className="text-sm font-semibold text-[#1E293B]">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        {formatIndonesianDate(tx.createdAtUtc)}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-xs text-[#64748B]">
                        {isIncome ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-sm font-semibold text-[#1E293B]">
                        {isIncome ? "+ " : "- "}
                        {formatToRupiah(tx.amount)}
                      </span>
                    </div>

                    <div className="sm:col-span-2 sm:text-right">
                      <span
                        className={`text-xs font-semibold ${statusInfo.colorClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
