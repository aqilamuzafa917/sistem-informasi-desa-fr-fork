import React from "react";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import InfografisNav from "@/components/InfografisNav";
import { useDesa } from "@/contexts/DesaContext";
import { BarChart3, MapPin, Calendar, Activity } from "lucide-react";

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

export default function InfografisIDM() {
  const { desaConfig, loading } = useDesa();

  // Data IDM
  const tahun = "2024";
  const skorIDM = "0.7925";
  const statusIDM = "MAJU";
  const targetStatus = "MANDIRI";
  const skorMinimal = "0.8156";
  const penambahan = "0.0231";

  // Data komponen IDM
  const skorIKS = "0.7943"; // Indeks Ketahanan Sosial
  const skorIKE = "0.7167"; // Indeks Ketahanan Ekonomi
  const skorIKL = "0.8667"; // Indeks Ketahanan Ekologi/Lingkungan

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50">
        <NavbarDesa />
        <div className="container mx-auto px-4">
          <InfografisNav activeTab="idm" />
          <div className="animate-pulse space-y-8">
            {/* Hero Section Placeholder */}
            <div className="rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 p-8">
              <div className="h-12 w-1/3 rounded-xl bg-gray-300"></div>
              <div className="mt-4 h-6 w-2/3 rounded-lg bg-gray-300"></div>
            </div>

            {/* Main IDM Cards Placeholder */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-white p-8 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-8 w-32 rounded-lg bg-gray-200"></div>
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="h-16 w-32 rounded-lg bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Target Information Cards Placeholder */}
            <div>
              <div className="mb-6 h-8 w-64 rounded-lg bg-gray-200"></div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-white p-6 shadow-lg">
                    <div className="mb-4 h-6 w-32 rounded-lg bg-gray-200"></div>
                    <div className="h-10 w-24 rounded-lg bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Komponen IDM Cards Placeholder */}
            <div>
              <div className="mb-6 h-8 w-64 rounded-lg bg-gray-200"></div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-6 w-24 rounded-lg bg-gray-200"></div>
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-12 w-24 rounded-lg bg-gray-200"></div>
                    <div className="mt-4 h-2 w-full rounded-full bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavbarDesa />
      <div className="container mx-auto space-y-8 px-4 py-8">
        <InfografisNav activeTab="idm" />

        {/* Hero Section with Gradient */}
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
                    <span>Data Tahun {tahun}</span>
                  </div>
                </div>
                <div className="lg:text-right">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Activity size={16} />
                    <span>Data Real-time</span>
                  </div>
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
                    SKOR IDM {tahun}
                  </h3>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <p className="mb-2 text-right text-4xl font-bold">{skorIDM}</p>
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
                    STATUS IDM {tahun}
                  </h3>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <p className="mb-2 text-right text-4xl font-bold">
                  {statusIDM}
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
                    {targetStatus}
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
                    {skorMinimal}
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
                    +{penambahan}
                  </p>
                  <p className="text-right text-sm text-gray-500">
                    Selisih dengan target
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Komponen IDM dengan Gradient Cards */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">
              Komponen Indeks Desa Membangun
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* IKS Card */}
              <div
                className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #00b4d8 0%, #48cc6c 100%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold">Skor IKS</h4>
                      <p className="text-sm text-white/80">
                        Indeks Ketahanan Sosial
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                      <span className="text-xl">👥</span>
                    </div>
                  </div>
                  <p className="mb-2 text-right text-2xl font-bold sm:text-3xl">
                    {skorIKS}
                  </p>
                  <div className="h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-300 group-hover:bg-white/90"
                      style={{ width: `${parseFloat(skorIKS) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* IKE Card */}
              <div
                className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #48cc6c 0%, #00b4d8 100%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold">Skor IKE</h4>
                      <p className="text-sm text-white/80">
                        Indeks Ketahanan Ekonomi
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                      <span className="text-xl">💰</span>
                    </div>
                  </div>
                  <p className="mb-2 text-right text-2xl font-bold sm:text-3xl">
                    {skorIKE}
                  </p>
                  <div className="h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-300 group-hover:bg-white/90"
                      style={{ width: `${parseFloat(skorIKE) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* IKL Card */}
              <div
                className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #00b4d8 0%, #48cc6c 100%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold">Skor IKL</h4>
                      <p className="text-sm text-white/80">
                        Indeks Ketahanan Ekologi
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:scale-110">
                      <span className="text-xl">🌱</span>
                    </div>
                  </div>
                  <p className="mb-2 text-right text-2xl font-bold sm:text-3xl">
                    {skorIKL}
                  </p>
                  <div className="h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-300 group-hover:bg-white/90"
                      style={{ width: `${parseFloat(skorIKL) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mb-8">
            <Card className="group relative overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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
                      {statusIDM}
                    </span>
                    dan membutuhkan peningkatan sebesar{" "}
                    <span className="mx-1 font-bold text-orange-600">
                      +{penambahan}
                    </span>
                    untuk mencapai status{" "}
                    <span className="mx-1 font-bold text-blue-600">
                      {targetStatus}
                    </span>
                    .
                  </p>
                  <div className="mt-6">
                    <div className="mb-2 h-4 w-full rounded-full bg-gray-200">
                      <div
                        className="h-4 rounded-full transition-all duration-500 group-hover:opacity-90"
                        style={{
                          width: `${(parseFloat(skorIDM) / parseFloat(skorMinimal)) * 100}%`,
                          background:
                            "linear-gradient(135deg, #00b4d8 0%, #48cc6c 100%)",
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Progress menuju target:{" "}
                      {(
                        (parseFloat(skorIDM) / parseFloat(skorMinimal)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <FooterDesa />
    </div>
  );
}
