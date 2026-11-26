import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { useOutletContext } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  dashboardService,
  type TransactionDto,
  type UserProfileDto,
} from "@/service/dashboard-service"
import UseAuth from "@/hooks/use-auth"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

const ITEMS_PER_PAGE = 4

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount)
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function mapTransactionTypeLabel(type: string): string {
  switch (type.toUpperCase()) {
    case "TOPUP":
      return "TOP UP"
    case "TRANSFER":
      return "TRANSFER"
    default:
      return type.toUpperCase()
  }
}

function mapStatusLabel(status: string): "Berhasil" | "Diproses" | "Gagal" {
  switch (status.toUpperCase()) {
    case "SUCCESS":
      return "Berhasil"
    case "PENDING":
      return "Diproses"
    default:
      return "Gagal"
  }
}

export default function ActivitiesPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()

  const { accessToken } = UseAuth()

  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [transactions, setTransactions] = useState<TransactionDto[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (context?.displayName) return
    let isCancelled = false

    dashboardService
      .getProfile(accessToken)
      .then((res) => {
        if (!isCancelled) setProfile(res)
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [context?.displayName])

  useEffect(() => {
    let isCancelled = false

    async function fetchActivities() {
      try {
        const daysMap: Record<string, number | undefined> = {
          all: undefined,
          "7d": 7,
          "30d": 30,
          "90d": 90,
        }

        const res = await dashboardService.getTransactions(
          {
            search: debouncedSearch,
            type: selectedType,
            status: selectedStatus,
            days: daysMap[selectedDateRange],
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
          },
          accessToken
        )

        if (!isCancelled) {
          setTransactions(res.items)
          setTotalCount(res.totalCount)
          setError(null)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat riwayat transaksi."
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchActivities()

    return () => {
      isCancelled = true
    }
  }, [
    debouncedSearch,
    selectedType,
    selectedStatus,
    selectedDateRange,
    currentPage,
    refreshKey,
    accessToken,
  ])

  const displayName = profile?.fullName ?? context?.displayName ?? "Pengguna"
  const initials = profile?.fullName
    ? getInitials(profile.fullName)
    : (context?.initials ?? "U")

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const handleFilterChange =
    (setter: (val: string) => void) => (val: string | null) => {
      setIsLoading(true)
      setter(val ?? "all")
      setCurrentPage(1)
    }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            RIWAYAT TRANSAKSI
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Aktivitas
          </h1>
          <p className="text-sm text-[#64748B]">
            Lihat riwayat transaksi dan mutasi saldo.
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

      <Card className="rounded-3xl border-0 bg-white shadow-none">
        <CardContent className="p-7 sm:p-9">
          <h2 className="mb-6 text-lg font-bold text-[#1E293B]">
            Riwayat transaksi
          </h2>

          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-5">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setIsLoading(true)
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Cari nomor referensi atau deskripsi..."
                className="h-11 rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs text-[#1E293B] shadow-none placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#135D54]"
              />
            </div>

            <div className="lg:col-span-2">
              <Select
                value={selectedType}
                onValueChange={handleFilterChange(setSelectedType)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Semua tipe" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Semua tipe
                  </SelectItem>
                  <SelectItem value="TOPUP" className="text-xs">
                    Top up
                  </SelectItem>
                  <SelectItem value="TRANSFER" className="text-xs">
                    Transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select
                value={selectedStatus}
                onValueChange={handleFilterChange(setSelectedStatus)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Semua status
                  </SelectItem>
                  <SelectItem value="SUCCESS" className="text-xs">
                    Berhasil
                  </SelectItem>
                  <SelectItem value="PENDING" className="text-xs">
                    Diproses
                  </SelectItem>
                  <SelectItem value="FAILED" className="text-xs">
                    Gagal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <Select
                value={selectedDateRange}
                onValueChange={handleFilterChange(setSelectedDateRange)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Rentang tanggal" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Rentang tanggal
                  </SelectItem>
                  <SelectItem value="7d" className="text-xs">
                    7 hari terakhir
                  </SelectItem>
                  <SelectItem value="30d" className="text-xs">
                    30 hari terakhir
                  </SelectItem>
                  <SelectItem value="90d" className="text-xs">
                    90 hari terakhir
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden grid-cols-12 border-b border-slate-100 pb-3.5 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase sm:grid">
            <div className="col-span-5">TRANSAKSI</div>
            <div className="col-span-3">JENIS</div>
            <div className="col-span-2">NOMINAL</div>
            <div className="col-span-2 text-right">STATUS</div>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-14 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#64748B]">
                Tidak ada transaksi yang sesuai dengan filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isIncoming = tx.direction === "IN"
                const statusLabel = mapStatusLabel(tx.status)
                const title =
                  tx.description ||
                  (tx.type === "TOPUP" ? "Top up saldo" : "Transfer dana")

                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-1 items-center gap-2.5 py-5 sm:grid-cols-12 sm:gap-4"
                  >
                    <div className="sm:col-span-5">
                      <p className="text-sm font-bold text-[#1E293B]">
                        {title}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#94A3B8]">
                        {tx.referenceNo} &nbsp;·&nbsp;{" "}
                        {formatDateTime(tx.createdAtUtc)}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <span className="text-[11px] font-medium tracking-wide text-[#64748B] uppercase">
                        {mapTransactionTypeLabel(tx.type)}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-sm font-bold text-[#1E293B]">
                        {isIncoming ? "+ " : "- "}Rp{formatRupiah(tx.amount)}
                      </span>
                    </div>

                    <div className="sm:col-span-2 sm:text-right">
                      <Badge
                        className={cn(
                          "rounded-full px-3.5 py-1 text-[11px] font-semibold shadow-none",
                          statusLabel === "Berhasil" &&
                            "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]",
                          statusLabel === "Diproses" &&
                            "bg-amber-50 text-amber-700 hover:bg-amber-50",
                          statusLabel === "Gagal" &&
                            "bg-red-50 text-red-700 hover:bg-red-50"
                        )}
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-7 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <p className="text-xs text-[#64748B]">
              Menampilkan {transactions.length} dari {totalCount} transaksi
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#EDF5F3] px-4 py-2.5 text-xs">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                const isActive = page === safeCurrentPage
                return (
                  <div key={page} className="inline-flex items-center gap-1.5">
                    {index > 0 && (
                      <span className="text-[#135D54]/40 select-none">·</span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true)
                        setCurrentPage(page)
                      }}
                      className={cn(
                        "cursor-pointer px-1 transition-colors",
                        isActive
                          ? "font-bold text-[#135D54]"
                          : "font-medium text-[#135D54]/75 hover:text-[#135D54]"
                      )}
                    >
                      {page}
                    </button>
                  </div>
                )
              })}

              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => {
                  setIsLoading(true)
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }}
                aria-label="Halaman berikutnya"
                className="ml-1 cursor-pointer text-[#135D54] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35"
              >
                →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
