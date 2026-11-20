import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const TRANSACTIONS = [
  {
    id: 1,
    title: "Top Up via QRIS",
    date: "17 Nov 2026",
    amount: "+ Rp250.000",
    category: "Top Up",
  },
  {
    id: 2,
    title: "Transfer ke Bima",
    date: "16 Nov 2026",
    amount: "- Rp75.000",
    category: "Transfer",
  },
  {
    id: 3,
    title: "Transfer dari Rina",
    date: "15 Nov 2026",
    amount: "+ Rp120.000",
    category: "Transfer",
  },
  {
    id: 4,
    title: "Top Up Bank",
    date: "12 Nov 2026",
    amount: "+ Rp500.000",
    category: "Top Up",
  },
]

const FILTERS = ["Semua", "Top Up", "Transfer"]

export default function TransactionHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("Semua")

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    const matchesCategory =
      activeFilter === "Semua" || tx.category === activeFilter
    const matchesQuery = tx.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <div className="flex min-h-screen justify-center bg-[#F5F7FA] font-sans antialiased">
      {/* Mobile Viewport Container */}
      <div className="min-h-screen w-full max-w-[430px] bg-[#F5F7FA] px-6 py-8">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-[24px] font-bold tracking-tight text-[#0F172A]">
            Riwayat Transaksi
          </h1>
        </header>

        {/* Search Input (Shadcn Input) */}
        <section className="mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari referensi..."
            className="h-12 rounded-2xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
          />
        </section>

        {/* Category Filter Tabs */}
        <nav
          aria-label="Filter transaksi"
          className="mb-6 flex items-center gap-2.5 px-1"
        >
          {FILTERS.map((filter, index) => {
            const isActive = activeFilter === filter
            return (
              <React.Fragment key={filter}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setActiveFilter(filter)}
                  className={`h-auto cursor-pointer p-0 text-xs tracking-tight transition-colors hover:bg-transparent ${
                    isActive
                      ? "font-bold text-[#1D61E7]"
                      : "font-semibold text-[#1D61E7]/85 hover:text-[#1D61E7]"
                  }`}
                >
                  {filter}
                </Button>
                {index < FILTERS.length - 1 && (
                  <span className="text-xs font-bold text-[#1D61E7] select-none">
                    •
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        {/* Transaction List (Shadcn Card) */}
        <section className="space-y-3.5">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <Card
                key={tx.id}
                className="rounded-2xl border-0 bg-white px-5 py-4 shadow-none ring-0"
              >
                <CardContent className="p-0">
                  <p className="mb-1 text-[15px] font-bold text-[#0F172A]">
                    {tx.title}
                  </p>
                  <p className="mb-2 text-xs font-medium text-[#64748B]">
                    {tx.date}
                  </p>
                  <p className="pr-12 text-right text-xs font-bold text-[#1D61E7]">
                    {tx.amount}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="rounded-2xl border-0 bg-white px-5 py-8 text-center shadow-none ring-0">
              <CardContent className="p-0">
                <p className="text-xs font-medium text-[#64748B]">
                  Tidak ada transaksi yang sesuai.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
