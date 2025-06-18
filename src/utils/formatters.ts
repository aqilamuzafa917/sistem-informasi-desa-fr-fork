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

// Currency formatting utilities
export const formatCurrency = (amount: number) => {
  const isNegative = amount < 0;
  const isPositive = amount > 0;
  const absoluteAmount = Math.abs(amount);
  const formattedAmount = `Rp ${new Intl.NumberFormat("id-ID").format(absoluteAmount)}`;
  return { text: formattedAmount, isNegative, isPositive };
};

export const formatCurrencyWithSign = (amount: number) => {
  const isNegative = amount < 0;
  const isPositive = amount > 0;
  const formattedAmount = `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
  return { text: formattedAmount, isNegative, isPositive };
};

// Status color utility
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "mandiri":
      return "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-700";
    case "maju":
      return "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700";
    case "berkembang":
      return "bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-700";
    case "tertinggal":
      return "bg-gradient-to-br from-red-100 to-pink-100 text-red-700";
    case "sangat tertinggal":
      return "bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700";
    default:
      return "bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700";
  }
};
