import React, { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const TRANSACTIONS = [
  {
    id: 1,
    mobileTitle: "Top Up via QRIS",
    desktopTitle: "Top up via QRIS",
    date: "17 Nov 2026",
    amount: "+ Rp250.000",
    isPositive: true,
    category: "Top Up",
    status: "SUCCESS",
  },
  {
    id: 2,
    mobileTitle: "Transfer ke Bima",
    desktopTitle: "Transfer to Bima",
    date: "16 Nov 2026",
    amount: "- Rp75.000",
    isPositive: false,
    category: "Transfer",
    status: "SUCCESS",
  },
  {
    id: 3,
    mobileTitle: "Transfer dari Rina",
    desktopTitle: "Transfer from Rina",
    date: "15 Nov 2026",
    amount: "+ Rp120.000",
    isPositive: true,
    category: "Transfer",
    status: "SUCCESS",
  },
  {
    id: 4,
    mobileTitle: "Top Up Bank",
    desktopTitle: "Top up via Bank",
    date: "12 Nov 2026",
    amount: "+ Rp500.000",
    isPositive: true,
    category: "Top Up",
    status: "SUCCESS",
  },
]

const FILTERS = ["Semua", "Top Up", "Transfer"]

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

export default function TransactionHistoryPage() {
  const [activeNav, setActiveNav] = useState("transactions")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("Semua")
  const [statusFilter, setStatusFilter] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    const matchesCategory =
      activeFilter === "Semua" || tx.category === activeFilter
    const matchesStatus = statusFilter === "Semua" || tx.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchesQuery =
      tx.mobileTitle.toLowerCase().includes(q) ||
      tx.desktopTitle.toLowerCase().includes(q)

    return matchesCategory && matchesStatus && matchesQuery
  })

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans antialiased md:flex">
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
          <header className="mb-6 flex items-start justify-between lg:mb-8">
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-[#0F172A] lg:mb-1 lg:text-[28px]">
                Riwayat Transaksi
              </h1>
              <p className="hidden text-sm text-[#64748B] lg:block">
                Pantau seluruh pemasukan dan pengeluaran wallet.
              </p>
            </div>

            <div className="hidden items-center gap-2.5 rounded-full bg-white px-4 py-2 lg:flex">
              <span className="text-xs font-bold text-[#0F172A]">NP</span>
              <span className="text-xs font-semibold text-[#0F172A]">
                Nadia
              </span>
            </div>
          </header>

          <div className="lg:hidden">
            <section className="mb-6">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari referensi..."
                className="h-12 rounded-2xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
              />
            </section>

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

            <section className="space-y-3.5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <Card
                    key={tx.id}
                    className="rounded-2xl border-0 bg-white px-5 py-4 shadow-none ring-0"
                  >
                    <CardContent className="p-0">
                      <p className="mb-1 text-[15px] font-bold text-[#0F172A]">
                        {tx.mobileTitle}
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

          <Card className="hidden rounded-3xl border-0 bg-white p-8 shadow-none ring-0 lg:block">
            <CardContent className="p-0">
              <h2 className="mb-6 text-[20px] font-bold tracking-tight text-[#0F172A]">
                Semua Transaksi
              </h2>

              <div className="mb-7 grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nomor referensi..."
                    className="h-11 rounded-xl border-0 bg-[#F1F5F9] px-4 text-xs text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                  />
                </div>

                <div className="col-span-3">
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F1F5F9] px-4 text-xs font-medium text-[#0F172A] shadow-none ring-0 focus:ring-2 focus:ring-[#1D61E7] [&>svg]:hidden">
                      <SelectValue placeholder="Tipe: Semua">
                        Tipe: {activeFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua">Tipe: Semua</SelectItem>
                      <SelectItem value="Top Up">Tipe: Top Up</SelectItem>
                      <SelectItem value="Transfer">Tipe: Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F1F5F9] px-4 text-xs font-medium text-[#0F172A] shadow-none ring-0 focus:ring-2 focus:ring-[#1D61E7] [&>svg]:hidden">
                      <SelectValue placeholder="Status: Semua">
                        Status: {statusFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua">Status: Semua</SelectItem>
                      <SelectItem value="SUCCESS">Status: SUCCESS</SelectItem>
                      <SelectItem value="PENDING">Status: PENDING</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="min-h-[290px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
                      <TableHead className="w-[34%] pl-2 text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                        TRANSAKSI
                      </TableHead>
                      <TableHead className="w-[24%] text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                        TANGGAL
                      </TableHead>
                      <TableHead className="w-[26%] text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                        JUMLAH
                      </TableHead>
                      <TableHead className="w-[16%] text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                        STATUS
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.slice(0, 3).map((tx) => (
                        <TableRow
                          key={tx.id}
                          className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/60"
                        >
                          <TableCell className="py-5 pl-2 text-sm font-bold text-[#0F172A]">
                            {tx.desktopTitle}
                          </TableCell>

                          <TableCell className="py-5 text-xs font-medium text-[#64748B]">
                            {tx.date}
                          </TableCell>

                          <TableCell
                            className={`py-5 text-sm font-bold ${
                              tx.isPositive
                                ? "text-[#16A34A]"
                                : "text-[#0F172A]"
                            }`}
                          >
                            {tx.amount}
                          </TableCell>

                          <TableCell className="py-5">
                            <Badge
                              variant="secondary"
                              className="rounded-full border-0 bg-[#DCFCE7] px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#15803D] hover:bg-[#DCFCE7]"
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-12 text-center text-xs font-medium text-[#64748B]"
                        >
                          Tidak ada transaksi yang sesuai.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-8 flex items-center justify-end gap-6 pr-6 text-xs">
                <span className="font-medium text-[#64748B]">
                  Halaman {currentPage} dari {totalPages}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="cursor-pointer text-[#0F172A] hover:opacity-75 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>

                  {[1, 2, 3, 4].map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`cursor-pointer transition-colors ${
                        currentPage === page
                          ? "font-bold text-[#0F172A]"
                          : "font-medium text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Halaman berikutnya"
                    className="cursor-pointer text-[#0F172A] hover:opacity-75 disabled:opacity-40"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
