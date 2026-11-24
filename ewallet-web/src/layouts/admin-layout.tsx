import { useState } from "react"
import { Menu } from "lucide-react"
import { Link, NavLink, Outlet, useNavigate } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UseAuth from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  to: string
  end?: boolean
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Ringkasan", to: "/admin", end: true },
  { label: "Pengguna", to: "/admin/users" },
  { label: "Profil", to: "/admin/profile" },
]

function AdminSidebarContent({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void
  onLogout: () => void
}) {
  return (
    <div className="flex h-full flex-col justify-between bg-white px-5 py-7">
      <div>
        <Link
          to="/admin"
          onClick={onNavigate}
          className="mb-9 flex items-center gap-2.5 px-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#135D54] text-lg font-bold text-white">
            k
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1E293B]">
            koda <span className="font-semibold text-[#135D54]">wallet</span>
          </span>
        </Link>

        <div className="mb-3 px-3">
          <p className="text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase">
            PENGELOLAAN
          </p>
        </div>

        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-xl px-4 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-[#EDF5F3] font-semibold text-[#135D54]"
                    : "font-medium text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-[#64748B] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            Keluar
          </button>
        </nav>
      </div>

      <Link
        to="/admin/help"
        onClick={onNavigate}
        className="block rounded-2xl bg-[#EDF5F3] p-4 transition-colors hover:bg-[#E2EFEA]"
      >
        <p className="mb-1 text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
          BUTUH BANTUAN?
        </p>
        <p className="mb-0.5 text-sm font-bold text-[#1E293B]">Pusat Bantuan</p>
        <p className="text-xs text-[#64748B]">Panduan dan informasi akun</p>
      </Link>
    </div>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = UseAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const displayName = user?.name || "Admin"
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD"

  const handleLogout = async () => {
    await logout?.()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7F6] font-sans antialiased">
      <aside className="hidden w-64 shrink-0 border-r border-slate-100 bg-white lg:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebarContent onLogout={handleLogout} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2.5">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Buka menu">
                    <Menu className="h-5 w-5 text-[#1E293B]" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Menu Navigasi Admin</SheetTitle>
                <AdminSidebarContent
                  onNavigate={() => setMobileOpen(false)}
                  onLogout={handleLogout}
                />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#135D54] text-sm font-bold text-white">
                k
              </div>
              <span className="text-base font-bold text-[#1E293B]">
                koda <span className="text-[#135D54]">wallet</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#F5F7F6] py-1 pr-3 pl-1.5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-[#135D54] text-[11px] font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold text-[#1E293B]">
              {displayName}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 lg:px-12 lg:py-10">
          <Outlet context={{ displayName, initials }} />
        </main>
      </div>
    </div>
  )
}
