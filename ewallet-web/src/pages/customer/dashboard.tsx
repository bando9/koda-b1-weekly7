import { ArrowUpRight, Plus } from "lucide-react"
import { Link, useOutletContext } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatToRupiah } from "@/utils"

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

interface TransactionItem {
  id: string
  title: string
  timestamp: string
  type: "Pemasukan" | "Pengeluaran"
  amount: number
  status: "Berhasil" | "Diproses" | "Gagal"
}

const RECENT_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-1",
    title: "Top up melalui QRIS",
    timestamp: "17 Nov 2026 · 09.34",
    type: "Pemasukan",
    amount: 250000,
    status: "Berhasil",
  },
  {
    id: "tx-2",
    title: "Transfer ke Bima Pratama",
    timestamp: "16 Nov 2026 · 14.20",
    type: "Pengeluaran",
    amount: 75000,
    status: "Berhasil",
  },
  {
    id: "tx-3",
    title: "Transfer dari Rina",
    timestamp: "15 Nov 2026 · 12.08",
    type: "Pemasukan",
    amount: 120000,
    status: "Berhasil",
  },
]

export default function CustomerDashboardPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Nadia"
  const initials = context?.initials ?? "NP"

  const balance = 1250000
  const walletNumber = "KW •••• 1842"

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            PERSONAL WALLET
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Beranda
          </h1>
          <p className="text-sm text-[#64748B]">
            Selasa, 17 November 2026 &nbsp;•&nbsp; Selamat datang kembali.
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-0 bg-[#135D54] text-white shadow-none lg:col-span-8">
          <CardContent className="flex h-full flex-col justify-between p-7 sm:p-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold tracking-wider text-white/80 uppercase">
                SALDO TERSEDIA
              </p>
              <p className="text-4xl font-bold tracking-tight sm:text-[42px]">
                {formatToRupiah(balance)}
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <p className="text-sm text-white/85">
                Nomor dompet &nbsp;·&nbsp;{" "}
                <span className="font-medium tracking-wide text-white">
                  {walletNumber}
                </span>
              </p>

              <div>
                <Badge className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#135D54] hover:bg-white">
                  <span className="h-2 w-2 rounded-full bg-[#135D54]" />
                  Aktif
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="flex h-full flex-col justify-between p-7">
            <div>
              <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                Aksi cepat
              </h2>
              <p className="text-xs text-[#64748B]">
                Transaksi yang sering digunakan
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                className="h-12 w-full justify-start gap-2.5 rounded-xl bg-[#135D54] px-4 text-sm font-semibold text-white shadow-none hover:bg-[#0F4C44]"
                render={
                  <Link to="/dashboard/top-up">
                    <Plus className="h-4 w-4" />
                    <span>Isi Saldo</span>
                  </Link>
                }
              ></Button>

              <Button
                variant="secondary"
                className="h-12 w-full justify-start gap-2.5 rounded-xl bg-[#EDF5F3] px-4 text-sm font-semibold text-[#135D54] shadow-none hover:bg-[#E1EFEA]"
                render={
                  <Link to="/dashboard/transfer">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>Transfer</span>
                  </Link>
                }
              ></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-none">
        <CardContent className="p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                Aktivitas terakhir
              </h2>
              <p className="text-xs text-[#64748B]">
                Pantau pergerakan uang di dompetmu
              </p>
            </div>

            <Link
              to="/dashboard/activities"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#135D54] hover:underline"
            >
              <span>Lihat semua</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {RECENT_TRANSACTIONS.map((tx) => {
              const isIncome = tx.type === "Pemasukan"
              return (
                <div
                  key={tx.id}
                  className="grid grid-cols-1 items-center gap-2 py-5 sm:grid-cols-12 sm:gap-4"
                >
                  <div className="sm:col-span-5">
                    <p className="text-sm font-semibold text-[#1E293B]">
                      {tx.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#94A3B8]">
                      {tx.timestamp}
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <span className="text-xs text-[#64748B]">{tx.type}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-sm font-semibold text-[#1E293B]">
                      {isIncome ? "+ " : "- "}
                      {formatToRupiah(tx.amount)}
                    </span>
                  </div>

                  <div className="sm:col-span-2 sm:text-right">
                    <span className="text-xs font-semibold text-[#135D54]">
                      {tx.status}
                    </span>
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
