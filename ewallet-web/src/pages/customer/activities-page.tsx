import { useMemo, useState } from "react"
import { useOutletContext } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

type TransactionType = "TOP UP" | "TRANSFER"
type TransactionDirection = "IN" | "OUT"
type TransactionStatus = "Berhasil" | "Diproses" | "Gagal"

interface ActivityTransaction {
  id: string
  title: string
  referenceNumber: string
  type: TransactionType
  direction: TransactionDirection
  amount: number
  status: TransactionStatus
  dateRangeGroup: "7d" | "30d" | "90d"
}

const MOCK_ACTIVITIES: ActivityTransaction[] = [
  {
    id: "act-1",
    title: "Top up melalui QRIS",
    referenceNumber: "TRX-20261117-1051",
    type: "TOP UP",
    direction: "IN",
    amount: 250000,
    status: "Berhasil",
    dateRangeGroup: "7d",
  },
  {
    id: "act-2",
    title: "Transfer ke Bima Pratama",
    referenceNumber: "TRX-20261116-1037",
    type: "TRANSFER",
    direction: "OUT",
    amount: 75000,
    status: "Berhasil",
    dateRangeGroup: "7d",
  },
  {
    id: "act-3",
    title: "Transfer dari Rina",
    referenceNumber: "TRX-20261115-1004",
    type: "TRANSFER",
    direction: "IN",
    amount: 120000,
    status: "Berhasil",
    dateRangeGroup: "7d",
  },
  {
    id: "act-4",
    title: "Isi saldo melalui bank",
    referenceNumber: "TRX-20261114-1012",
    type: "TOP UP",
    direction: "IN",
    amount: 500000,
    status: "Berhasil",
    dateRangeGroup: "7d",
  },
  {
    id: "act-5",
    title: "Transfer ke Dimas Saputra",
    referenceNumber: "TRX-20261110-0988",
    type: "TRANSFER",
    direction: "OUT",
    amount: 150000,
    status: "Berhasil",
    dateRangeGroup: "30d",
  },
  {
    id: "act-6",
    title: "Top up melalui QRIS",
    referenceNumber: "TRX-20261108-0942",
    type: "TOP UP",
    direction: "IN",
    amount: 300000,
    status: "Berhasil",
    dateRangeGroup: "30d",
  },
  {
    id: "act-7",
    title: "Transfer dari Sari",
    referenceNumber: "TRX-20261105-0915",
    type: "TRANSFER",
    direction: "IN",
    amount: 85000,
    status: "Berhasil",
    dateRangeGroup: "30d",
  },
  {
    id: "act-8",
    title: "Isi saldo melalui bank",
    referenceNumber: "TRX-20261102-0871",
    type: "TOP UP",
    direction: "IN",
    amount: 400000,
    status: "Berhasil",
    dateRangeGroup: "30d",
  },
  {
    id: "act-9",
    title: "Transfer ke Andi Wijaya",
    referenceNumber: "TRX-20261028-0810",
    type: "TRANSFER",
    direction: "OUT",
    amount: 210000,
    status: "Berhasil",
    dateRangeGroup: "90d",
  },
  {
    id: "act-10",
    title: "Top up melalui QRIS",
    referenceNumber: "TRX-20261024-0794",
    type: "TOP UP",
    direction: "IN",
    amount: 100000,
    status: "Berhasil",
    dateRangeGroup: "90d",
  },
  {
    id: "act-11",
    title: "Transfer ke Bima Pratama",
    referenceNumber: "TRX-20261020-0752",
    type: "TRANSFER",
    direction: "OUT",
    amount: 50000,
    status: "Berhasil",
    dateRangeGroup: "90d",
  },
  {
    id: "act-12",
    title: "Isi saldo melalui bank",
    referenceNumber: "TRX-20261015-0719",
    type: "TOP UP",
    direction: "IN",
    amount: 750000,
    status: "Berhasil",
    dateRangeGroup: "90d",
  },
]

const ITEMS_PER_PAGE = 4

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount)
}

