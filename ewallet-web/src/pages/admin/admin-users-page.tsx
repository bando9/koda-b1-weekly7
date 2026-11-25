import { useEffect, useState, type FormEvent } from "react"
import { RefreshCw } from "lucide-react"
import { Link, useOutletContext } from "react-router"

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
import { adminService, type AdminUserItemDto } from "@/service/admin-service"
import {
  dashboardService,
  type UserProfileDto,
} from "@/service/dashboard-service"

interface AdminLayoutContext {
  displayName: string
  initials: string
}

const ITEMS_PER_PAGE = 5

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return "AD"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AdminUsersPage() {
  const context = useOutletContext<AdminLayoutContext | undefined>()

  const [profile, setProfile] = useState<UserProfileDto | null>(null)
  const [users, setUsers] = useState<AdminUserItemDto[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)

  const [searchInput, setSearchInput] = useState("")
  const [statusInput, setStatusInput] = useState<string>("all")

  const [appliedSearch, setAppliedSearch] = useState("")
  const [appliedStatus, setAppliedStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  useEffect(() => {
    let isCancelled = false

    dashboardService
      .getProfile()
      .then((res) => {
        if (!isCancelled) setProfile(res)
      })
      .catch(() => {})

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function fetchUsers() {
      try {
        const res = await adminService.getUsers({
          search: appliedSearch,
          status: appliedStatus,
          page: currentPage,
          pageSize: ITEMS_PER_PAGE,
        })

        if (!isCancelled) {
          setUsers(res.items)
          setTotalCount(res.totalCount)
          setError(null)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat daftar pengguna."
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isCancelled = true
    }
  }, [appliedSearch, appliedStatus, currentPage, refreshKey])

  const displayName = profile?.fullName || context?.displayName || "Admin"
  const initials = profile?.fullName
    ? getInitials(profile.fullName)
    : context?.initials || "AD"

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const handleApplyFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setAppliedSearch(searchInput.trim().replace(/^@/, ""))
    setAppliedStatus(statusInput)
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
            PENGELOLAAN AKUN
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Pengguna
          </h1>
          <p className="text-sm text-[#64748B]">
            Kelola akun customer, status, dan akses aplikasi.
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
          <div className="mb-7">
            <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
              Daftar pengguna
            </h2>
            <p className="text-xs text-[#64748B]">
              Temukan akun berdasarkan nama, username, atau email.
            </p>
          </div>

          <form
            onSubmit={handleApplyFilter}
            className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-12"
          >
            <div className="sm:col-span-7">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari pengguna..."
                className="h-11 rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs text-[#1E293B] shadow-none placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#135D54]"
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                value={statusInput}
                onValueChange={(value) => {
                  const nextStatus = value ?? "all"
                  setIsLoading(true)
                  setStatusInput(nextStatus)
                  setAppliedStatus(nextStatus)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Semua status
                  </SelectItem>
                  <SelectItem value="ACTIVE" className="text-xs">
                    Aktif
                  </SelectItem>
                  <SelectItem value="SUSPENDED" className="text-xs">
                    Ditangguhkan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="secondary"
                className="h-11 w-full cursor-pointer justify-start rounded-xl bg-[#EDF5F3] px-4 text-xs font-semibold text-[#135D54] shadow-none transition-colors hover:bg-[#E1EFEA]"
              >
                Filter
              </Button>
            </div>
          </form>

          <div className="hidden grid-cols-12 border-b border-slate-100 pb-3.5 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase sm:grid">
            <div className="col-span-4">PENGGUNA</div>
            <div className="col-span-4">EMAIL</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2 text-right">AKSI</div>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-14 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#64748B]">
                Tidak ada pengguna yang sesuai dengan filter pencarian.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map((item) => {
                const isActive = item.status.toUpperCase() === "ACTIVE"
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 items-center gap-2.5 py-5 sm:grid-cols-12 sm:gap-4"
                  >
                    <div className="sm:col-span-4">
                      <p className="text-sm font-bold text-[#1E293B]">
                        {item.fullName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        @{item.userName}
                      </p>
                    </div>

                    <div className="sm:col-span-4">
                      <p className="text-xs text-[#64748B]">{item.email}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <Badge
                        className={cn(
                          "rounded-full px-3.5 py-1 text-[11px] font-semibold shadow-none",
                          isActive
                            ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                            : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                        )}
                      >
                        {isActive ? "Aktif" : "Ditangguhkan"}
                      </Badge>
                    </div>

                    <div className="sm:col-span-2 sm:text-right">
                      <Link
                        to={`/admin/users/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#135D54] hover:underline"
                      >
                        <span>Detail</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-7 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <p className="text-xs text-[#64748B]">
              Menampilkan {users.length} dari{" "}
              {new Intl.NumberFormat("id-ID").format(totalCount)} akun
            </p>

            {totalPages > 1 && (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#EDF5F3] px-4 py-2.5 text-xs">
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1
                  const isActive = page === safeCurrentPage
                  return (
                    <div
                      key={page}
                      className="inline-flex items-center gap-1.5"
                    >
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
