import { Link, useOutletContext } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AdminLayoutContext {
  displayName: string
  initials: string
}

interface StatMetric {
  label: string
  value: string
  caption: string
}

interface RecentUserItem {
  id: string
  name: string
  email: string
  status: "Aktif" | "Ditangguhkan"
}

const PLATFORM_STATS: StatMetric[] = [
  {
    label: "TOTAL PENGGUNA",
    value: "1.248",
    caption: "+ 28 bulan ini",
  },
  {
    label: "AKUN AKTIF",
    value: "1.190",
    caption: "95,4% dari seluruh akun",
  },
  {
    label: "AKUN DITANGGUHKAN",
    value: "58",
    caption: "Perlu pemantauan",
  },
]

const RECENT_USERS: RecentUserItem[] = [
  {
    id: "usr-1",
    name: "Nadia Putri",
    email: "nadia@example.com",
    status: "Aktif",
  },
  {
    id: "usr-2",
    name: "Bima Pratama",
    email: "bima@example.com",
    status: "Aktif",
  },
  {
    id: "usr-3",
    name: "Rina Maharani",
    email: "rina@example.com",
    status: "Aktif",
  },
  {
    id: "usr-4",
    name: "Hendra Wijaya",
    email: "hendra@example.com",
    status: "Ditangguhkan",
  },
]

export default function AdminDashboardPage() {
  const context = useOutletContext<AdminLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Admin"
  const initials = context?.initials ?? "AD"

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLATFORM_STATS.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-3xl border-0 bg-white shadow-none"
          >
            <CardContent className="p-7 sm:p-8">
              <p className="mb-4 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                {stat.label}
              </p>
              <p className="mb-3 text-4xl font-bold tracking-tight text-[#1E293B] sm:text-[40px]">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-[#135D54]">
                {stat.caption}
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

          <div className="divide-y divide-slate-100">
            {RECENT_USERS.map((item) => {
              const isActive = item.status === "Aktif"
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 items-center gap-2 py-5 sm:grid-cols-12 sm:gap-4"
                >
                  <div className="sm:col-span-4">
                    <p className="text-sm font-bold text-[#1E293B]">
                      {item.name}
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
                      {item.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
