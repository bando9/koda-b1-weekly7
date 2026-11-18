import { Button } from "./components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { formatToRupiah } from "./utils"

export function App() {
  return (
    <div className="px-6 pt-9">
      <img src="./logo.png" className="mb-11 w-37.5" />
      <h1 className="mb-16 text-2xl font-bold">Halo, Nadia 👋</h1>

      <Card className="mb-9 w-full max-w-sm rounded-2xl bg-primary">
        <CardHeader className="mb-8">
          <CardDescription className="mb-8 text-primary-foreground">
            Total Saldo
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-primary-foreground">
            {formatToRupiah(1250000)}
          </CardTitle>
        </CardHeader>
        <CardContent>KW-******-1842</CardContent>
      </Card>

      <div className="mb-8 grid w-full grid-cols-2 justify-between gap-5 overflow-hidden">
        <Button size="lg" className="w-full rounded-2xl bg-primary">
          Top Up
        </Button>
        <Button size="lg" className="w-full bg-[#0891B2]">
          Transfer
        </Button>
      </div>

      <div>
        <h1 className="mb-5">Transaksi Terbaru</h1>
        <div className="flex flex-col gap-5">
          <Card size="sm" className="mx-auto w-full max-w-xs p-5">
            <CardTitle className="text-[14px] font-bold">Top Up QRIS</CardTitle>
            <CardContent className="text-[13px] font-normal text-[#64748B]">
              + {formatToRupiah(250000)}
            </CardContent>
          </Card>

          <Card size="sm" className="mx-auto w-full max-w-xs p-5">
            <CardTitle className="text-[14px] font-bold">
              Transfer ke Bima
            </CardTitle>
            <CardContent className="text-[13px] font-normal text-[#64748B]">
              + {formatToRupiah(250000)}
            </CardContent>
          </Card>

          <Card size="sm" className="mx-auto w-full max-w-xs p-5">
            <CardTitle className="text-[14px] font-bold">
              Transfer ke Rina
            </CardTitle>
            <CardContent className="text-[13px] font-normal text-[#64748B]">
              + {formatToRupiah(250000)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
