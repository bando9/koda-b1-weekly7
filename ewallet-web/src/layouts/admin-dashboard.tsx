import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ADMIN_NAV_ITEMS = [
  { id: "users", label: "User Management" },
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" },
]

const SUMMARY_STATS = [
  { id: "total", label: "Total Pengguna", value: "1.248" },
  { id: "active", label: "Akun Aktif", value: "1.190" },
  { id: "suspended", label: "Suspended", value: "58" },
]

const USERS_DATA = [
  {
    id: 1,
    name: "Nadia Putri",
    username: "nadia",
    email: "nadia@example.com",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Bima Pratama",
    username: "bima",
    email: "bima@example.com",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Rina Maharani",
    username: "rina",
    email: "rina@example.com",
    status: "SUSPENDED",
  },
]

function KodaLogo({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect
        x="14"
        y="2.12132"
        width="16.8"
        height="16.8"
        rx="1.5"
        transform="rotate(45 14 2.12132)"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <rect
        x="14"
        y="9.75736"
        width="6"
        height="6"
        rx="0.5"
        transform="rotate(45 14 9.75736)"
        fill="currentColor"
      />
    </svg>
  )
}

export default function AdminUserManagementPage({ onSelectUser }) {
  const [activeNav, setActiveNav] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = USERS_DATA.filter((user) => {
    const q = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans antialiased">
      <aside className="flex w-[240px] shrink-0 flex-col bg-[#0F172A] px-4 py-7 text-white">
        <div className="mb-8 flex items-center gap-2.5 px-3">
          <KodaLogo className="text-white" />
          <span className="text-[20px] font-bold tracking-tight">
            KodaWallet
          </span>
        </div>

        <p className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
          ADMIN WORKSPACE
        </p>

        <nav className="space-y-1.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-[#1E40AF] font-semibold text-white"
                    : "font-medium text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 px-10 py-9">
        <div className="max-w-[1120px]">
          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-1 text-[28px] font-bold tracking-tight text-[#0F172A]">
                User Management
              </h1>
              <p className="text-sm text-[#64748B]">
                Kelola status akun customer KodaWallet.
              </p>
            </div>

            <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2">
              <span className="text-xs font-bold text-[#0F172A]">NP</span>
              <span className="text-xs font-semibold text-[#0F172A]">
                Nadia
              </span>
            </div>
          </header>

          <section className="mb-7 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SUMMARY_STATS.map((stat) => (
              <Card
                key={stat.id}
                className="rounded-3xl border-0 bg-white p-7 shadow-none ring-0"
              >
                <CardContent className="p-0">
                  <p className="mb-3 text-xs font-medium text-[#64748B]">
                    {stat.label}
                  </p>
                  <p className="text-[32px] leading-none font-bold tracking-tight text-[#0F172A]">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="rounded-3xl border-0 bg-white p-8 shadow-none ring-0">
            <CardContent className="min-h-[380px] p-0">
              <h2 className="mb-5 text-[20px] font-bold tracking-tight text-[#0F172A]">
                Daftar Pengguna
              </h2>

              <div className="mb-6 max-w-[440px]">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari username, nama, email..."
                  className="h-11 rounded-xl border-0 bg-[#F1F5F9] px-4 text-xs text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
                    <TableHead className="w-[32%] pl-2 text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                      USER
                    </TableHead>
                    <TableHead className="w-[36%] text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                      EMAIL
                    </TableHead>
                    <TableHead className="w-[20%] text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                      STATUS
                    </TableHead>
                    <TableHead className="w-[12%] pr-3 text-right" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/60"
                      >
                        <TableCell className="py-5 pl-2 text-sm font-bold text-[#0F172A]">
                          {user.name}
                        </TableCell>

                        <TableCell className="py-5 text-xs font-medium text-[#64748B]">
                          {user.email}
                        </TableCell>

                        <TableCell className="py-5">
                          {user.status === "ACTIVE" ? (
                            <Badge
                              variant="secondary"
                              className="rounded-full border-0 bg-[#DCFCE7] px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#15803D] hover:bg-[#DCFCE7]"
                            >
                              ACTIVE
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="rounded-full border-0 bg-[#FEE2E2] px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#DC2626] hover:bg-[#FEE2E2]"
                            >
                              SUSPENDED
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="py-5 pr-3 text-right">
                          <button
                            type="button"
                            onClick={() => onSelectUser?.(user)}
                            className="cursor-pointer text-xs font-semibold text-[#1D61E7] hover:underline"
                          >
                            Detail
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-xs font-medium text-[#64748B]"
                      >
                        Pengguna tidak ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
