export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(angka)
    .replace("IDR", "Rp")
    .replace(",00", ",00");
}; 