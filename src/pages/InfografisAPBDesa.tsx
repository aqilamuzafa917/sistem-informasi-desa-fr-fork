import { LabelList } from "recharts";
import * as React from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  BarChart3,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Download,
  Loader2,
} from "lucide-react";

import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import InfografisNav from "@/components/InfografisNav";
import { API_CONFIG } from "@/config/api";
import { useDesa } from "@/contexts/DesaContext";

interface DetailPendapatan {
  "Pendapatan Asli Desa": string;
  "Pendapatan Transfer": string;
  "Pendapatan Lain-lain": string | number;
}

interface DetailBelanja {
  "Belanja Barang/Jasa": string;
  "Belanja Modal": string;
  "Belanja Tak Terduga": string;
}

interface APBDesaData {
  tahun_anggaran: number;
  total_pendapatan: string;
  total_belanja: string;
  saldo_sisa: string;
  detail_pendapatan: DetailPendapatan;
  detail_belanja: DetailBelanja;
}

interface APBDesaResponse {
  status: string;
  data: APBDesaData[];
}

export default function InfografisAPBDesa() {
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [apbDesaData, setApbDesaData] = React.useState<APBDesaData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [downloading, setDownloading] = React.useState(false);
  const { desaConfig } = useDesa();

  // Get current year
  const currentYear = new Date().getFullYear();
  const isCurrentYear = selectedYear === currentYear.toString();

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    if (!selectedYear || downloading || isCurrentYear) return;

    try {
      setDownloading(true);
      toast.info("Mengunduh PDF APB Desa...", {
        description: "Dokumen akan segera diunduh",
      });

      const response = await axios.get(
        `${API_CONFIG.baseURL}/api/publik/apb-desa/pdf/${selectedYear}`,
        {
          headers: API_CONFIG.headers,
          responseType: "blob",
        },
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `APBDesa-${selectedYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh", {
        description: "Dokumen APB Desa berhasil diunduh",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Gagal mengunduh PDF", {
        description: "Silakan coba lagi beberapa saat",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Fetch APBDesa data
  React.useEffect(() => {
    const fetchAPBDesa = async () => {
      try {
        setLoading(true);
        const response = await axios.get<APBDesaResponse>(
          `${API_CONFIG.baseURL}/api/publik/apbdesa/multi-tahun`,
          {
            headers: API_CONFIG.headers,
          },
        );
        const data = response.data.data;
        setApbDesaData(data);

        // Set tahun terbaru sebagai tahun yang dipilih
        if (data.length > 0) {
          const latestYear = Math.max(
            ...data.map((item) => item.tahun_anggaran),
          );
          setSelectedYear(latestYear.toString());
        }
      } catch (error) {
        console.error("Error fetching APBDesa data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPBDesa();
  }, []);

  // Get selected year data
  const selectedYearData = apbDesaData.find(
    (data) => data.tahun_anggaran.toString() === selectedYear,
  );

  // Calculate year-over-year growth
  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const currentYearIndex = apbDesaData.findIndex(
    (d) => d.tahun_anggaran.toString() === selectedYear,
  );
  const previousYearData =
    currentYearIndex > 0 ? apbDesaData[currentYearIndex - 1] : null;

  const pendapatanGrowth = previousYearData
    ? calculateGrowth(
        parseFloat(selectedYearData?.total_pendapatan || "0"),
        parseFloat(previousYearData.total_pendapatan),
      )
    : 0;

  const belanjaGrowth = previousYearData
    ? calculateGrowth(
        parseFloat(selectedYearData?.total_belanja || "0"),
        parseFloat(previousYearData.total_belanja),
      )
    : 0;

  // Data perbandingan pendapatan dan belanja per tahun
  const dataPerbandinganTahunan = apbDesaData.map((data) => ({
    tahun: data.tahun_anggaran.toString(),
    pendapatan: parseFloat(data.total_pendapatan),
    belanja: parseFloat(data.total_belanja),
    saldo: parseFloat(data.saldo_sisa),
  }));

  // Data untuk chart "Pendapatan Desa"
  const dataPendapatanDesa = selectedYearData
    ? [
        {
          kategori: "PAD",
          jumlah: parseFloat(
            selectedYearData.detail_pendapatan["Pendapatan Asli Desa"],
          ),
          fullName: "Pendapatan Asli Desa",
        },
        {
          kategori: "Transfer",
          jumlah: parseFloat(
            selectedYearData.detail_pendapatan["Pendapatan Transfer"],
          ),
          fullName: "Pendapatan Transfer",
        },
        {
          kategori: "Lain-lain",
          jumlah: parseFloat(
            selectedYearData.detail_pendapatan[
              "Pendapatan Lain-lain"
            ].toString(),
          ),
          fullName: "Pendapatan Lain-lain",
        },
      ]
    : [];

  // Data untuk chart "Belanja Desa"
  const dataBelanjaDesa = selectedYearData
    ? Object.entries(selectedYearData.detail_belanja).map(
        ([kategori, jumlah]) => ({
          kategori: kategori.replace("Belanja ", "").replace("/", "/"),
          jumlah: parseFloat(jumlah),
          fullName: kategori,
        }),
      )
    : [];

  // Format angka ke format rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(angka)
      .replace("IDR", "Rp");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavbarDesa />
        <div className="container mx-auto space-y-8 px-4 py-8">
          <InfografisNav activeTab="apbdesa" />

          {/* Hero Section Placeholder */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-300"></div>
                    <div className="h-8 w-64 rounded-xl bg-gray-300"></div>
                  </div>
                  <div className="h-6 w-96 rounded-lg bg-gray-300"></div>
                  <div className="h-6 w-48 rounded-lg bg-gray-300"></div>
                </div>
                <div className="h-10 w-32 rounded-lg bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Cards Placeholder */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
                  <div>
                    <div className="mb-2 h-5 w-32 rounded-lg bg-gray-200"></div>
                    <div className="h-4 w-24 rounded-lg bg-gray-200"></div>
                  </div>
                </div>
                <div className="h-8 w-40 rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                  <div>
                    <div className="mb-2 h-6 w-48 rounded-lg bg-gray-200"></div>
                    <div className="h-4 w-64 rounded-lg bg-gray-200"></div>
                  </div>
                </div>
                <div className="h-80 rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Yearly Comparison Chart Placeholder */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                <div>
                  <div className="mb-2 h-6 w-48 rounded-lg bg-gray-200"></div>
                  <div className="h-4 w-64 rounded-lg bg-gray-200"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-20 rounded-lg bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-96 rounded-lg bg-gray-200"></div>
          </div>

          {/* Info Footer Placeholder */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-600 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
              <div>
                <div className="mb-2 h-6 w-48 rounded-lg bg-gray-200"></div>
                <div className="h-20 w-full rounded-lg bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
        <FooterDesa />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />
      <div className="container mx-auto space-y-8 px-4 py-8">
        <InfografisNav activeTab="apbdesa" />

        {/* Header Section */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
              <Building2 size={200} className="rotate-12 transform" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                      <BarChart3 size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">
                      APB Desa {desaConfig?.nama_desa}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPin size={16} />
                    <span className="text-lg">
                      Desa {desaConfig?.nama_desa}, Kec.{" "}
                      {desaConfig?.nama_kecamatan}, Kab.{" "}
                      {desaConfig?.nama_kabupaten}, {desaConfig?.nama_provinsi}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Calendar size={16} />
                    <span>Tahun Anggaran {selectedYear}</span>
                  </div>
                </div>

                <div className="lg:text-right">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-blue-100">Pilih Tahun</label>
                    <select
                      className="min-w-[140px] rounded-xl border-0 bg-white/20 px-4 py-3 text-white placeholder-blue-100 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {apbDesaData.map((data) => (
                        <option
                          key={data.tahun_anggaran}
                          value={data.tahun_anggaran}
                          className="text-gray-800"
                        >
                          {data.tahun_anggaran}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={downloading || isCurrentYear}
                      className="flex items-center gap-1 rounded-xl bg-white/20 px-3 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      title={
                        isCurrentYear
                          ? "PDF tidak tersedia untuk tahun berjalan"
                          : "Download PDF APB Desa"
                      }
                    >
                      {downloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      <span className="text-sm">PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Pendapatan Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute top-0 right-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <TrendingUp size={100} className="text-green-500" />
            </div>
            <div className="relative z-10">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-green-900/30">
                    <Wallet
                      className="text-green-600 dark:text-green-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Total Pendapatan
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tahun {selectedYear}
                    </p>
                  </div>
                </div>
                {pendapatanGrowth !== 0 && (
                  <div
                    className={`mt-2 flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                      pendapatanGrowth > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {pendapatanGrowth > 0 ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {Math.abs(pendapatanGrowth).toFixed(1)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-green-600 sm:text-3xl dark:text-green-400">
                {selectedYearData
                  ? formatRupiah(parseFloat(selectedYearData.total_pendapatan))
                  : "Loading..."}
              </p>
            </div>
          </div>

          {/* Belanja Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute top-0 right-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <TrendingDown size={100} className="text-red-500" />
            </div>
            <div className="relative z-10">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-red-900/30">
                    <CreditCard
                      className="text-red-600 dark:text-red-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Total Belanja
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tahun {selectedYear}
                    </p>
                  </div>
                </div>
                {belanjaGrowth !== 0 && (
                  <div
                    className={`mt-2 flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                      belanjaGrowth > 0
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {belanjaGrowth > 0 ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {Math.abs(belanjaGrowth).toFixed(1)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-red-600 sm:text-3xl dark:text-red-400">
                {selectedYearData
                  ? formatRupiah(parseFloat(selectedYearData.total_belanja))
                  : "Loading..."}
              </p>
            </div>
          </div>

          {/* Saldo Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute top-0 right-0 h-32 w-32 opacity-5 transition-opacity group-hover:opacity-10">
              <DollarSign size={100} className="text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/30">
                    <DollarSign
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Saldo Sisa
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tahun {selectedYear}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600 sm:text-3xl dark:text-blue-400">
                {selectedYearData
                  ? formatRupiah(parseFloat(selectedYearData.saldo_sisa))
                  : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Pendapatan Breakdown */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:bg-green-900/30">
                  <BarChart3
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Pendapatan Desa {selectedYear}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rincian sumber pendapatan desa
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataPendapatanDesa}
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="kategori"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) => formatRupiah(value)}
                      width={80}
                    />
                    <Bar
                      dataKey="jumlah"
                      fill="url(#greenGradient)"
                      radius={[8, 8, 0, 0]}
                      className="transition-opacity hover:opacity-80"
                    >
                      <LabelList
                        dataKey="jumlah"
                        position="top"
                        offset={8}
                        className="fill-gray-600 dark:fill-gray-300"
                        fontSize={11}
                        formatter={(value: number) => formatRupiah(value)}
                      />
                    </Bar>
                    <defs>
                      <linearGradient
                        id="greenGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#48cc6c"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#48cc6c"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Belanja Breakdown */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:bg-red-900/30">
                  <BarChart3
                    className="text-red-600 dark:text-red-400"
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Belanja Desa {selectedYear}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rincian penggunaan anggaran belanja
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataBelanjaDesa}
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="kategori"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) => formatRupiah(value)}
                      width={80}
                    />
                    <Bar
                      dataKey="jumlah"
                      fill="url(#redGradient)"
                      radius={[8, 8, 0, 0]}
                      className="transition-opacity hover:opacity-80"
                    >
                      <LabelList
                        dataKey="jumlah"
                        position="top"
                        offset={8}
                        className="fill-gray-600 dark:fill-gray-300"
                        fontSize={11}
                        formatter={(value: number) => formatRupiah(value)}
                      />
                    </Bar>
                    <defs>
                      <linearGradient
                        id="redGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#00b4d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#00b4d8"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Comparison Chart */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/30">
                  <BarChart3
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Tren Pendapatan dan Belanja
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Perbandingan multi-tahun ({apbDesaData[0]?.tahun_anggaran} -{" "}
                    {apbDesaData[apbDesaData.length - 1]?.tahun_anggaran})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#48cc6c]"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Pendapatan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#00b4d8]"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Belanja
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Saldo
                  </span>
                </div>
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataPerbandinganTahunan}
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="tahun"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) => formatRupiah(value)}
                    width={80}
                  />
                  <Bar
                    dataKey="pendapatan"
                    fill="#48cc6c"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="belanja" fill="#00b4d8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saldo" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-600 dark:from-gray-800 dark:to-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-blue-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/30">
                <Info className="text-blue-600 dark:text-blue-400" size={16} />
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                  Informasi APB Desa
                </h4>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Anggaran Pendapatan dan Belanja Desa (APB Desa) adalah rencana
                  keuangan tahunan pemerintahan desa yang disetujui oleh Badan
                  Permusyawaratan Desa. Data di atas telah disesuaikan dalam
                  jutaan rupiah untuk kemudahan pembacaan. Semua angka yang
                  ditampilkan telah divalidasi dan sesuai dengan dokumen resmi
                  APB Desa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterDesa />
    </div>
  );
}
