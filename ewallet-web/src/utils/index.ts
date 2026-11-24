export const formatToRupiah = (currency: number | bigint) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(currency)
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount)
}
