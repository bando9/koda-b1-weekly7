import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function TransferPage({ onBack }) {
  const [recipientQuery, setRecipientQuery] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  const selectedRecipient = {
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
    <div className="flex min-h-screen justify-center bg-[#F8FAFC] font-sans antialiased">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-[#F8FAFC] px-6 py-8">
        <header className="mb-8 flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="cursor-pointer text-[#0F172A] transition-opacity hover:opacity-75"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.4]" />
          </button>
          <h1 className="text-[20px] font-bold tracking-tight text-[#0F172A]">
            Transfer Saldo
          </h1>
        </header>

        <section className="mb-8">
          <p className="mb-2 text-xs font-medium text-[#64748B]">
            Saldo tersedia
          </p>
          <p className="text-[28px] leading-none font-bold tracking-tight text-[#1D61E7]">
            Rp1.250.000
          </p>
        </section>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="recipient"
                className="mb-2 block text-xs font-semibold text-[#64748B]"
              >
                Penerima
              </Label>
              <Input
                id="recipient"
                type="text"
                value={recipientQuery}
                onChange={(e) => setRecipientQuery(e.target.value)}
                placeholder="Cari username atau wallet"
                className="h-12 rounded-xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
              />
            </div>

            <Card className="rounded-2xl border-0 bg-[#EEF4FF] px-5 py-4 shadow-none ring-0">
              <CardContent className="p-0">
                <p className="mb-1 text-sm font-bold text-[#0F172A]">
                  {selectedRecipient.name}
                </p>
                <p className="text-xs font-medium text-[#64748B]">
                  {selectedRecipient.walletId}
                </p>
              </CardContent>
            </Card>

            <div>
              <Label
                htmlFor="amount"
                className="mb-2 block text-xs font-semibold text-[#64748B]"
              >
                Nominal
              </Label>
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Rp 75.000"
                className="h-12 rounded-xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
              />
            </div>

            <div>
              <Label
                htmlFor="note"
                className="mb-2 block text-xs font-semibold text-[#64748B]"
              >
                Catatan
              </Label>
              <Input
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bayar makan siang"
                className="h-12 rounded-xl border-0 bg-white px-4 text-sm text-[#0F172A] shadow-none ring-0 placeholder:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#1D61E7]"
              />
            </div>
          </div>

          <div className="mt-10">
            <Button
              type="submit"
              className="h-12 w-full cursor-pointer justify-start rounded-xl bg-[#1D61E7] px-5 text-sm font-semibold text-white shadow-none hover:bg-[#1652C8]"
            >
              Tinjau Transfer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
