import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "topup", label: "Top Up" },
  { id: "transfer", label: "Transfer" },
  { id: "transactions", label: "Transactions" },
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

export default function CustomerDetailPage({ onChangePassword }) {
  const [activeNav, setActiveNav] = useState("profile")
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Profil diperbarui:", {
      fullName: profile.fullName || "Nadia Putri",
      email: profile.email || "nadia@example.com",
      phone: profile.phone || "081234567890",
    })
  }

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
          PERSONAL WALLET
        </p>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
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
                Pengaturan Profil
              </h1>
              <p className="text-sm text-[#64748B]">
                Kelola informasi pribadi dan keamanan akun.
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
              <CardContent className="min-h-[410px] p-0">
                <h2 className="mb-6 text-[20px] font-bold tracking-tight text-[#0F172A]">
                  Informasi Pribadi
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="max-w-[540px] space-y-5"
                >
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="mb-2 block text-xs font-semibold text-[#475569]"
                    >
                      Nama lengkap
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={profile.fullName}
                      onChange={handleChange}
                      placeholder="Nadia Putri"
                      className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold text-[#475569]"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="nadia@example.com"
                      className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-semibold text-[#475569]"
                    >
                      Nomor Telepon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="081234567890"
                      className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                    />
                  </div>

                  <div className="pt-5">
                    <Button
                      type="submit"
                      className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#1652C8] active:scale-[0.99]"
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white p-7 shadow-none ring-0 lg:col-span-4">
              <CardContent className="min-h-[210px] p-0">
                <h2 className="mb-5 text-[18px] font-bold tracking-tight text-[#0F172A]">
                  Keamanan Akun
                </h2>

                <div className="mb-6">
                  <p className="mb-1.5 text-xs font-bold text-[#0F172A]">
                    Ubah password
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Gunakan password unik dan aman.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={onChangePassword}
                  className="h-11 w-full max-w-[260px] cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-xs font-semibold text-white shadow-none transition-all hover:bg-[#1652C8] active:scale-[0.99]"
                >
                  Ubah Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
