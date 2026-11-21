import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ADMIN_NAV_ITEMS = [
  { id: "users", label: "User Management" },
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" },
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

export default function AdminUserDetailPage() {
  const [activeNav, setActiveNav] = useState("users")
  const [isSuspended, setIsSuspended] = useState(false)

  const userDetails = [
    { label: "Username", value: "nadia" },
    { label: "Email", value: "nadia@example.com" },
    { label: "Phone", value: "081234567890" },
    { label: "Wallet", value: "KW-****-1842" },
    { label: "Tanggal daftar", value: "10 Nov 2026" },
  ]

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
                Detail Pengguna
              </h1>
              <p className="text-sm text-[#64748B]">
                Informasi user dan pengaturan status akun.
              </p>
            </div>

            <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2">
              <span className="text-xs font-bold text-[#0F172A]">NP</span>
              <span className="text-xs font-semibold text-[#0F172A]">
                Nadia
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <Card className="rounded-3xl border-0 bg-white p-8 shadow-none ring-0 lg:col-span-8">
              <CardContent className="min-h-[380px] p-0">
                <div className="mb-8 flex max-w-md items-center justify-between">
                  <h2 className="text-[22px] font-bold tracking-tight text-[#0F172A]">
                    Nadia Putri
                  </h2>

                  {isSuspended ? (
                    <Badge
                      variant="secondary"
                      className="rounded-full border-0 bg-[#FEE2E2] px-4 py-1 text-[11px] font-bold tracking-wide text-[#DC2626] hover:bg-[#FEE2E2]"
                    >
                      SUSPENDED
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="rounded-full border-0 bg-[#DCFCE7] px-4 py-1 text-[11px] font-bold tracking-wide text-[#15803D] hover:bg-[#DCFCE7]"
                    >
                      ACTIVE
                    </Badge>
                  )}
                </div>

                <dl className="space-y-6">
                  {userDetails.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-12 items-center"
                    >
                      <dt className="col-span-4 text-xs font-medium text-[#64748B]">
                        {item.label}
                      </dt>
                      <dd className="col-span-8 text-sm font-bold text-[#0F172A]">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white p-7 shadow-none ring-0 lg:col-span-4">
              <CardContent className="p-0">
                <h2 className="mb-3 text-[18px] font-bold tracking-tight text-[#0F172A]">
                  Kelola Status
                </h2>

                <p className="mb-7 max-w-[240px] text-xs leading-relaxed text-[#64748B]">
                  {isSuspended
                    ? "Akun sedang ditangguhkan. Aktifkan kembali untuk memulihkan akses."
                    : "Penangguhan akan membatasi akses transaksi pengguna."}
                </p>

                <Button
                  type="button"
                  onClick={() => setIsSuspended(!isSuspended)}
                  className={`h-11 w-full cursor-pointer justify-start rounded-xl px-5 text-xs font-semibold text-white shadow-none transition-colors ${
                    isSuspended
                      ? "bg-[#16A34A] hover:bg-[#15803D]"
                      : "bg-[#DC2626] hover:bg-[#B91C1C]"
                  }`}
                >
                  {isSuspended ? "Activate Account" : "Suspend Account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
