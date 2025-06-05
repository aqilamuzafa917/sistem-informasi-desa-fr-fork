// HomePage.tsx untuk Sistem Informasi Desa Bajujajar Timur
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Label,
  Pie,
  PieChart,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Users, Home, Info, AlertCircle, RefreshCw } from "lucide-react";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import { CHATBOT_MINIMIZE_EVENT } from "@/components/NavbarDesa";
import { PengaduanPopup } from "@/components/PengaduanPopup";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { useState, useEffect } from "react";
import EnhancedCarousel from "@/components/EnhancedCarousel";

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

interface Article {
  id_artikel: number;
  jenis_artikel: string;
  status_artikel: string;
  judul_artikel: string;
  kategori_artikel: string;
  isi_artikel: string;
  penulis_artikel: string;
  tanggal_publikasi_artikel: string;
  media_artikel: Array<{
    path: string;
    type: string;
    name: string;
    url: string;
  }>;
}

interface ArticleResponse {
  status: string;
  data: {
    current_page: number;
    data: Article[];
    last_page: number;
    total: number;
    per_page: number;
  };
}

interface PendudukStats {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_kk: number;
}

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  loading: boolean;
}) => (
  <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    <div className="relative">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "#6CA7E0" }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {title}
          </h3>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        {loading ? (
          <div className="h-9 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        ) : (
          <>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </span>
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
              {unit}
            </span>
          </>
        )}
      </div>
    </div>
  </div>
);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      gender: string;
      jumlah: number;
      percentage: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-opacity-80 rounded-md bg-black p-2 text-sm text-white">
        <div className="font-bold">{data.gender}</div>
        <div>{data.jumlah.toLocaleString()} Jiwa</div>
      </div>
    );
  }
  return null;
};

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="py-12 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Terjadi Kesalahan
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </button>
    </div>
  );
};

