import { useMemo, useState, type FormEvent } from "react"
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

interface AdminLayoutContext {
  displayName: string
  initials: string
}

type AccountStatus = "Aktif" | "Ditangguhkan"

interface CustomerAccountItem {
  id: string
  name: string
  username: string
  email: string
  status: AccountStatus
}

const MOCK_USERS: CustomerAccountItem[] = [
  {
    id: "usr-1",
    name: "Nadia Putri",
    username: "nadia",
    email: "nadia@example.com",
    status: "Aktif",
  },
  {
    id: "usr-2",
    name: "Bima Pratama",
    username: "bima",
    email: "bima@example.com",
    status: "Aktif",
  },
  {
    id: "usr-3",
    name: "Rina Maharani",
    username: "rina",
    email: "rina@example.com",
    status: "Aktif",
  },
  {
    id: "usr-4",
    name: "Hendra Wijaya",
    username: "hendra",
    email: "hendra@example.com",
    status: "Ditangguhkan",
  },
  {
    id: "usr-5",
    name: "Dian Ayu",
    username: "dian",
    email: "dian@example.com",
    status: "Aktif",
  },
]

const TOTAL_ACCOUNTS_COUNT = 1248

export default function AdminUsersPage() {
  const context = useOutletContext<AdminLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Admin"
  const initials = context?.initials ?? "AD"

  // Input filter (sebelum tombol Filter ditekan)
  const [searchInput, setSearchInput] = useState("")
  const [statusInput, setStatusInput] = useState<string>("all")

  // Filter aktif yang diterapkan saat tombol Filter / Enter ditekan
  const [appliedSearch, setAppliedSearch] = useState("")
  const [appliedStatus, setAppliedStatus] = useState<string>("all")

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const q = appliedSearch.trim().toLowerCase().replace(/^@/, "")
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)

      const matchesStatus =
        appliedStatus === "all" || user.status === appliedStatus

      return matchesQuery && matchesStatus
    })
  }, [appliedSearch, appliedStatus])

  const handleApplyFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAppliedSearch(searchInput)
    setAppliedStatus(statusInput)
  }

  return (
    <div className="space-y-8">
      {/* Header Halaman + Pil Profil Admin */}
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

        {/* Pil Profil Admin (Desktop) */}
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

      {/* Kartu Daftar Pengguna */}
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

          {/* Baris Pencarian & Filter */}
          <form
            onSubmit={handleApplyFilter}
            className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-12"
          >
            {/* Input Cari Pengguna */}
            <div className="sm:col-span-7">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari pengguna..."
                className="h-11 rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs text-[#1E293B] shadow-none placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#135D54]"
              />
            </div>

            {/* Dropdown Semua Status */}
            <div className="sm:col-span-3">
              <Select
                value={statusInput}
                onValueChange={(value) => {
                  setStatusInput(value)
                  setAppliedStatus(value)
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Semua status
                  </SelectItem>
                  <SelectItem value="Aktif" className="text-xs">
                    Aktif
                  </SelectItem>
                  <SelectItem value="Ditangguhkan" className="text-xs">
                    Ditangguhkan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tombol Filter */}
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

          {/* Header Kolom Tabel (Desktop) */}
          <div className="hidden grid-cols-12 border-b border-slate-100 pb-3.5 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase sm:grid">
            <div className="col-span-4">PENGGUNA</div>
            <div className="col-span-4">EMAIL</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2 text-right">AKSI</div>
          </div>

          {/* Daftar Baris Pengguna */}
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#64748B]">
                Tidak ada pengguna yang sesuai dengan filter pencarian.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredUsers.map((item) => {
                const isActive = item.status === "Aktif"
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 items-center gap-2.5 py-5 sm:grid-cols-12 sm:gap-4"
                  >
                    {/* Nama & Username */}
                    <div className="sm:col-span-4">
                      <p className="text-sm font-bold text-[#1E293B]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        @{item.username}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-4">
                      <p className="text-xs text-[#64748B]">{item.email}</p>
                    </div>

                    {/* Badge Status */}
                    <div className="sm:col-span-2">
                      <Badge
                        className={cn(
                          "rounded-full px-3.5 py-1 text-[11px] font-semibold shadow-none",
                          isActive
                            ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                            : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    {/* Aksi Detail */}
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

          {/* Footer Jumlah Akun */}
          <div className="mt-6 pt-2">
            <p className="text-xs text-[#64748B]">
              Menampilkan {filteredUsers.length} dari{" "}
              {new Intl.NumberFormat("id-ID").format(TOTAL_ACCOUNTS_COUNT)} akun
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
