import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const RECENT_TRANSACTIONS = [
  {
    id: 1,
    title: "Top Up QRIS",
    amount: "+ Rp250.000",
  },
  {
    id: 2,
    title: "Transfer ke Bima",
    amount: "- Rp75.000",
  },
  {
    id: 3,
    title: "Transfer dari Rina",
    amount: "+ Rp120.000",
  },
]

export default function CustomerDashboard() {
  return (
    <div className="flex min-h-screen justify-center bg-[#F8FAFC] font-sans antialiased">
      <div className="min-h-screen w-full max-w-[430px] bg-[#F8FAFC] px-6 py-8">
        <header className="mb-7 flex items-center gap-2.5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-[#1D61E7]"
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
          <span className="text-[20px] font-bold tracking-tight text-[#1D61E7]">
            KodaWallet
          </span>
        </header>

        <section className="mb-6">
          <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-[#0F172A]">
            <span>Halo, Nadia</span>
            <span className="text-2xl" role="img" aria-label="wave">
              👋
            </span>
          </h1>
        </section>

        <section className="mb-6">
          <Card className="rounded-3xl border-0 bg-[#1D61E7] px-6 py-7 text-white shadow-none ring-0">
            <CardContent className="flex min-h-[140px] flex-col justify-between p-0">
              <p className="text-xs font-medium tracking-wider text-white/85 uppercase">
                TOTAL SALDO
              </p>

              <p className="my-3 text-[32px] leading-none font-bold tracking-tight">
                Rp1.250.000
              </p>

              <p className="text-xs font-medium tracking-wide text-white/85">
                KW-****-1842
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid grid-cols-2 gap-3.5">
          <Button
            type="button"
            className="h-12 cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
          >
            Top Up
          </Button>

          <Button
            type="button"
            className="h-12 cursor-pointer justify-start rounded-xl bg-[#0891B2] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#0E7490]"
          >
            Transfer
          </Button>
        </section>

        <section>
          <h2 className="mb-4 text-[19px] font-bold tracking-tight text-[#0F172A]">
            Transaksi Terbaru
          </h2>

          <div className="space-y-3">
            {RECENT_TRANSACTIONS.map((tx) => (
              <Card
                key={tx.id}
                className="rounded-2xl border-0 bg-white px-5 py-4 shadow-none ring-0"
              >
                <CardContent className="p-0">
                  <p className="mb-1 text-sm font-bold text-[#0F172A]">
                    {tx.title}
                  </p>
                  <p className="text-xs font-medium text-[#64748B]">
                    {tx.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
