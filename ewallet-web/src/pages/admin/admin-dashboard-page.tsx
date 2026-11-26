import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Link, useOutletContext } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  adminService,
  type AdminUserItemDto,
  type AdminUserSummaryDto,
} from "@/service/admin-service"
import {
  dashboardService,
  type UserProfileDto,
} from "@/service/dashboard-service"
import UseAuth from "@/hooks/use-auth"

interface AdminLayoutContext {
  displayName: string
  initials: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return "AD"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num)
}

export default function AdminDashboardPage() {
  const context = useOutletContext<AdminLayoutContext | undefined>()
  const { accessToken } = UseAuth()

  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [summary, setSummary] = useState<AdminUserSummaryDto | null>(null)
  const [recentUsers, setRecentUsers] = useState<AdminUserItemDto[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  useEffect(() => {
    let isCancelled = false

    async function fetchAdminDashboard() {
      try {
        const [profileRes, summaryRes, usersRes] = await Promise.all([
          dashboardService.getProfile(accessToken).catch(() => null),
          adminService.getUsersSummary(accessToken),
          adminService.getUsers(accessToken, { page: 1, pageSize: 4 }),
        ])

        if (!isCancelled) {
          if (profileRes) setProfile(profileRes)
          setSummary(summaryRes)
          setRecentUsers(usersRes.items)
          setError(null)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat data ringkasan admin."
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchAdminDashboard()

    return () => {
      isCancelled = true
    }
  }, [refreshKey])

  const displayName = profile?.fullName || context?.displayName || "Admin"
  const initials = profile?.fullName
    ? getInitials(profile.fullName)
    : context?.initials || "AD"

  const totalUsers = summary?.totalUsers ?? 0
  const activeUsers = summary?.activeUsers ?? 0
  const suspendedUsers = summary?.suspendedUsers ?? 0
  const newUsersThisMonth = summary?.newUsersThisMonth ?? 0

  const activePercentage =
    totalUsers > 0
      ? ((activeUsers / totalUsers) * 100).toFixed(1).replace(".", ",")
      : "0"

  const stats = [
    {
      label: "TOTAL PENGGUNA",
      value: formatNumber(totalUsers),
      caption: `+ ${formatNumber(newUsersThisMonth)} bulan ini`,
    },
    {
      label: "AKUN AKTIF",
      value: formatNumber(activeUsers),
      caption: `${activePercentage}% dari seluruh akun`,
    },
    {
      label: "AKUN DITANGGUHKAN",
      value: formatNumber(suspendedUsers),
      caption: suspendedUsers > 0 ? "Perlu pemantauan" : "Semua akun normal",
    },
  ]

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
            ADMIN AREA
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Ringkasan platform
          </h1>
          <p className="text-sm text-[#64748B]">
            Pantau pertumbuhan pengguna dan status akun.
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-3xl border-0 bg-white shadow-none"
          >
            <CardContent className="p-7 sm:p-8">
              <p className="mb-4 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                {stat.label}
              </p>
              {isLoading ? (
                <div className="mb-3 h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <p className="mb-3 text-4xl font-bold tracking-tight text-[#1E293B] sm:text-[40px]">
                  {stat.value}
                </p>
              )}
              <p className="text-xs font-medium text-[#135D54]">
                {isLoading ? "Memuat data..." : stat.caption}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-none">
        <CardContent className="p-7 sm:p-9">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-[#1E293B]">
              Pengguna terbaru
            </h2>

            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#135D54] hover:underline"
            >
              <span>Lihat semua</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#64748B]">
                Belum ada pengguna yang terdaftar.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentUsers.map((item) => {
                const isActive = item.status.toUpperCase() === "ACTIVE"
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 items-center gap-2 py-5 sm:grid-cols-12 sm:gap-4"
                  >
                    <div className="sm:col-span-4">
                      <p className="text-sm font-bold text-[#1E293B]">
                        {item.fullName}
                      </p>
                    </div>

                    <div className="sm:col-span-5">
                      <p className="text-xs text-[#64748B]">{item.email}</p>
                    </div>

                    <div className="sm:col-span-3 sm:text-right">
                      <Badge
                        className={cn(
                          "rounded-full px-4 py-1 text-[11px] font-semibold shadow-none",
                          isActive
                            ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                            : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                        )}
                      >
                        {isActive ? "Aktif" : "Ditangguhkan"}
                      </Badge>
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
