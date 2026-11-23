import { useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"
import { ApiError, loginUser } from "@/service/auth-api"

interface LocationState {
  from?: { pathname: string }
  registeredMessage?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // const { setSession } = useAuth()

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
      const session = await loginUser({ identifier, password })

      // setSession(session)

      const defaultDestination =
        session.user.role === "ADMIN" ? "/admin" : "/dashboard"
      const destination = state?.from?.pathname || defaultDestination

      navigate(destination, { replace: true })
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
      <div className="flex min-h-75 w-full flex-col justify-between bg-[#0F172A] px-8 py-10 text-white lg:min-h-screen lg:w-[46.8%] lg:px-14 lg:py-12">
        <div className="flex items-center gap-3">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-white"
          >
            <rect
              x="14"
              y="2.12132"
              width="16.8"
              height="16.8"
              rx="1.5"
              transform="rotate(45 14 2.12132)"
              stroke="currentColor"
              strokeWidth="2.2"
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
          <span className="text-[22px] font-bold tracking-tight">
            KodaWallet
          </span>
        </div>

        <div className="my-auto max-w-md py-12 lg:py-0">
          <h1 className="mb-4 text-3xl leading-[1.2] font-bold tracking-tight sm:text-4xl">
            Dompet digital untuk
            <br />
            aktivitas sehari-hari.
          </h1>
          <p className="text-base font-normal text-[#CBD5E1]">
            Mudah, aman, dan transparan.
          </p>
        </div>

        <div className="hidden h-8 lg:block" />
      </div>

      <div className="flex w-full items-center justify-center bg-white px-6 py-12 sm:px-12 lg:w-[53.2%]">
        <div className="w-full max-w-105">
          <div className="mb-8">
            <h2 className="mb-2 text-[28px] font-bold tracking-tight text-[#0F172A]">
              Masuk ke akunmu
            </h2>
            <p className="text-sm text-[#64748B]">
              Selamat datang kembali di KodaWallet.
            </p>
          </div>

          {state?.registeredMessage && !errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{state.registeredMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-xs font-semibold text-[#475569]"
              >
                Email atau Username
              </label>
              <input
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
                placeholder="Masukkan email atau username"
                className={`h-12 w-full rounded-xl bg-[#F1F5F9] px-4 text-sm text-[#0F172A] placeholder-[#64748B] transition-all focus:bg-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                  fieldErrors.identifier
                    ? "ring-2 ring-red-500 focus:ring-red-500"
                    : "focus:ring-[#1D61E7]"
                }`}
              />
              {fieldErrors.identifier && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {fieldErrors.identifier}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold text-[#475569]"
              >
                Password
              </label>
              <div className="relative">
                <input
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
                  placeholder="Masukkan password"
                  className={`h-12 w-full rounded-xl bg-[#F1F5F9] pr-11 pl-4 text-sm text-[#0F172A] placeholder-[#64748B] transition-all focus:bg-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    !showPassword && password ? "tracking-widest" : ""
                  } ${
                    fieldErrors.password
                      ? "ring-2 ring-red-500 focus:ring-red-500"
                      : "focus:ring-[#1D61E7]"
                  }`}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#64748B] transition-colors hover:text-[#0F172A] disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1D61E7] text-sm font-semibold text-white transition-all hover:bg-[#1652C8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  "Masuk ke KodaWallet"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-[#1D61E7]">
              Belum punya akun?{" "}
              <Link to="/register" className="ml-0.5 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
