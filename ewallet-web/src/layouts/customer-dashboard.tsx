import React, { useState } from "react"
import { Plus, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const RECENT_TRANSACTIONS = [
  {
    id: 1,
    mobileTitle: "Top Up QRIS",
    desktopTitle: "Top up via QRIS",
    date: "17 Nov 2026",
    amount: "+ Rp250.000",
    isPositive: true,
    status: "SUCCESS",
  },
  {
    id: 2,
    mobileTitle: "Transfer ke Bima",
    desktopTitle: "Transfer to Bima",
    date: "16 Nov 2026",
    amount: "- Rp75.000",
    isPositive: false,
    status: "SUCCESS",
  },
  {
    id: 3,
    mobileTitle: "Transfer dari Rina",
    desktopTitle: "Transfer from Rina",
    date: "15 Nov 2026",
    amount: "+ Rp120.000",
    isPositive: true,
    status: "SUCCESS",
  },
]

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

export default function CustomerDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard")

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased lg:flex">
      <aside className="hidden bg-[#0F172A] px-4 py-7 text-white lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col">
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

      <main className="flex flex-1 justify-center lg:block">
        <div className="w-full max-w-[430px] px-6 py-8 lg:max-w-[1160px] lg:px-10 lg:py-9">
          <header className="mb-7 flex items-center gap-2.5 lg:hidden">
            <KodaLogo className="text-[#1D61E7]" />
            <span className="text-[20px] font-bold tracking-tight text-[#1D61E7]">
              KodaWallet
            </span>
          </header>

          <section className="mb-6 flex items-start justify-between lg:mb-8">
            <div>
              <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-[#0F172A] lg:hidden">
                <span>Halo, Nadia</span>
                <span className="text-2xl" role="img" aria-label="wave">
                  👋
                </span>
              </h1>

              <div className="hidden lg:block">
                <h1 className="mb-1 flex items-center gap-2 text-[28px] font-bold tracking-tight text-[#0F172A]">
                  <span>Selamat datang, Nadia</span>
                  <span className="text-2xl" role="img" aria-label="wave">
                    👋
                  </span>
                </h1>
                <p className="text-sm text-[#64748B]">
                  Kelola uangmu dengan aman, cepat, dan nyaman.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2.5 rounded-full bg-white px-4 py-2 lg:flex">
              <span className="text-xs font-bold text-[#0F172A]">NP</span>
              <span className="text-xs font-semibold text-[#0F172A]">
                Nadia
              </span>
            </div>
          </section>

          <div className="mb-6 lg:mb-7 lg:grid lg:grid-cols-12 lg:gap-6">
            <section className="mb-6 lg:col-span-8 lg:mb-0 lg:rounded-3xl lg:bg-white lg:p-4">
              <Card className="h-full rounded-3xl border-0 bg-[#1D61E7] px-6 py-7 text-white shadow-none ring-0 lg:rounded-2xl lg:px-7 lg:py-7">
                <CardContent className="flex min-h-[140px] flex-col justify-between p-0 lg:min-h-[168px]">
                  <p className="text-xs font-medium tracking-wider text-white/85 uppercase">
                    <span className="lg:hidden">TOTAL SALDO</span>
                    <span className="hidden lg:inline">TOTAL SALDO WALLET</span>
                  </p>

                  <p className="my-3 text-[32px] leading-none font-bold tracking-tight lg:text-[38px]">
                    Rp1.250.000
                  </p>

                  <div className="flex items-center gap-2.5 text-xs font-medium tracking-wide text-white/85">
                    <span>KW-****-1842</span>
                    <span className="hidden lg:inline">•</span>
                    <span className="hidden lg:inline">ACTIVE</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8 flex flex-col justify-between lg:col-span-4 lg:mb-0 lg:rounded-3xl lg:bg-white lg:p-6">
              <h2 className="mb-4 hidden text-[17px] font-bold text-[#0F172A] lg:block">
                Aksi Cepat
              </h2>

              <div className="my-auto grid grid-cols-2 gap-3.5 lg:grid-cols-1">
                <Button
                  type="button"
                  className="h-12 cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
                >
                  <Plus className="mr-2 hidden h-4 w-4 stroke-[2.5] lg:inline-block" />
                  <span>Top Up</span>
                </Button>

                <Button
                  type="button"
                  className="h-12 cursor-pointer justify-start rounded-xl bg-[#0891B2] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#0E7490]"
                >
                  <ArrowRight className="mr-2 hidden h-4 w-4 stroke-[2.5] lg:inline-block" />
                  <span>Transfer</span>
                </Button>
              </div>
            </section>
          </div>

          <section className="lg:rounded-3xl lg:bg-white lg:p-7">
            <div className="mb-4 flex items-center justify-between lg:mb-6">
              <h2 className="text-[19px] font-bold tracking-tight text-[#0F172A]">
                Transaksi Terbaru
              </h2>
              <a
                href="#transactions"
                className="hidden text-xs font-semibold text-[#1D61E7] hover:underline lg:inline-block"
              >
                Lihat semua transaksi
              </a>
            </div>

            <div className="space-y-3 lg:hidden">
              {RECENT_TRANSACTIONS.map((tx) => (
                <Card
                  key={tx.id}
                  className="rounded-2xl border-0 bg-white px-5 py-4 shadow-none ring-0"
                >
                  <CardContent className="p-0">
                    <p className="mb-1 text-sm font-bold text-[#0F172A]">
                      {tx.mobileTitle}
                    </p>
                    <p className="text-xs font-medium text-[#64748B]">
                      {tx.amount}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden divide-y divide-[#F1F5F9] lg:block">
              {RECENT_TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-12 items-center py-4 first:pt-2 last:pb-2"
                >
                  <div className="col-span-4 text-sm font-bold text-[#0F172A]">
                    {tx.desktopTitle}
                  </div>

                  <div className="col-span-3 text-xs font-medium text-[#64748B]">
                    {tx.date}
                  </div>

                  <div
                    className={`col-span-3 text-sm font-bold ${
                      tx.isPositive ? "text-[#16A34A]" : "text-[#0F172A]"
                    }`}
                  >
                    {tx.amount}
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Badge
                      variant="secondary"
                      className="rounded-full border-0 bg-[#DCFCE7] px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#15803D] hover:bg-[#DCFCE7]"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
