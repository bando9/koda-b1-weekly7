import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("••••••••••••")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ identifier, password })
  }

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased lg:flex-row">
      {/* Left Panel (Branding) */}
      <div className="flex min-h-[300px] w-full flex-col justify-between bg-[#0F172A] px-8 py-10 text-white lg:min-h-screen lg:w-[46.8%] lg:px-14 lg:py-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Custom Diamond Logo matching screenshot */}
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

        {/* Hero Copy */}
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

        {/* Bottom Spacer to align hero text vertically like the design */}
        <div className="hidden h-8 lg:block" />
      </div>

      {/* Right Panel (Login Form) */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 sm:px-12 lg:w-[53.2%]">
        <div className="w-full max-w-[420px]">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="mb-2 text-[28px] font-bold tracking-tight text-[#0F172A]">
              Masuk ke akunmu
            </h2>
            <p className="text-sm text-[#64748B]">
              Selamat datang kembali di KodaWallet.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email atau Username */}
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
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email atau username"
                className="h-12 w-full rounded-xl bg-[#F1F5F9] px-4 text-sm text-[#0F172A] placeholder-[#64748B] transition-all focus:bg-white focus:ring-2 focus:ring-[#1D61E7] focus:outline-none"
              />
            </div>

            {/* Password */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="h-12 w-full rounded-xl bg-[#F1F5F9] pr-11 pl-4 text-sm tracking-widest text-[#0F172A] placeholder-[#64748B] transition-all focus:bg-white focus:ring-2 focus:ring-[#1D61E7] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#64748B] transition-colors hover:text-[#0F172A]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="h-12 w-full cursor-pointer rounded-xl bg-[#1D61E7] text-sm font-semibold text-white transition-all hover:bg-[#1652C8] active:scale-[0.99]"
              >
                Masuk ke KodaWallet
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-[#1D61E7]">
              Belum punya akun?{" "}
              <a href="#daftar" className="ml-0.5 hover:underline">
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
