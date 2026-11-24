import { useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import { useOutletContext } from "react-router"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UseAuth from "@/hooks/use-auth"

interface AdminLayoutContext {
  displayName: string
  initials: string
}

export default function AdminProfilePage() {
  const { user } = UseAuth()
  const context = useOutletContext<AdminLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Admin"
  const initials = context?.initials ?? "AD"

  const adminProfile = {
    fullName: user?.name || "Admin KodaWallet",
    username: user?.username || "admin",
    email: user?.email || "admin@kodawallet.com",
    role: "Administrator",
    status: "Aktif",
  }

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const handleOpenPasswordModal = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError(null)
    setShowPasswords(false)
    setIsPasswordModalOpen(true)
  }

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua kolom kata sandi wajib diisi.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Kata sandi baru minimal 8 karakter.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru tidak cocok.")
      return
    }

    setIsSavingPassword(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setIsPasswordModalOpen(false)
      setPasswordSuccess("Kata sandi akun admin berhasil diperbarui.")
    } catch {
      setPasswordError("Gagal memperbarui kata sandi. Silakan coba lagi.")
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-[#135D54] uppercase">
            ADMIN AREA
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Profil
          </h1>
          <p className="text-sm text-[#64748B]">
            Informasi akun administrator dan pengaturan keamanan akses.
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-8">
          <CardContent className="p-7 sm:p-9">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                  Informasi profil
                </h2>
                <p className="text-xs text-[#64748B]">
                  Data identitas akun administrator (hanya baca).
                </p>
              </div>

              <Badge className="rounded-full bg-[#E6F4EE] px-3.5 py-1 text-[11px] font-semibold text-[#135D54] shadow-none hover:bg-[#E6F4EE]">
                {adminProfile.status}
              </Badge>
            </div>

            {passwordSuccess && (
              <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs font-medium">
                  {passwordSuccess}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#64748B]">
                  Nama lengkap
                </p>
                <p className="px-1 py-1.5 text-sm font-semibold text-[#1E293B]">
                  {adminProfile.fullName}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#64748B]">Username</p>
                <p className="px-1 py-1.5 text-sm font-semibold text-[#1E293B]">
                  @{adminProfile.username}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#64748B]">Email</p>
                <p className="px-1 py-1.5 text-sm font-semibold text-[#1E293B]">
                  {adminProfile.email}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#64748B]">
                  Peran akses
                </p>
                <p className="px-1 py-1.5 text-sm font-semibold text-[#1E293B]">
                  {adminProfile.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-none lg:col-span-4">
          <CardContent className="p-7 sm:p-8">
            <h2 className="mb-6 text-lg font-bold text-[#1E293B]">
              Keamanan akun
            </h2>

            <div className="space-y-1.5">
              <p className="text-sm font-bold text-[#1E293B]">Kata sandi</p>
              <p className="text-xs leading-relaxed text-[#64748B]">
                Ubah secara berkala untuk menjaga keamanan akses administrator.
              </p>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenPasswordModal}
                className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#EDF5F3] px-4 text-sm font-semibold text-[#135D54] shadow-none transition-colors hover:bg-[#E1EFEA]"
              >
                Ubah kata sandi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E293B]">
              Ubah kata sandi
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Masukkan kata sandi saat ini dan kata sandi baru untuk akun admin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4 py-1">
            {passwordError && (
              <Alert
                variant="destructive"
                className="rounded-xl border-red-200 bg-red-50 text-red-700"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs font-medium">
                  {passwordError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="admin-current-password"
                className="text-xs font-medium text-[#64748B]"
              >
                Kata sandi saat ini
              </Label>
              <div className="relative">
                <Input
                  id="admin-current-password"
                  type={showPasswords ? "text" : "password"}
                  disabled={isSavingPassword}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 rounded-xl pr-10 text-sm focus-visible:border-[#135D54] focus-visible:ring-[#135D54]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => !prev)}
                  aria-label={
                    showPasswords
                      ? "Sembunyikan kata sandi"
                      : "Lihat kata sandi"
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B]"
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="admin-new-password"
                className="text-xs font-medium text-[#64748B]"
              >
                Kata sandi baru
              </Label>
              <Input
                id="admin-new-password"
                type={showPasswords ? "text" : "password"}
                disabled={isSavingPassword}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="h-10 rounded-xl text-sm focus-visible:border-[#135D54] focus-visible:ring-[#135D54]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="admin-confirm-password"
                className="text-xs font-medium text-[#64748B]"
              >
                Konfirmasi kata sandi baru
              </Label>
              <Input
                id="admin-confirm-password"
                type={showPasswords ? "text" : "password"}
                disabled={isSavingPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="h-10 rounded-xl text-sm focus-visible:border-[#135D54] focus-visible:ring-[#135D54]"
              />
            </div>

            <DialogFooter className="gap-2 pt-2 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                disabled={isSavingPassword}
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-xl text-xs font-semibold text-[#64748B]"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSavingPassword}
                className="rounded-xl bg-[#135D54] text-xs font-semibold text-white hover:bg-[#0F4C44]"
              >
                {isSavingPassword ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </span>
                ) : (
                  "Simpan kata sandi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
