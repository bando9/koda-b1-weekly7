import { useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import { useOutletContext } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

interface CustomerLayoutContext {
  displayName: string
  initials: string
}

export default function SettingsPage() {
  const context = useOutletContext<CustomerLayoutContext | undefined>()
  const displayName = context?.displayName ?? "Nadia"
  const initials = context?.initials ?? "NP"

  const [fullName, setFullName] = useState("Nadia Putri")
  const [username, setUsername] = useState("nadia")
  const [email, setEmail] = useState("nadia@example.com")
  const [phoneNumber, setPhoneNumber] = useState("0812 3456 7890")

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)

    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setProfileError("Nama lengkap, username, dan email wajib diisi.")
      return
    }

    setIsSavingProfile(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setProfileSuccess("Perubahan informasi profil berhasil disimpan.")
    } catch {
      setProfileError("Gagal menyimpan perubahan profil. Silakan coba lagi.")
    } finally {
      setIsSavingProfile(false)
    }
  }

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
      setProfileSuccess("Kata sandi akun berhasil diperbarui.")
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
            AKUN SAYA
          </p>
          <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-[#1E293B]">
            Pengaturan
          </h1>
          <p className="text-sm text-[#64748B]">
            Perbarui informasi pribadi dan keamanan akun.
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
            <div className="mb-7">
              <h2 className="mb-1 text-lg font-bold text-[#1E293B]">
                Informasi profil
              </h2>
              <p className="text-xs text-[#64748B]">
                Informasi ini akan tampil di profil akunmu.
              </p>
            </div>

            {profileError && (
              <Alert
                variant="destructive"
                className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-700"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs font-medium">
                  {profileError}
                </AlertDescription>
              </Alert>
            )}

            {profileSuccess && (
              <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs font-medium">
                  {profileSuccess}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="full-name"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Nama lengkap
                </Label>
                <Input
                  id="full-name"
                  type="text"
                  disabled={isSavingProfile}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (profileSuccess) setProfileSuccess(null)
                  }}
                  placeholder="Masukkan nama lengkap"
                  className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  disabled={isSavingProfile}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (profileSuccess) setProfileSuccess(null)
                  }}
                  placeholder="Masukkan username"
                  className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled={isSavingProfile}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (profileSuccess) setProfileSuccess(null)
                  }}
                  placeholder="nama@example.com"
                  className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone-number"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Nomor ponsel
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  disabled={isSavingProfile}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    if (profileSuccess) setProfileSuccess(null)
                  }}
                  placeholder="0812 3456 7890"
                  className="h-11 rounded-xl border-transparent bg-transparent px-3 text-sm font-medium text-[#1E293B] shadow-none transition-colors hover:bg-slate-50/80 focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#135D54] px-5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
                >
                  {isSavingProfile ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan perubahan...</span>
                    </span>
                  ) : (
                    "Simpan perubahan"
                  )}
                </Button>
              </div>
            </form>
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
                Ubah secara berkala untuk menjaga keamanan akunmu.
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
              Masukkan kata sandi saat ini dan kata sandi baru untuk akunmu.
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
                htmlFor="current-password"
                className="text-xs font-medium text-[#64748B]"
              >
                Kata sandi saat ini
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
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
                htmlFor="new-password"
                className="text-xs font-medium text-[#64748B]"
              >
                Kata sandi baru
              </Label>
              <Input
                id="new-password"
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
                htmlFor="confirm-password"
                className="text-xs font-medium text-[#64748B]"
              >
                Konfirmasi kata sandi baru
              </Label>
              <Input
                id="confirm-password"
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
