import { useState } from "react"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { Link, useOutletContext, useParams } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AdminLayoutContext {
  displayName: string
  initials: string
}

type AccountStatus = "Aktif" | "Ditangguhkan"

interface CustomerDetail {
  id: string
  fullName: string
  username: string
  initials: string
  email: string
  phone: string
  walletNumber: string
  registeredAt: string
  status: AccountStatus
}

const MOCK_CUSTOMER_DETAILS: Record<string, CustomerDetail> = {
  "usr-1": {
    id: "usr-1",
    fullName: "Nadia Putri",
    username: "nadia",
    initials: "NP",
    email: "nadia@example.com",
    phone: "0812 3456 7890",
    walletNumber: "KW •••• 1842",
    registeredAt: "10 November 2026",
    status: "Aktif",
  },
  "usr-2": {
    id: "usr-2",
    fullName: "Bima Pratama",
    username: "bima",
    initials: "BP",
    email: "bima@example.com",
    phone: "0813 9876 5432",
    walletNumber: "KW •••• 2941",
    registeredAt: "08 November 2026",
    status: "Aktif",
  },
  "usr-3": {
    id: "usr-3",
    fullName: "Rina Maharani",
    username: "rina",
    initials: "RM",
    email: "rina@example.com",
    phone: "0857 1122 3344",
    walletNumber: "KW •••• 5108",
    registeredAt: "05 November 2026",
    status: "Aktif",
  },
  "usr-4": {
    id: "usr-4",
    fullName: "Hendra Wijaya",
    username: "hendra",
    initials: "HW",
    email: "hendra@example.com",
    phone: "0821 4455 6677",
    walletNumber: "KW •••• 7730",
    registeredAt: "01 November 2026",
    status: "Ditangguhkan",
  },
  "usr-5": {
    id: "usr-5",
    fullName: "Dian Ayu",
    username: "dian",
    initials: "DA",
    email: "dian@example.com",
    phone: "0819 2233 4455",
    walletNumber: "KW •••• 9014",
    registeredAt: "29 Oktober 2026",
    status: "Aktif",
  },
}

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const context = useOutletContext<AdminLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Admin"
  const adminInitials = context?.initials ?? "AD"

  const initialCustomer =
    (userId && MOCK_CUSTOMER_DETAILS[userId]) || MOCK_CUSTOMER_DETAILS["usr-1"]

  const [customer, setCustomer] = useState<CustomerDetail>(initialCustomer)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null)

  const isActive = customer.status === "Aktif"

  const handleToggleAccountStatus = async () => {
    setIsUpdatingStatus(true)
    setStatusFeedback(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const nextStatus: AccountStatus = isActive ? "Ditangguhkan" : "Aktif"
      setCustomer((prev) => ({ ...prev, status: nextStatus }))
      setStatusFeedback(
        nextStatus === "Ditangguhkan"
          ? `Akun ${customer.fullName} berhasil ditangguhkan.`
          : `Akun ${customer.fullName} berhasil diaktifkan kembali.`
      )
      setIsConfirmOpen(false)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            PENGELOLAAN AKUN
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Detail pengguna
          </h1>
          <p className="text-sm text-[#64748B]">
            Informasi akun customer dan status aksesnya.
          </p>
        </div>

        <div className="hidden items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:flex">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#135D54] text-xs font-semibold text-white">
              {adminInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-[#1E293B]">
            {displayName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-8">
          <CardContent className="p-7 sm:p-9">
            <div className="mb-7">
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#135D54] transition-opacity hover:opacity-80"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke daftar</span>
              </Link>
            </div>

            {statusFeedback && (
              <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs font-medium">
                  {statusFeedback}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-7">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-[#135D54] text-base font-bold text-white">
                    {customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#1E293B]">
                    {customer.fullName}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    @{customer.username}
                  </p>
                </div>
              </div>

              <Badge
                className={cn(
                  "rounded-full px-4 py-1 text-[11px] font-semibold shadow-none",
                  isActive
                    ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                    : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                )}
              >
                {customer.status}
              </Badge>
            </div>

            <div className="mt-7 space-y-6 text-sm">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                <span className="text-xs text-[#64748B] sm:col-span-4">
                  Nama lengkap
                </span>
                <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                  {customer.fullName}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                <span className="text-xs text-[#64748B] sm:col-span-4">
                  Email
                </span>
                <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                  {customer.email}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                <span className="text-xs text-[#64748B] sm:col-span-4">
                  Telepon
                </span>
                <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                  {customer.phone}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                <span className="text-xs text-[#64748B] sm:col-span-4">
                  Nomor dompet
                </span>
                <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                  {customer.walletNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                <span className="text-xs text-[#64748B] sm:col-span-4">
                  Terdaftar sejak
                </span>
                <span className="text-xs font-bold text-[#1E293B] sm:col-span-8">
                  {customer.registeredAt}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="p-7 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-[#1E293B]">
              Status akun
            </h2>

            <div className="mb-4">
              <Badge
                className={cn(
                  "rounded-full px-4 py-1 text-[11px] font-semibold shadow-none",
                  isActive
                    ? "bg-[#E6F4EE] text-[#135D54] hover:bg-[#E6F4EE]"
                    : "bg-[#FDECEC] text-[#DC2626] hover:bg-[#FDECEC]"
                )}
              >
                {customer.status}
              </Badge>
            </div>

            <p className="text-xs leading-relaxed text-[#64748B]">
              {isActive
                ? "Menangguhkan akun akan membatasi akses dan transaksi."
                : "Akun saat ini ditangguhkan dan tidak dapat melakukan transaksi."}
            </p>

            <div className="mt-7">
              <Button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className={cn(
                  "h-12 w-full cursor-pointer justify-start rounded-xl px-5 text-xs font-semibold text-white shadow-none transition-all active:scale-[0.99]",
                  isActive
                    ? "bg-[#B54334] hover:bg-[#9E382B]"
                    : "bg-[#135D54] hover:bg-[#0F4C44]"
                )}
              >
                {isActive ? "Tangguhkan akun" : "Aktifkan kembali akun"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E293B]">
              {isActive ? "Tangguhkan akun?" : "Aktifkan kembali akun?"}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-[#64748B]">
              {isActive
                ? `Apakah Anda yakin ingin menangguhkan akun ${customer.fullName} (@${customer.username})? Pengguna tidak akan bisa masuk atau bertransaksi selama ditangguhkan.`
                : `Apakah Anda yakin ingin mengaktifkan kembali akun ${customer.fullName} (@${customer.username})?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdatingStatus}
              onClick={() => setIsConfirmOpen(false)}
              className="rounded-xl text-xs font-semibold text-[#64748B]"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={isUpdatingStatus}
              onClick={handleToggleAccountStatus}
              className={cn(
                "rounded-xl text-xs font-semibold text-white",
                isActive
                  ? "bg-[#B54334] hover:bg-[#9E382B]"
                  : "bg-[#135D54] hover:bg-[#0F4C44]"
              )}
            >
              {isUpdatingStatus ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Memproses...</span>
                </span>
              ) : isActive ? (
                "Ya, tangguhkan"
              ) : (
                "Ya, aktifkan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
