import { useEffect, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Link, useOutletContext, useParams } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import { adminService, type AdminUserItemDto } from "@/service/admin-service"
import {
  dashboardService,
  type UserProfileDto,
} from "@/service/dashboard-service"

interface AdminLayoutContext {
  displayName: string
  initials: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatRegisteredDate(isoString?: string): string {
  if (!isoString) return "-"
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const context = useOutletContext<AdminLayoutContext | undefined>()

  const [adminProfile, setAdminProfile] = useState<UserProfileDto | null>(null)
  const [customer, setCustomer] = useState<AdminUserItemDto | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    dashboardService
      .getProfile()
      .then((res) => {
        if (!isCancelled) setAdminProfile(res)
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const numericId = Number(userId)

    if (!userId || Number.isNaN(numericId) || numericId <= 0) {
      setFetchError("ID pengguna tidak valid.")
      setIsLoading(false)
      return
    }

    async function fetchUserDetail() {
      try {
        const res = await adminService.getUserById(numericId)
        if (!isCancelled) {
          setCustomer(res)
          setFetchError(null)
        }
      } catch (err) {
        if (!isCancelled) {
          setFetchError(
            err instanceof Error ? err.message : "Gagal memuat detail pengguna."
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchUserDetail()

    return () => {
      isCancelled = true
    }
  }, [userId, refreshKey])

  const displayName = adminProfile?.fullName || context?.displayName || "Admin"
  const adminInitials = adminProfile?.fullName
    ? getInitials(adminProfile.fullName)
    : context?.initials || "AD"

  const isActive = customer?.status.toUpperCase() === "ACTIVE"
  const statusLabel = isActive ? "Aktif" : "Ditangguhkan"

  const handleToggleAccountStatus = async () => {
    if (!customer) return

    setIsUpdatingStatus(true)
    setStatusFeedback(null)
    setActionError(null)

    const nextApiStatus: "ACTIVE" | "SUSPENDED" = isActive
      ? "SUSPENDED"
      : "ACTIVE"

    try {
      const updated = await adminService.updateUserStatus(
        customer.id,
        nextApiStatus
      )

      setCustomer((prev) => (prev ? { ...prev, status: updated.status } : prev))

      setStatusFeedback(
        nextApiStatus === "SUSPENDED"
          ? `Akun ${customer.fullName} berhasil ditangguhkan.`
          : `Akun ${customer.fullName} berhasil diaktifkan kembali.`
      )
      setIsConfirmOpen(false)
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui status akun pengguna."
      )
      setIsConfirmOpen(false)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setFetchError(null)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            PENGELOLAAN AKUN
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Detail pengguna
          </h1>
          <p className="text-sm text-[#64748B]">
            Informasi akun customer dan status aksesnya.
          </p>
        </div>

        <div className="hidden items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:flex">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#135D54] text-xs font-semibold text-white">
              {adminInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-[#1E293B]">
            {displayName}
          </span>
        </div>
      </div>

      {fetchError && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{fetchError}</span>
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-8">
          <CardContent className="p-7 sm:p-9">
            <div className="mb-7">
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#135D54] transition-opacity hover:opacity-80"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke daftar</span>
              </Link>
            </div>

            {statusFeedback && (
              <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs font-medium">
                  {statusFeedback}
                </AlertDescription>
              </Alert>
            )}

            {actionError && (
              <Alert
                variant="destructive"
                className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-700"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs font-medium">
                  {actionError}
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-7">
                  <div className="h-14 w-14 animate-pulse rounded-full bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-5 w-44 animate-pulse rounded-lg bg-slate-100" />
                    <div className="h-3.5 w-28 animate-pulse rounded-lg bg-slate-100" />
                  </div>
                </div>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="h-6 w-full animate-pulse rounded-lg bg-slate-100"
                  />
                ))}
              </div>
            ) : !customer ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-[#64748B]">
                  Data pengguna tidak ditemukan.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-7">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-[#135D54] text-base font-bold text-white">
                        {getInitials(customer.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[#1E293B]">
                        {customer.fullName}
                      </h2>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        @{customer.userName}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={cn(
                      "rounded-full px-4 py-1 text-[11px] font-semibold shadow-none",
                      isActive
                        ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                        : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                    )}
                  >
                    {statusLabel}
                  </Badge>
                </div>

                <div className="mt-7 space-y-6 text-sm">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <span className="text-xs text-[#64748B] sm:col-span-4">
                      Nama lengkap
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                      {customer.fullName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <span className="text-xs text-[#64748B] sm:col-span-4">
                      Email
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                      {customer.email}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <span className="text-xs text-[#64748B] sm:col-span-4">
                      Telepon
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                      {customer.phoneNumber || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <span className="text-xs text-[#64748B] sm:col-span-4">
                      Nomor dompet
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                      {customer.wallet?.walletNumber || "Belum memiliki dompet"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <span className="text-xs text-[#64748B] sm:col-span-4">
                      Role
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                      {customer.roles?.join(", ") || "CUSTOMER"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <span className="text-xs text-[#64748B] sm:col-span-4">
                      Terdaftar sejak
                    </span>
                    <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                      {formatRegisteredDate(customer.createdAtUtc)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="p-7 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-[#1E293B]">
              Status akun
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
                <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : customer ? (
              <>
                <div className="mb-4">
                  <Badge
                    className={cn(
                      "rounded-full px-4 py-1 text-[11px] font-semibold shadow-none",
                      isActive
                        ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                        : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                    )}
                  >
                    {statusLabel}
                  </Badge>
                </div>

                <p className="text-xs leading-relaxed text-[#64748B]">
                  {isActive
                    ? "Menangguhkan akun akan membatasi akses dan transaksi."
                    : "Akun saat ini ditangguhkan dan tidak dapat melakukan transaksi."}
                </p>

                <div className="mt-7">
                  <Button
                    type="button"
                    onClick={() => setIsConfirmOpen(true)}
                    className={cn(
                      "h-12 w-full cursor-pointer justify-start rounded-xl px-5 text-xs font-semibold text-white shadow-none transition-all active:scale-[0.99]",
                      isActive
                        ? "bg-[#B54334] hover:bg-[#9E382B]"
                        : "bg-[#135D54] hover:bg-[#0F4C44]"
                    )}
                  >
                    {isActive ? "Tangguhkan akun" : "Aktifkan kembali akun"}
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E293B]">
              {isActive ? "Tangguhkan akun?" : "Aktifkan kembali akun?"}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-[#64748B]">
              {customer &&
                (isActive
                  ? `Apakah Anda yakin ingin menangguhkan akun ${customer.fullName} (@${customer.userName})? Pengguna tidak akan bisa masuk atau bertransaksi selama ditangguhkan.`
                  : `Apakah Anda yakin ingin mengaktifkan kembali akun ${customer.fullName} (@${customer.userName})?`)}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdatingStatus}
              onClick={() => setIsConfirmOpen(false)}
              className="rounded-xl text-xs font-semibold text-[#64748B]"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isUpdatingStatus}
              onClick={handleToggleAccountStatus}
              className={cn(
                "rounded-xl text-xs font-semibold text-white",
                isActive
                  ? "bg-[#B54334] hover:bg-[#9E382B]"
                  : "bg-[#135D54] hover:bg-[#0F4C44]"
              )}
            >
              {isUpdatingStatus ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Memproses...</span>
                </span>
              ) : isActive ? (
                "Ya, tangguhkan"
              ) : (
                "Ya, aktifkan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
