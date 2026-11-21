import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function KodaLogo({ className = "" }) {
  return (
    <svg
      width="26"
      height="26"
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
  )
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Register Data:", formData)
  }

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased lg:flex-row">
      <div className="flex min-h-[280px] w-full flex-col justify-between bg-[#1D61E7] px-8 py-10 text-white lg:min-h-screen lg:w-[37.5%] lg:px-14 lg:py-12">
        <div className="flex items-center gap-3">
          <KodaLogo className="text-white" />
          <span className="text-[22px] font-bold tracking-tight">
            KodaWallet
          </span>
        </div>

        <div className="my-auto max-w-sm py-10 lg:py-0">
          <h1 className="mb-4 text-3xl leading-[1.22] font-bold tracking-tight sm:text-[34px]">
            Mulai perjalanan
            <br />
            finansialmu.
          </h1>
          <p className="text-sm font-normal text-white/85 sm:text-[15px]">
            Buat akun dan dapatkan wallet otomatis.
          </p>
        </div>

        <div className="hidden h-8 lg:block" />
      </div>

      <div className="flex w-full items-center justify-center bg-white px-6 py-12 sm:px-12 lg:w-[62.5%] lg:px-20">
        <div className="w-full max-w-[660px]">
          <div className="mb-8">
            <h2 className="mb-1.5 text-[28px] font-bold tracking-tight text-[#0F172A]">
              Buat akun baru
            </h2>
            <p className="text-sm text-[#64748B]">
              Isi data di bawah untuk mendaftar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold text-[#475569]"
                >
                  Nama lengkap
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nadia Putri"
                  className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>

              <div>
                <Label
                  htmlFor="username"
                  className="mb-2 block text-xs font-semibold text-[#475569]"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="nadia"
                  className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-[#475569]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nadia@example.com"
                  className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>

              <div>
                <Label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-semibold text-[#475569]"
                >
                  Nomor telepon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-[#475569]"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm tracking-widest text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold text-[#475569]"
                >
                  Konfirmasi password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-0 bg-[#F1F5F9] px-4 text-sm tracking-widest text-[#0F172A] shadow-none ring-0 transition-all placeholder:text-[#64748B] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#1652C8] active:scale-[0.99]"
              >
                Daftar Sekarang
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-[#1D61E7]">
              Sudah punya akun?{" "}
              <a href="#login" className="ml-0.5 hover:underline">
                Masuk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
