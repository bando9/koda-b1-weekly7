import { useState, type FormEvent } from "react"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/service/auth-api"

interface RegisterFieldErrors {
  fullName?: string
  username?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: RegisterFieldErrors = {}

    if (!fullName.trim()) {
      errors.fullName = "Nama lengkap wajib diisi."
    }

    if (!username.trim()) {
      errors.username = "Username wajib diisi."
    } else if (/\s/.test(username)) {
      errors.username = "Username tidak boleh mengandung spasi."
    }

    if (!email.trim()) {
      errors.email = "Email wajib diisi."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Format email tidak valid."
    }

    if (!phone.trim()) {
      errors.phone = "Nomor telepon wajib diisi."
    }

    if (!password) {
      errors.password = "Password wajib diisi."
    } else if (password.length < 8) {
      errors.password = "Password minimal 8 karakter."
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Konfirmasi password wajib diisi."
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak cocok."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 650))

      navigate("/login", {
        replace: true,
        state: {
          registeredMessage:
            "Pendaftaran berhasil! Dompet digitalmu sudah aktif, silakan masuk.",
        },
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage("Terjadi kesalahan saat mendaftarkan akun.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased lg:flex-row">
      <div className="flex min-h-64 w-full flex-col justify-center bg-[#135D54] px-8 py-12 text-white lg:min-h-screen lg:w-[36.11%] lg:px-14">
        <div className="max-w-xs">
          <h1 className="mb-4 text-4xl leading-[1.18] font-bold tracking-tight sm:text-[42px]">
            Satu akun,
            <br />
            satu dompet.
          </h1>
          <p className="text-[15px] leading-relaxed font-normal text-white/85">
            Dompet digital akan otomatis dibuat setelah pendaftaran berhasil.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12 lg:w-[63.89%]">
        <div className="w-full max-w-150">
          <div className="mb-9">
            <h2 className="mb-1.5 text-[28px] font-bold tracking-tight text-[#1E293B]">
              Buat akun KodaWallet
            </h2>
            <p className="text-sm text-[#64748B]">
              Isi data pribadi untuk mulai menggunakan dompet.
            </p>
          </div>

          {errorMessage && (
            <Alert
              variant="destructive"
              className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-700"
            >
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs font-medium">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Nama lengkap
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  disabled={isLoading}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    clearFieldError("fullName")
                  }}
                  placeholder="Nadia Putri"
                  className={`h-11 rounded-lg border-transparent bg-transparent px-3 text-sm text-[#1E293B] shadow-none transition-colors placeholder:text-[#475569] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                    fieldErrors.fullName
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "hover:bg-slate-50/80"
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.fullName}
                  </p>
                )}
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
                  autoComplete="username"
                  disabled={isLoading}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    clearFieldError("username")
                  }}
                  placeholder="nadia"
                  className={`h-11 rounded-lg border-transparent bg-transparent px-3 text-sm text-[#1E293B] shadow-none transition-colors placeholder:text-[#475569] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                    fieldErrors.username
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "hover:bg-slate-50/80"
                  }`}
                />
                {fieldErrors.username && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.username}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  autoComplete="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError("email")
                  }}
                  placeholder="nadia@example.com"
                  className={`h-11 rounded-lg border-transparent bg-transparent px-3 text-sm text-[#1E293B] shadow-none transition-colors placeholder:text-[#475569] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                    fieldErrors.email
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "hover:bg-slate-50/80"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Nomor telepon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={isLoading}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    clearFieldError("phone")
                  }}
                  placeholder="0812 3456 7890"
                  className={`h-11 rounded-lg border-transparent bg-transparent px-3 text-sm text-[#1E293B] shadow-none transition-colors placeholder:text-[#475569] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                    fieldErrors.phone
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "hover:bg-slate-50/80"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError("password")
                    }}
                    placeholder="Minimal 8 karakter"
                    className={`h-11 rounded-lg border-transparent bg-transparent pr-10 pl-3 text-sm text-[#1E293B] shadow-none transition-colors placeholder:text-[#475569] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                      fieldErrors.password
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        : "hover:bg-slate-50/80"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Lihat password"
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#64748B] transition-colors hover:text-[#1E293B] disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-[#64748B]"
                >
                  Konfirmasi password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearFieldError("confirmPassword")
                    }}
                    placeholder="Ulangi password"
                    className={`h-11 rounded-lg border-transparent bg-transparent pr-10 pl-3 text-sm text-[#1E293B] shadow-none transition-colors placeholder:text-[#475569] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                      fieldErrors.confirmPassword
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        : "hover:bg-slate-50/80"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi password"
                        : "Lihat konfirmasi password"
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#64748B] transition-colors hover:text-[#1E293B] disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <p className="pt-2 text-xs text-[#64748B]">
              Akun baru akan mendapatkan dompet aktif dengan saldo Rp0.
            </p>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full cursor-pointer justify-start rounded-lg bg-[#135D54] px-5 text-sm font-medium text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mendaftarkan akun...</span>
                  </span>
                ) : (
                  "Buat akun"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-7 text-center">
            <p className="text-xs font-semibold text-[#135D54]">
              Sudah terdaftar?{" "}
              <Link to="/login" className="ml-1 hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
