import { useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UseAuth from "@/hooks/use-auth"
import { resolveDestination } from "@/lib/auth-route"
import { ApiError } from "@/service/auth-api"

interface LocationState {
  from?: { pathname: string }
  registeredMessage?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = UseAuth()

  const state = location.state as LocationState | null

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string
    password?: string
  }>({})

  const validateForm = (): boolean => {
    const errors: { identifier?: string; password?: string } = {}

    if (!identifier.trim()) {
      errors.identifier = "Email atau username wajib diisi."
    }

    if (!password) {
      errors.password = "Password wajib diisi."
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
      const session = await login({ identifier, password })
      navigate(resolveDestination(session.user.role, state?.from?.pathname), {
        replace: true,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage("Terjadi kesalahan saat mencoba masuk.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased lg:flex-row">
      <div className="flex min-h-72 w-full flex-col justify-between bg-[#135D54] px-8 py-10 text-white lg:min-h-screen lg:w-[41.67%] lg:px-14 lg:py-12">
        <div>
          <span className="text-xl font-bold tracking-tight">koda wallet</span>
        </div>

        <div className="my-auto max-w-sm py-12 lg:py-0">
          <h1 className="mb-4 text-4xl leading-[1.18] font-bold tracking-tight sm:text-[42px]">
            Uangmu,
            <br />
            lebih terarah.
          </h1>
          <p className="text-[15px] leading-relaxed font-normal text-white/85">
            Kelola saldo, kirim uang, dan lihat setiap transaksi dalam satu
            tempat.
          </p>
        </div>

        <div className="pt-4">
          <hr className="border-t border-white/40" />
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 sm:px-12 lg:w-[58.33%]">
        <div className="w-full max-w-105">
          <div className="mb-9">
            <h2 className="mb-1.5 text-[28px] font-bold tracking-tight text-[#1E293B]">
              Selamat datang kembali
            </h2>
            <p className="text-sm text-[#64748B]">
              Masuk untuk melanjutkan ke dompetmu.
            </p>
          </div>

          {state?.registeredMessage && !errorMessage && (
            <Alert className="mb-6 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-xs font-medium">
                {state.registeredMessage}
              </AlertDescription>
            </Alert>
          )}

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

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="identifier"
                className="text-xs font-medium text-[#64748B]"
              >
                Email atau username
              </Label>
              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                disabled={isLoading}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value)
                  if (fieldErrors.identifier) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      identifier: undefined,
                    }))
                  }
                }}
                placeholder="nadia@example.com"
                className={`h-11 rounded-lg border-transparent bg-transparent px-3 text-sm text-[#0F172A] shadow-none transition-colors placeholder:text-[#94A3B8] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                  fieldErrors.identifier
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "hover:bg-slate-50/80"
                }`}
              />
              {fieldErrors.identifier && (
                <p className="text-xs font-medium text-red-600">
                  {fieldErrors.identifier}
                </p>
              )}
            </div>

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
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }))
                    }
                  }}
                  placeholder="••••••••••••"
                  className={`h-11 rounded-lg border-transparent bg-transparent pr-10 pl-3 text-sm text-[#0F172A] shadow-none transition-colors placeholder:text-[#0F172A] focus-visible:border-[#135D54] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#135D54] ${
                    !showPassword && password ? "tracking-widest" : ""
                  } ${
                    fieldErrors.password
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "hover:bg-slate-50/80"
                  }`}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#64748B] transition-colors hover:text-[#0F172A] disabled:opacity-50"
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

              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#135D54] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full cursor-pointer justify-start rounded-lg bg-[#135D54] px-5 text-sm font-medium text-white shadow-none transition-all hover:bg-[#0F4C44] active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </span>
                ) : (
                  "Masuk ke akun"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-7 text-center">
            <p className="text-xs text-[#64748B]">
              Belum memiliki akun?{" "}
              <Link
                to="/register"
                className="ml-2 font-semibold text-[#135D54] hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
