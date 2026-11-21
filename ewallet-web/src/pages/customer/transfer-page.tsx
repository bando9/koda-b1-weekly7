import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "topup", label: "Top Up" },
  { id: "transfer", label: "Transfer" },
  { id: "transactions", label: "Transactions" },
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" },
]

function KodaLogo({ className = "" }) {
  return (
    <svg
      width="24"
      height="24"
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
        strokeWidth="2.4"
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

export default function TransferPage({ onBack }) {
  const [activeNav, setActiveNav] = useState("transfer")
  const [recipientQuery, setRecipientQuery] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  const selectedRecipient = {
    initials: "BP",
    name: "Bima Pratama",
    walletId: "KW-****-2941",
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      recipient: selectedRecipient,
      amount: amount || "75000",
      note: note || "Bayar makan siang",
    })
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans antialiased md:flex md:bg-[#F5F7FA]">
      <aside className="hidden bg-[#0F172A] px-4 py-7 text-white md:flex md:w-[240px] md:shrink-0 md:flex-col">
        <div className="mb-8 flex items-center gap-2.5 px-3">
          <KodaLogo className="text-white" />
          <span className="text-[20px] font-bold tracking-tight">
            KodaWallet
          </span>
        </div>

        <p className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
          PERSONAL WALLET
        </p>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-[#1E40AF] font-semibold text-white"
                    : "font-medium text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex w-full flex-1 justify-center md:block">
        <div className="flex min-h-screen w-full max-w-[430px] flex-col px-6 py-8 md:min-h-0 md:max-w-[1160px] md:px-10 md:py-9">
          <header className="mb-8 flex items-center justify-between md:items-start">
            <div className="flex items-center gap-3.5 md:block">
              <button
                type="button"
                onClick={onBack}
                aria-label="Kembali"
                className="cursor-pointer text-[#0F172A] transition-opacity hover:opacity-75 md:hidden"
              >
                <ArrowLeft className="h-5 w-5 stroke-[2.4]" />
              </button>

              <div>
                <h1 className="text-[20px] font-bold tracking-tight text-[#0F172A] md:mb-1 md:text-[28px]">
                  Transfer Saldo
                </h1>
                <p className="hidden text-sm text-[#64748B] md:block">
                  Kirim uang ke pengguna KodaWallet lainnya.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2.5 rounded-full bg-white px-4 py-2 md:flex">
              <span className="text-xs font-bold text-[#0F172A]">NP</span>
              <span className="text-xs font-semibold text-[#0F172A]">
                Nadia
              </span>
            </div>
          </header>

          <section className="mb-8 md:hidden">
            <p className="mb-2 text-xs font-medium text-[#64748B]">
              Saldo tersedia
            </p>
            <p className="text-[28px] leading-none font-bold tracking-tight text-[#1D61E7]">
              Rp1.250.000
            </p>
          </section>
          <div className="flex flex-1 flex-col md:grid md:grid-cols-12 md:items-start md:gap-6">
            <div className="flex flex-1 flex-col md:col-span-8 md:rounded-3xl md:bg-white md:p-8">
              <h2 className="mb-6 hidden text-[20px] font-bold tracking-tight text-[#0F172A] md:block">
                Buat Transfer
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="recipient"
                      className="mb-2 block text-xs font-semibold text-[#64748B]"
                    >
                      <span className="md:hidden">Penerima</span>
                      <span className="hidden md:inline">Cari penerima</span>
                    </Label>
                    <Input
                      id="recipient"
                      type="text"
                      value={recipientQuery}
                      onChange={(e) => setRecipientQuery(e.target.value)}
                      placeholder="Username / nomor wallet"
                      className="h-12 rounded-xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7] md:bg-[#F1F5F9] md:focus-visible:bg-white"
                    />
                  </div>

                  <Card className="rounded-2xl border-0 bg-[#EEF4FF] px-5 py-4 shadow-none ring-0">
                    <CardContent className="p-0">
                      <p className="mb-1 flex items-center gap-2.5 text-sm font-bold text-[#0F172A]">
                        <span className="hidden text-xs font-bold text-[#0F172A] md:inline">
                          {selectedRecipient.initials}
                        </span>
                        <span>{selectedRecipient.name}</span>
                      </p>
                      <p className="text-xs font-medium text-[#64748B]">
                        <span className="md:hidden">
                          {selectedRecipient.walletId}
                        </span>
                        <span className="hidden md:inline">
                          Wallet: {selectedRecipient.walletId}
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  <div>
                    <Label
                      htmlFor="amount"
                      className="mb-2 block text-xs font-semibold text-[#64748B]"
                    >
                      <span className="md:hidden">Nominal</span>
                      <span className="hidden md:inline">Nominal transfer</span>
                    </Label>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Rp 75.000"
                      className="h-12 rounded-xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7] md:bg-[#F1F5F9] md:focus-visible:bg-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="note"
                      className="mb-2 block text-xs font-semibold text-[#64748B]"
                    >
                      <span className="md:hidden">Catatan</span>
                      <span className="hidden md:inline">
                        Catatan (opsional)
                      </span>
                    </Label>
                    <Input
                      id="note"
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Bayar makan siang"
                      className="h-12 rounded-xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7] md:bg-[#F1F5F9] md:focus-visible:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-10 md:mt-8">
                  <Button
                    type="submit"
                    className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
                  >
                    Tinjau Transfer
                  </Button>
                </div>
              </form>
            </div>

            <Card className="hidden rounded-3xl border-0 bg-white p-7 shadow-none ring-0 md:col-span-4 md:block">
              <CardContent className="p-0">
                <p className="mb-3 text-xs font-medium text-[#64748B]">
                  Saldo Tersedia
                </p>
                <p className="mb-6 text-[28px] leading-none font-bold tracking-tight text-[#0F172A]">
                  Rp1.250.000
                </p>
                <p className="max-w-[200px] text-xs leading-relaxed text-[#64748B]">
                  Transfer hanya diproses setelah konfirmasi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
