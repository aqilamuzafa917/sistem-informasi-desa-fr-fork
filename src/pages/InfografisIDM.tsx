import React, { useEffect, useState } from "react";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import InfografisNav from "@/components/InfografisNav";
import { useDesa } from "@/contexts/DesaContext";
import {
  BarChart3,
  MapPin,
  Activity,
  TrendingUp,
  Award,
  ChevronRight,
  Info,
  Calendar,
  LineChart,
} from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// Card components
const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: CardHeaderProps) => (
  <div className={`p-4 pb-2 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: CardTitleProps) => (
  <h3
    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: CardContentProps) => (
  <div className={`p-4 pt-2 ${className}`}>{children}</div>
);

// Tambahkan tipe untuk response IDM dan variabel indikator
type IndikatorIDM = {
  id: number;
  indikator_idm: string;
  skor: number;
  keterangan: string;
  kegiatan: string;
  nilai_plus: number;
  pelaksana: string[];
  kategori: string;
  tahun: number;
  created_at: string;
  updated_at: string;
};

type IDMStats = {
  id: number;
  tahun: number;
  skor_idm: number;
  status_idm: string;
  target_status: string;
  skor_minimal: number;
  penambahan: number;
  komponen: {
    skorIKE: number;
    skorIKS: number;
    skorIKL: number;
  };
  created_at: string;
  updated_at: string;
};

type IDMResponse = {
  idm: IDMStats;
  variabel_ike: IndikatorIDM[];
  variabel_iks: IndikatorIDM[];
  variabel_ikl: IndikatorIDM[];
};

// Enhanced Komponen Tabel Indikator
interface IndikatorTableProps {
  title: string;
  data: IndikatorIDM[] | undefined;
  theme: "green" | "blue" | "emerald";
  icon: React.ReactNode;
}

const IndikatorTable = ({ title, data, theme, icon }: IndikatorTableProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const themeClasses = {
    green: {
      header: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      accent: "text-green-600",
      border: "border-green-200",
      bg: "bg-green-50/50",
    },
    blue: {
      header: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      accent: "text-blue-600",
      border: "border-blue-200",
      bg: "bg-blue-50/50",
    },
    emerald: {
      header: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
      accent: "text-emerald-600",
      border: "border-emerald-200",
      bg: "bg-emerald-50/50",
    },
  };

  return (
    <div
      className={`rounded-2xl border ${themeClasses[theme].border} ${themeClasses[theme].bg} overflow-hidden transition-all duration-300 hover:shadow-lg`}
    >
      <div
        className={`${themeClasses[theme].header} flex cursor-pointer items-center justify-between p-6 transition-opacity duration-200 hover:opacity-90`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
            {data?.length || 0} Indikator
          </span>
          <ChevronRight
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
            size={20}
          />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6">
          {/* Color Legend */}
          <div className="mb-4 rounded-xl border border-gray-100 bg-white/60 p-4 backdrop-blur-sm">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              Keterangan Warna Pelaksana:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3 lg:grid-cols-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-red-200 bg-red-100"></div>
                <span className="text-gray-600">Pemerintah Pusat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-blue-200 bg-blue-100"></div>
                <span className="text-gray-600">Pemerintah Provinsi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-indigo-200 bg-indigo-100"></div>
                <span className="text-gray-600">Pemerintah Kabupaten</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-green-200 bg-green-100"></div>
                <span className="text-gray-600">Pemerintah Desa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-amber-200 bg-amber-100"></div>
                <span className="text-gray-600">Swasta & Masyarakat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-teal-200 bg-teal-100"></div>
                <span className="text-gray-600">Layanan Publik</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm">
                  <tr>
                    <th className="border-b border-gray-200 bg-gray-50/80 px-4 py-4 text-left font-semibold text-gray-700">
                      No
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50/80 px-4 py-4 text-left font-semibold text-gray-700">
                      Indikator
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50/80 px-4 py-4 text-center font-semibold text-gray-700">
                      Skor
                    </th>
                    <th className="border-b border-gray-200 bg-gray-50/80 px-4 py-4 text-left font-semibold text-gray-700">
                      Pelaksana
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.length ? (
                    data.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="group transition-all duration-200 hover:bg-gray-50/80"
                      >
                        <td className="px-4 py-4 text-center font-medium text-gray-900">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 group-hover:bg-gray-200">
                            {idx + 1}
                          </div>
                        </td>
                        <td className="max-w-md px-4 py-4 text-gray-800">
                          <div className="leading-tight font-medium">
                            {item.indikator_idm}
                          </div>
                          {item.kegiatan && (
                            <div className="mt-1 text-xs text-gray-500 italic">
                              Kegiatan: {item.kegiatan}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                              item.skor >= 2
                                ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                                : item.skor === 1
                                  ? "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200"
                                  : "bg-red-100 text-red-800 group-hover:bg-red-200"
                            }`}
                          >
                            {item.skor}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {item.pelaksana?.map((pelaksana, index) => {
                              // Accurate color coding based on correct pelaksana categories
                              let colorClass = "";

                              // Pemerintah Pusat - Soft red tones
                              if (
                                [
                                  "Kemendes",
                                  "Kemenperpus Arsip",
                                  "Kemepora",
                                  "Kesbangpol",
                                  "ESDM",
                                  "Kominfo",
                                  "BNPB",
                                  "Kemenperind",
                                ].includes(pelaksana)
                              ) {
                                colorClass =
                                  "bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 hover:border-red-200";
                              }
                              // Pemerintah Provinsi - Soft blue tones (matching theme)
                              else if (
                                [
                                  "Dinkes",
                                  "DPMD",
                                  "DISDIK",
                                  "Dinas Perpus",
                                  "DISPORA",
                                  "DIKNAS",
                                  "Diskominfo",
                                  "Dinsos",
                                  "DISPERINDAKOP UKM",
                                  "Dinas Pariwisata",
                                  "DISHUB",
                                  "DLH",
                                  "DISHUT/KPH",
                                  "BPBD",
                                  "Dinas Pendidikan",
                                ].includes(pelaksana)
                              ) {
                                colorClass =
                                  "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-200";
                              }
                              // Pemerintah Kabupaten - Soft indigo tones
                              else if (
                                [
                                  "PU",
                                  "DKPPD",
                                  "DPBD",
                                  "Pemerintah Daerah",
                                ].includes(pelaksana)
                              ) {
                                colorClass =
                                  "bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200";
                              }
                              // Pemerintah Desa - Soft green tones (matching theme)
                              else if (
                                [
                                  "Desa",
                                  "DD",
                                  "Dana Desa",
                                  "BUMDES",
                                  "Pemerintahan Desa",
                                  "Pemerintah Desa",
                                ].includes(pelaksana)
                              ) {
                                colorClass =
                                  "bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 hover:border-green-200";
                              }
                              // Swasta & Masyarakat - Soft amber/orange tones
                              else if (
                                [
                                  "CSR",
                                  "Swasta",
                                  "Perorangan",
                                  "Karang Taruna",
                                  "Operator Selular",
                                  "Kantor Pos",
                                  "Perbankan",
                                  "Bank",
                                  "Koperasi",
                                  "Masyarakat",
                                  "PKK",
                                ].includes(pelaksana)
                              ) {
                                colorClass =
                                  "bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 hover:border-amber-200";
                              }
                              // Public Services & Utilities - Soft teal tones (matching theme)
                              else if (
                                [
                                  "BPJS",
                                  "PAMSIMAS",
                                  "PDAM",
                                  "Puskesmas",
                                  "Bidan Desa",
                                  "Kepala Sekolah",
                                ].includes(pelaksana)
                              ) {
                                colorClass =
                                  "bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 hover:border-teal-200";
                              }
                              // Default - Soft neutral tones
                              else {
                                colorClass =
                                  "bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100 hover:border-slate-200";
                              }

                              return (
                                <span
                                  key={index}
                                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm ${colorClass}`}
                                >
                                  {pelaksana}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Info className="text-gray-400" size={32} />
                          <p className="text-lg font-medium">
                            Data tidak tersedia
                          </p>
                          <p className="text-sm">
                            Belum ada data indikator untuk kategori ini
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InfografisIDM() {
  const { desaConfig, loading } = useDesa();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [idmStats, setIdmStats] = useState<IDMStats[]>([]);
  const [idmData, setIdmData] = useState<IDMResponse | null>(null);
  const [loadingIdm, setLoadingIdm] = useState(true);
  const [errorIdm, setErrorIdm] = useState<string | null>(null);

  // Fetch IDM stats
  useEffect(() => {
    axios
      .get(`${API_CONFIG.baseURL}/api/publik/idm-stats`, {
        headers: API_CONFIG.headers,
      })
      .then((res) => {
        setIdmStats(res.data);
        // Set initial selected year to the most recent year
        if (res.data.length > 0) {
          const mostRecentYear = Math.max(
            ...res.data.map((stat: IDMStats) => stat.tahun),
          );
          setSelectedYear(mostRecentYear.toString());
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data statistik IDM:", err);
      });
  }, []);

  // Fetch IDM data when year changes
  useEffect(() => {
    if (!selectedYear) return;

    setLoadingIdm(true);
    setErrorIdm(null);
    axios
      .get(`${API_CONFIG.baseURL}/api/publik/idm/${selectedYear}`, {
        headers: API_CONFIG.headers,
      })
      .then((res) => {
        setIdmData(res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data IDM:", err);
        setErrorIdm("Gagal memuat data IDM untuk tahun yang dipilih.");
      })
      .finally(() => {
        setLoadingIdm(false);
      });
  }, [selectedYear]);

  // Get current year's stats
  const currentYearStats = idmStats.find(
    (stat) => stat.tahun.toString() === selectedYear,
  );

  // Prepare data for the trend chart
  const trendData = idmStats
    .sort((a, b) => a.tahun - b.tahun)
    .map((stat) => ({
      tahun: stat.tahun.toString(),
      skor: stat.skor_idm,
      target: stat.skor_minimal,
    }));

  if (loading || loadingIdm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavbarDesa />
        <div className="container mx-auto space-y-8 px-4 py-8">
          <InfografisNav activeTab="idm" />

          {/* Header Skeleton */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 p-8 shadow-2xl">
              <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
                <BarChart3 size={200} className="rotate-12 transform" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm"></div>
                      <div className="h-12 w-64 rounded-xl bg-white/20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-white/20"></div>
                      <div className="h-6 w-96 rounded-lg bg-white/20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-white/20"></div>
                      <div className="h-6 w-32 rounded-lg bg-white/20"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-24 rounded-lg bg-white/20"></div>
                    <div className="h-12 w-40 rounded-xl bg-white/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-8">
            {/* Skor dan Status IDM Skeleton */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-300"
                  style={{
                    background:
                      i === 1
                        ? "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)"
                        : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-8 w-48 rounded-lg bg-white/20"></div>
                    <div className="h-12 w-12 rounded-full bg-white/20"></div>
                  </div>
                  <div className="h-16 w-32 rounded-lg bg-white/20"></div>
                </div>
              ))}
            </div>

            {/* Target Information Cards Skeleton */}
            <div>
              <div className="mb-6 h-8 w-64 rounded-lg bg-gray-200"></div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 h-6 w-32 rounded-lg bg-gray-200"></div>
                    <div className="h-10 w-24 rounded-lg bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Komponen IDM Cards Skeleton */}
            <div>
              <div className="mb-6 h-8 w-64 rounded-lg bg-gray-200"></div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                    }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-6 w-24 rounded-lg bg-white/20"></div>
                      <div className="h-10 w-10 rounded-full bg-white/20"></div>
                    </div>
                    <div className="h-12 w-24 rounded-lg bg-white/20"></div>
                    <div className="mt-4 h-2 w-full rounded-full bg-white/20"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Summary Skeleton */}
            <div className="mb-8">
              <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 h-8 w-64 rounded-lg bg-gray-200"></div>
                <div className="h-32 w-full rounded-lg bg-gray-200"></div>
              </div>
            </div>

            {/* Indicator Tables Skeleton */}
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                      <div className="h-8 w-48 rounded-lg bg-gray-200"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-24 rounded-full bg-gray-200"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-16 w-full rounded-lg bg-gray-200"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Trend Chart Skeleton */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                  <div>
                    <div className="mb-2 h-6 w-48 rounded-lg bg-gray-200"></div>
                    <div className="h-4 w-64 rounded-lg bg-gray-200"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-20 rounded-lg bg-gray-200"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-16 rounded-lg bg-gray-200"></div>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorIdm) {
    return (
      <div className="flex min-h-screen flex-col bg-sky-50">
        <NavbarDesa />
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
          <p className="mt-2 text-gray-700">{errorIdm}</p>
          <button
            type="button"
            onClick={() => setSelectedYear(selectedYear)} // Memuat ulang data untuk tahun yang sama
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />
      <div className="container mx-auto space-y-8 px-4 py-8">
        <InfografisNav activeTab="idm" />
        {/* Header Section */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
              <BarChart3 size={200} className="rotate-12 transform" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                      <BarChart3 size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">
                      Indeks Desa Membangun (IDM)
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
                    <span>Tahun {selectedYear}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-blue-100">Pilih Tahun</label>
                  <select
                    className="min-w-[140px] rounded-xl border-0 bg-white/20 px-4 py-3 text-white placeholder-blue-100 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {idmStats
                      .sort((a, b) => b.tahun - a.tahun)
                      .map((stat) => (
                        <option
                          key={stat.tahun}
                          value={stat.tahun}
                          className="text-gray-800"
                        >
                          {stat.tahun}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Skor dan Status IDM - Enhanced */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-wide uppercase">
                    SKOR IDM {selectedYear}
                  </h3>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <p className="mb-2 text-right text-4xl font-bold">
                  {currentYearStats?.skor_idm.toFixed(4) ?? "-"}
                </p>
                <p className="text-right text-white/80">Indeks Komposit</p>
              </div>
            </div>
            <div
              className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #48cc6c 0%, #2d9a46 100%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-wide uppercase">
                    STATUS IDM {selectedYear}
                  </h3>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <p className="mb-2 text-right text-4xl font-bold">
                  {currentYearStats?.status_idm ?? "-"}
                </p>
                <p className="text-right text-white/80">Kategori Desa</p>
              </div>
            </div>
          </div>

          {/* Target Information Cards */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">
              Informasi Target & Pencapaian
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="group relative overflow-hidden border-l-4 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    Target Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="mb-2 text-right text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-300">
                    {currentYearStats?.target_status ?? "-"}
                  </p>
                  <p className="text-right text-sm text-gray-500">
                    Status yang dituju
                  </p>
                </CardContent>
              </Card>
              <Card className="group relative overflow-hidden border-l-4 border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="text-green-600 dark:text-green-400">
                    Skor Minimal
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="mb-2 text-right text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-300">
                    {currentYearStats?.skor_minimal.toFixed(4) ?? "-"}
                  </p>
                  <p className="text-right text-sm text-gray-500">
                    Untuk mencapai target
                  </p>
                </CardContent>
              </Card>
              <Card className="group relative overflow-hidden border-l-4 border-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="text-orange-600 dark:text-orange-400">
                    Penambahan Diperlukan
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="mb-2 text-right text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-300">
                    {Number(currentYearStats?.penambahan ?? 0) > 0 ? "+" : ""}
                    {currentYearStats?.penambahan.toFixed(4) ?? "-"}
                  </p>
                  <p className="text-right text-sm text-gray-500">
                    Selisih dengan target
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Komponen IDM dengan Render Dinamis */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">
              Komponen Indeks Desa Membangun
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Skor IKS",
                  description: "Indeks Ketahanan Sosial",
                  score: currentYearStats?.komponen.skorIKS.toFixed(4) ?? "-",
                  rawValue: currentYearStats?.komponen.skorIKS ?? 0,
                  emoji: "👥",
                  gradient: "linear-gradient(135deg, #00b4d8 0%, #48cc6c 100%)",
                },
                {
                  title: "Skor IKE",
                  description: "Indeks Ketahanan Ekonomi",
                  score: currentYearStats?.komponen.skorIKE.toFixed(4) ?? "-",
                  rawValue: currentYearStats?.komponen.skorIKE ?? 0,
                  emoji: "💰",
                  gradient: "linear-gradient(135deg, #48cc6c 0%, #00b4d8 100%)",
                },
                {
                  title: "Skor IKL",
                  description: "Indeks Ketahanan Ekologi",
                  score: currentYearStats?.komponen.skorIKL.toFixed(4) ?? "-",
                  rawValue: currentYearStats?.komponen.skorIKL ?? 0,
                  emoji: "🌱",
                  gradient: "linear-gradient(135deg, #00b4d8 0%, #48cc6c 100%)",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ background: card.gradient }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold">{card.title}</h4>
                        <p className="text-sm text-white/80">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                        <span className="text-xl">{card.emoji}</span>
                      </div>
                    </div>
                    <p className="mb-2 text-right text-2xl font-bold sm:text-3xl">
                      {card.score}
                    </p>
                    <div className="h-2 w-full rounded-full bg-white/20">
                      <div
                        className="h-2 rounded-full bg-white transition-all duration-300 group-hover:bg-white/90"
                        style={{ width: `${card.rawValue * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mb-8">
            <Card className="group relative overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <CardHeader className="relative z-10">
                <CardTitle className="text-center text-2xl">
                  Ringkasan Pencapaian IDM
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 p-8">
                <div className="text-center">
                  <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                    Desa saat ini berada pada status{" "}
                    <span className="mx-1 font-bold text-green-600">
                      {currentYearStats?.status_idm ?? "-"}
                    </span>
                    dan membutuhkan peningkatan sebesar{" "}
                    <span className="mx-1 font-bold text-orange-600">
                      {Number(currentYearStats?.penambahan ?? 0) > 0 ? "+" : ""}
                      {currentYearStats?.penambahan.toFixed(4) ?? "-"}
                    </span>
                    untuk mencapai status{" "}
                    <span className="mx-1 font-bold text-blue-600">
                      {currentYearStats?.target_status ?? "-"}
                    </span>
                    .
                  </p>
                  <div className="mt-6">
                    <div className="relative mb-2 h-4 w-full rounded-full bg-gray-200">
                      <div
                        className="h-4 rounded-full transition-all duration-500 group-hover:opacity-90"
                        style={{
                          width: `${((currentYearStats?.skor_idm ?? 0) / (currentYearStats?.skor_minimal || 1)) * 100}%`,
                          background:
                            "linear-gradient(135deg, #00b4d8 0%, #48cc6c 100%)",
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Progress menuju target:{" "}
                      {(
                        ((currentYearStats?.skor_idm ?? 0) /
                          (currentYearStats?.skor_minimal || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabel Indikator */}
          <div className="space-y-12">
            <IndikatorTable
              title="Indikator Ketahanan Ekonomi (IKE)"
              data={idmData?.variabel_ike}
              theme="green"
              icon={<TrendingUp size={20} />}
            />
            <IndikatorTable
              title="Indikator Ketahanan Sosial (IKS)"
              data={idmData?.variabel_iks}
              theme="blue"
              icon={<Award size={20} />}
            />
            <IndikatorTable
              title="Indikator Ketahanan Ekologi (IKL)"
              data={idmData?.variabel_ikl}
              theme="emerald"
              icon={<Activity size={20} />}
            />
          </div>

          {/* Trend Chart */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/30">
                    <LineChart
                      className="text-blue-600 dark:text-blue-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      Tren Skor IDM
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Perkembangan Skor IDM Dari Tahun Ke Tahun
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Skor IDM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Target
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="tahun"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Tahun", position: "bottom", offset: 0 }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => value.toFixed(4)}
                      width={80}
                      label={{
                        value: "Skor",
                        angle: -90,
                        position: "left",
                        offset: 0,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value: number) => value.toFixed(4)}
                      labelFormatter={(label) => `Tahun ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="skor"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#3b82f6" }}
                      activeDot={{ r: 6, fill: "#3b82f6" }}
                      name="Skor IDM"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#22c55e"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: "#22c55e" }}
                      activeDot={{ r: 6, fill: "#22c55e" }}
                      name="Target"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterDesa />
    </div>
  );
}