export default function ActivitiesPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Nadia"
  const initials = context?.initials ?? "NP"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Filter data transaksi berdasarkan pencarian & dropdown
  const filteredTransactions = useMemo(() => {
    return MOCK_ACTIVITIES.filter((item) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        item.referenceNumber.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)

      const matchesType = selectedType === "all" || item.type === selectedType

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus

      const matchesDate =
        selectedDateRange === "all" ||
        (selectedDateRange === "7d" && item.dateRangeGroup === "7d") ||
        (selectedDateRange === "30d" &&
          (item.dateRangeGroup === "7d" || item.dateRangeGroup === "30d")) ||
        selectedDateRange === "90d"

      return matchesSearch && matchesType && matchesStatus && matchesDate
    })
  }, [searchQuery, selectedType, selectedStatus, selectedDateRange])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedTransactions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredTransactions, safeCurrentPage])

  const handleFilterChange =
    (setter: (val: string) => void) => (val: string) => {
      setter(val)
      setCurrentPage(1)
    }

  return (
    <div className="space-y-8">
      {/* Header Halaman + Pil Profil Desktop */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            RIWAYAT TRANSAKSI
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Aktivitas
          </h1>
          <p className="text-sm text-[#64748B]">
            Lihat riwayat transaksi dan mutasi saldo.
          </p>
        </div>

        {/* Pil Profil Pengguna (Desktop) */}
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

      {/* Kartu Utama Riwayat Transaksi */}
      <Card className="rounded-3xl border-0 bg-white shadow-none">
        <CardContent className="p-7 sm:p-9">
          <h2 className="mb-6 text-lg font-bold text-[#1E293B]">
            Riwayat transaksi
          </h2>

          {/* Baris Pencarian & Filter */}
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
            {/* Input Cari Nomor Referensi */}
            <div className="sm:col-span-2 lg:col-span-5">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Cari nomor referensi..."
                className="h-11 rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs text-[#1E293B] shadow-none placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#135D54]"
              />
            </div>

            {/* Filter Tipe */}
            <div className="lg:col-span-2">
              <Select
                value={selectedType}
                onValueChange={handleFilterChange(setSelectedType)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Semua tipe" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Semua tipe
                  </SelectItem>
                  <SelectItem value="TOP UP" className="text-xs">
                    Top up
                  </SelectItem>
                  <SelectItem value="TRANSFER" className="text-xs">
                    Transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Status */}
            <div className="lg:col-span-2">
              <Select
                value={selectedStatus}
                onValueChange={handleFilterChange(setSelectedStatus)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Semua status
                  </SelectItem>
                  <SelectItem value="Berhasil" className="text-xs">
                    Berhasil
                  </SelectItem>
                  <SelectItem value="Diproses" className="text-xs">
                    Diproses
                  </SelectItem>
                  <SelectItem value="Gagal" className="text-xs">
                    Gagal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Rentang Tanggal */}
            <div className="sm:col-span-2 lg:col-span-3">
              <Select
                value={selectedDateRange}
                onValueChange={handleFilterChange(setSelectedDateRange)}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-[#F5F7F6] px-4 text-xs font-medium text-[#1E293B] shadow-none focus:ring-1 focus:ring-[#135D54]">
                  <SelectValue placeholder="Rentang tanggal" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs">
                    Rentang tanggal
                  </SelectItem>
                  <SelectItem value="7d" className="text-xs">
                    7 hari terakhir
                  </SelectItem>
                  <SelectItem value="30d" className="text-xs">
                    30 hari terakhir
                  </SelectItem>
                  <SelectItem value="90d" className="text-xs">
                    90 hari terakhir
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Header Kolom Tabel (Desktop) */}
          <div className="hidden grid-cols-12 border-b border-slate-100 pb-3.5 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase sm:grid">
            <div className="col-span-5">TRANSAKSI</div>
            <div className="col-span-3">JENIS</div>
            <div className="col-span-2">NOMINAL</div>
            <div className="col-span-2 text-right">STATUS</div>
          </div>

          {/* Daftar Transaksi */}
          {paginatedTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#64748B]">
                Tidak ada transaksi yang sesuai dengan filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {paginatedTransactions.map((tx) => {
                const isIncoming = tx.direction === "IN"
                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-1 items-center gap-2.5 py-5 sm:grid-cols-12 sm:gap-4"
                  >
                    {/* Judul & Nomor Referensi */}
                    <div className="sm:col-span-5">
                      <p className="text-sm font-bold text-[#1E293B]">
                        {tx.title}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#94A3B8]">
                        {tx.referenceNumber}
                      </p>
                    </div>

                    {/* Jenis Transaksi */}
                    <div className="sm:col-span-3">
                      <span className="text-[11px] font-medium tracking-wide text-[#64748B] uppercase">
                        {tx.type}
                      </span>
                    </div>

                    {/* Nominal */}
                    <div className="sm:col-span-2">
                      <span className="text-sm font-bold text-[#1E293B]">
                        {isIncoming ? "+ " : "- "}Rp{formatRupiah(tx.amount)}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="sm:col-span-2 sm:text-right">
                      <Badge
                        className={cn(
                          "rounded-full px-3.5 py-1 text-[11px] font-semibold shadow-none",
                          tx.status === "Berhasil" &&
                            "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]",
                          tx.status === "Diproses" &&
                            "bg-amber-50 text-amber-700 hover:bg-amber-50",
                          tx.status === "Gagal" &&
                            "bg-red-50 text-red-700 hover:bg-red-50"
                        )}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Footer: Info Jumlah Data & Kontrol Paginasi */}
          <div className="mt-7 flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <p className="text-xs text-[#64748B]">
              Menampilkan {paginatedTransactions.length} dari{" "}
              {filteredTransactions.length} transaksi
            </p>

            {/* Pil Paginasi */}
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#EDF5F3] px-4 py-2.5 text-xs">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1
                const isActive = page === safeCurrentPage
                return (
                  <div key={page} className="inline-flex items-center gap-1.5">
                    {index > 0 && (
                      <span className="text-[#135D54]/40 select-none">·</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                aria-label="Halaman berikutnya"
                className="ml-1 cursor-pointer text-[#135D54] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35"
              >
                →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