export default function HomePage() {
  // State for population stats
  const [pendudukStats, setPendudukStats] = useState<PendudukStats | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data untuk pie chart penduduk desa
  const chartDataPenduduk = React.useMemo(() => {
    if (!pendudukStats) return [];
    const total = pendudukStats.total_penduduk;
    return [
      {
        gender: "Laki-laki",
        jumlah: pendudukStats.total_laki_laki,
        fill: "#578EC8",
        percentage: parseFloat(
          ((pendudukStats.total_laki_laki / total) * 100).toFixed(1),
        ),
      },
      {
        gender: "Perempuan",
        jumlah: pendudukStats.total_perempuan,
        fill: "#55A84D",
        percentage: parseFloat(
          ((pendudukStats.total_perempuan / total) * 100).toFixed(1),
        ),
      },
    ];
  }, [pendudukStats]);

  // Menghitung total penduduk
  const totalPenduduk = React.useMemo(() => {
    return pendudukStats?.total_penduduk || 0;
  }, [pendudukStats]);

  // Jumlah kepala keluarga
  const jumlahKK = pendudukStats?.total_kk || 0;

  // Fetch population stats
  const fetchPendudukStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<PendudukStats>(
        `${API_CONFIG.baseURL}/api/publik/penduduk/stats`,
        {
          headers: API_CONFIG.headers,
        },
      );
      setPendudukStats(response.data);
    } catch (error) {
      console.error("Error fetching population stats:", error);
      setError("Gagal mengambil data statistik penduduk");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendudukStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPendudukStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const [isPengaduanOpen, setIsPengaduanOpen] = React.useState(false);
  const [apbDesaData, setApbDesaData] = React.useState<APBDesaData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

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
      } catch (error) {
        console.error("Error fetching APBDesa data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPBDesa();
  }, []);

  // Get latest year data
  const latestYearData =
    apbDesaData.length > 0 ? apbDesaData[apbDesaData.length - 1] : null;

  // Format angka ke format rupiah
  const formatRupiah = (angka: number) => {
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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<ArticleResponse>(
          `${API_CONFIG.baseURL}/api/publik/artikel`,
          {
            headers: API_CONFIG.headers,
          },
        );

        if (response.data.status === "success") {
          // Filter for official articles and take first 5
          const officialArticles = response.data.data.data
            .filter((article) => article.jenis_artikel === "resmi")
            .slice(0, 5);
          setArticles(officialArticles);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />

      {/* Carousel Section */}
      <EnhancedCarousel articles={articles} loading={loading} />

      {/* Fitur Desa */}
      <section
        id="FiturDesa"
        className="w-full bg-sky-50 py-12 dark:bg-gray-800"
      >
        <div className="container mx-auto mb-12 px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Fitur Desa
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1 - Request Official Letters */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    Pengajuan Surat Keterangan
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Pengajuan Surat Keterangan
                  </p>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Ajukan permohonan surat keterangan dan sertifikat yang
                    diperlukan untuk keperluan administrasi.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/pengajuansurat")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Ajukan Surat
                  </Button>
                </>
              )}
            </div>

            {/* Card 2 - Track Document Status */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <svg
                      className="h-auto w-6 text-blue-600 dark:text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    Lacak Status Dokumen
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Memantau Status SK
                  </p>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Periksa status dokumen dan sertifikat yang Anda ajukan
                    secara real-time.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/cekstatussurat")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Lacak Surat
                  </Button>
                </>
              )}
            </div>

            {/* Card 3 - Emergency Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                    <svg
                      className="h-6 w-6 text-red-600 dark:text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    Pengaduan Warga
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Laporkan masalah atau keluhan yang Anda hadapi.
                  </p>
                  <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Berikan informasi yang jelas dan lengkap tentang masalah
                    Anda.
                  </p>
                  <Button
                    onClick={() => {
                      const event = new CustomEvent(CHATBOT_MINIMIZE_EVENT, {
                        detail: { minimize: true },
                      });
                      window.dispatchEvent(event);
                      setIsPengaduanOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Laporkan Pengaduan
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Infografis Desa */}
      <section className="bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 py-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-2 text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
              Infografis Desa
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Visualisasi data statistik penduduk dan demografi desa terkini
            </p>
          </div>

          {error ? (
            <ErrorState error={error} onRetry={fetchPendudukStats} />
          ) : isLoading ? (
            <div className="space-y-6">
              <div className="h-[400px] w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col lg:flex-row">
                {/* Chart Section */}
                <div className="bg-gradient-to-br from-green-50 to-blue-100 p-8 lg:w-1/2 dark:from-gray-800 dark:to-gray-700">
                  <div className="flex flex-col items-center">
                    <div className="aspect-square w-full max-w-md">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip content={<CustomTooltip />} />
                          <Pie
                            data={chartDataPenduduk}
                            dataKey="jumlah"
                            nameKey="gender"
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={140}
                            paddingAngle={2}
                            animationBegin={0}
                            animationDuration={1000}
                          >
                            {chartDataPenduduk.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.fill}
                                stroke="#fff"
                                strokeWidth={3}
                              />
                            ))}
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-gray-900 text-3xl font-bold dark:fill-white"
                                      >
                                        {totalPenduduk.toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-gray-600 text-sm font-medium dark:fill-gray-400"
                                      >
                                        Total Penduduk
                                      </tspan>
                                    </text>
                                  );
                                }
                                return null;
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 w-full max-w-sm space-y-3">
                      {chartDataPenduduk.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-white/70 p-3 backdrop-blur-sm dark:bg-gray-800/70"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: entry.fill }}
                            />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {entry.gender}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {entry.jumlah.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {entry.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="p-4 lg:w-1/2">
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      Data Statistik Penduduk
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <StatCard
                      title="Total Penduduk"
                      value={totalPenduduk}
                      unit="Jiwa"
                      icon={Users}
                      loading={isLoading}
                    />

                    <StatCard
                      title="Jumlah Kepala Keluarga"
                      value={jumlahKK}
                      unit="KK"
                      icon={Home}
                      loading={isLoading}
                    />

                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Info className="h-4 w-4" />
                        <span>
                          Rasio jenis kelamin:{" "}
                          {(() => {
                            const maleCount = chartDataPenduduk[0]?.jumlah || 0;
                            const femaleCount =
                              chartDataPenduduk[1]?.jumlah || 0;
                            if (maleCount === 0 && femaleCount === 0) {
                              return "Belum ada data";
                            } else if (femaleCount === 0) {
                              return "Laki-laki saja";
                            } else if (maleCount === 0) {
                              return "Perempuan saja";
                            } else if (maleCount >= femaleCount) {
                              const rawRatio = maleCount / femaleCount;
                              const formattedRatio =
                                rawRatio % 1 === 0
                                  ? rawRatio.toString()
                                  : rawRatio.toFixed(2);
                              return `${formattedRatio} : 1 (L:P)`;
                            } else {
                              const rawRatio = femaleCount / maleCount;
                              const formattedRatio =
                                rawRatio % 1 === 0
                                  ? rawRatio.toString()
                                  : rawRatio.toFixed(2);
                              return `1 : ${formattedRatio} (L:P)`;
                            }
                          })()}
                        </span>
                      </div>

                      <button
                        className="w-full transform rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
                        style={{
                          background:
                            "linear-gradient(to right, #578EC8, #6CA7E0)",
                          boxShadow: "0 4px 12px rgba(87, 142, 200, 0.3)",
                        }}
                        onMouseEnter={(
                          e: React.MouseEvent<HTMLButtonElement>,
                        ) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.background =
                            "linear-gradient(to right, #49904D, #55A84D)";
                        }}
                        onMouseLeave={(
                          e: React.MouseEvent<HTMLButtonElement>,
                        ) => {
                          const target = e.target as HTMLButtonElement;
                          target.style.background =
                            "linear-gradient(to right, #578EC8, #6CA7E0)";
                        }}
                        onClick={() =>
                          (window.location.href = "/infografis/penduduk")
                        }
                      >
                        LIHAT DATA LEBIH LENGKAP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info Cards */}
          {!isLoading && !error ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="mb-2 text-2xl font-bold"
                  style={{ color: "#578EC1" }}
                >
                  {totalPenduduk && jumlahKK
                    ? (totalPenduduk / jumlahKK).toFixed(1)
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rata-rata Anggota per KK
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="mb-2 text-2xl font-bold"
                  style={{ color: "#578EC8" }}
                >
                  {chartDataPenduduk[0]?.percentage || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Proporsi Laki-laki
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="mb-2 text-2xl font-bold"
                  style={{ color: "#55A84D" }}
                >
                  {chartDataPenduduk[1]?.percentage || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Proporsi Perempuan
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="mx-auto h-4 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="mx-auto h-4 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="mx-auto h-4 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* APB Desa */}
      <div className="container mx-auto mb-12 px-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-stretch md:flex-row">
            {/* Bagian Kiri - SVG dengan Design Baru (Diperkecil) */}
            <div
              className="relative flex flex-shrink-0 items-center justify-center overflow-hidden p-4 md:w-1/4"
              style={{
                background: `linear-gradient(135deg, #49904D 0%, #55A84D 50%, #69B458 100%)`,
              }}
            >
              {/* Background Decorative Elements */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute top-8 left-8 h-20 w-20 rounded-full"
                  style={{ backgroundColor: "#F4EB3C" }}
                ></div>
                <div
                  className="absolute right-6 bottom-12 h-16 w-16 rounded-full"
                  style={{ backgroundColor: "#DEDF41" }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/4 h-12 w-12 rounded-full"
                  style={{ backgroundColor: "#6CA7E0" }}
                ></div>
                <div
                  className="absolute top-16 right-16 h-8 w-8 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                ></div>
              </div>

              {/* Modern SVG Replacement */}
              <div className="relative z-10 text-center text-white">
                <div className="mb-2">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 21h18" />
                      <path d="M5 21V7l8-4v18" />
                      <path d="M19 21V11l-6-4" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Transparansi</h3>
                  <p className="text-lg opacity-90">Keuangan Desa</p>
                </div>
              </div>
            </div>

            {/* Bagian Kanan - Informasi APB */}
            <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-8 dark:from-gray-800 dark:to-gray-900">
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
                  APB DESA{" "}
                  {loading ? (
                    <span className="inline-block h-6 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></span>
                  ) : (
                    <span className="text-black dark:text-white">
                      {latestYearData?.tahun_anggaran}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Akses cepat dan transparan terhadap APB Desa
                </p>
              </div>

              <div className="space-y-6">
                {/* Pendapatan Desa */}
                <div
                  className="relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
                  style={{ borderColor: "#6CA7E040" }}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-2 rounded-r-lg"
                    style={{ backgroundColor: "#6CA7E0" }}
                  ></div>

                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className="rounded-xl p-3"
                      style={{ backgroundColor: "#6CA7E020" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6CA7E0"
                        strokeWidth="2"
                      >
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      Pendapatan Desa
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-black dark:text-white">
                      {loading ? (
                        <span className="inline-block h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></span>
                      ) : latestYearData ? (
                        formatRupiah(
                          parseFloat(latestYearData.total_pendapatan),
                        )
                      ) : (
                        "Rp0,00"
                      )}
                    </p>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      💰 Total penerimaan desa
                    </div>
                  </div>
                </div>

                {/* Belanja Desa */}
                <div
                  className="relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
                  style={{ borderColor: "#F4EB3C40" }}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-2 rounded-r-lg"
                    style={{ backgroundColor: "#F4EB3C" }}
                  ></div>

                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className="rounded-xl p-3"
                      style={{ backgroundColor: "#F4EB3C20" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#F4EB3C"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12,6 L12,12 L16,14" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      Belanja Desa
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-black dark:text-white">
                      {loading ? (
                        <span className="inline-block h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></span>
                      ) : latestYearData ? (
                        formatRupiah(parseFloat(latestYearData.total_belanja))
                      ) : (
                        "Rp0,00"
                      )}
                    </p>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      💸 Total pengeluaran desa
                    </div>
                  </div>
                </div>

                {/* Budget Balance Indicator */}
                {loading ? (
                  <div
                    className="rounded-2xl border-2 p-6"
                    style={{
                      backgroundColor: "#6CA7E010",
                      borderColor: "#6CA7E030",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-6 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ) : (
                  latestYearData && (
                    <div
                      className="rounded-2xl border-2 p-6"
                      style={{
                        backgroundColor: "#6CA7E010",
                        borderColor: "#6CA7E030",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="rounded-lg p-2"
                            style={{ backgroundColor: "#6CA7E020" }}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6CA7E0"
                              strokeWidth="2"
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5z" />
                              <path d="M2 17l10 5 10-5" />
                              <path d="M2 12l10 5 10-5" />
                            </svg>
                          </div>
                          <span className="text-base font-semibold text-black dark:text-white">
                            Saldo Anggaran
                          </span>
                        </div>
                        <span
                          className="text-xl font-bold"
                          style={{
                            color:
                              parseFloat(latestYearData.total_pendapatan) -
                                parseFloat(latestYearData.total_belanja) >=
                              0
                                ? "#6CA7E0"
                                : "#ef4444",
                          }}
                        >
                          {formatRupiah(
                            parseFloat(latestYearData.total_pendapatan) -
                              parseFloat(latestYearData.total_belanja),
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8">
                <a href="/Infografis/apbdesa" className="block">
                  <button
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, #6CA7E0 0%, #578EC8 100%)`,
                    }}
                  >
                    LIHAT DATA LEBIH LENGKAP
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <FooterDesa />
      <PengaduanPopup
        isOpen={isPengaduanOpen}
        onClose={() => setIsPengaduanOpen(false)}
      />
    </main>
  );
}
