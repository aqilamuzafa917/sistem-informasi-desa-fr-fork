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
  // Normalize the status to lowercase for comparison
  const normalizedStatus = status?.toLowerCase()?.trim();

  switch (normalizedStatus) {
    case "mandiri":
      return "bg-gradient-to-br from-emerald-500 to-green-600 text-white";
    case "maju":
      return "bg-gradient-to-br from-blue-500 to-cyan-600 text-white";
    case "berkembang":
      return "bg-gradient-to-br from-yellow-500 to-amber-600 text-white";
    case "tertinggal":
      return "bg-gradient-to-br from-orange-500 to-red-600 text-white";
    case "sangat tertinggal":
      return "bg-gradient-to-br from-red-500 to-pink-600 text-white";
    default:
      return "bg-gradient-to-br from-gray-500 to-slate-600 text-white";
  }
};

// Function to get text color for IDM status values
export const getIDMTextColor = (status: string) => {
  // Normalize the status to lowercase for comparison
  const normalizedStatus = status?.toLowerCase()?.trim();

  switch (normalizedStatus) {
    case "mandiri":
      return "text-emerald-600";
    case "maju":
      return "text-blue-600";
    case "berkembang":
      return "text-yellow-600";
    case "tertinggal":
      return "text-orange-600";
    case "sangat tertinggal":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// Function to determine IDM status based on score
export const getIDMStatusFromScore = (score: number): string => {
  if (score >= 0.8156) return "Mandiri";
  if (score >= 0.7073) return "Maju";
  if (score >= 0.6) return "Berkembang";
  if (score >= 0.4916) return "Tertinggal";
  return "Sangat Tertinggal";
};

// Enhanced status color function that can work with both status strings and scores
export const getIDMStatusColor = (statusOrScore: string | number) => {
  let status: string;

  if (typeof statusOrScore === "number") {
    status = getIDMStatusFromScore(statusOrScore);
  } else {
    status = statusOrScore;
  }

  return getStatusColor(status);
};

// Enhanced text color function that can work with both status strings and scores
export const getIDMStatusTextColor = (statusOrScore: string | number) => {
  let status: string;

  if (typeof statusOrScore === "number") {
    status = getIDMStatusFromScore(statusOrScore);
  } else {
    status = statusOrScore;
  }

  return getIDMTextColor(status);
};
