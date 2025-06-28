import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  formatCurrency,
  formatCurrencyWithSign,
  getIDMStatusTextColor,
} from "@/utils/formatters";
import {
  QuickStatsSkeleton,
  StatCardSkeleton,
  SectionHeaderSkeleton,
} from "@/components/ui/skeleton";
import {
  FileText,
  AlertCircle,
  Clock,
  DollarSign,
  Receipt,
  Wallet,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  Info,
  ArrowUp,
  ArrowDown,
  Activity,
  Building,
  MapPin,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: boolean;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  change,
  changeType,
  textColor,
}) => (
  <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/40 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/40 hover:shadow-2xl">
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    {/* Floating particles effect */}
    <div className="relative z-10 flex items-start justify-between">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`rounded-2xl p-3 ${color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            {title}
          </p>
        </div>

        <div className="space-y-2">
          <p
            className={`text-3xl leading-none font-black tracking-tight ${textColor || "text-gray-900"}`}
          >
            {value}
          </p>

          {subtitle && (
            <p className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <Calendar className="h-3 w-3" />
              {subtitle}
            </p>
          )}

          {change && (
            <div className="flex items-center gap-2">
              {changeType === "positive" && (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              )}
              {changeType === "negative" && (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <p
                className={`text-xs font-bold ${
                  changeType === "positive"
                    ? "text-emerald-600"
                    : changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {change}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Animated border */}
    <div
      className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        padding: "1px",
        background:
          "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
      }}
    />
  </div>
);

const SectionHeader: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
}> = ({ title, description, icon: Icon }) => (
  <div className="mb-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="text-sm font-medium text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const QuickStats: React.FC<{
  stats: {
    surat: { total: number; diajukan: number };
    artikel: { total: number; diajukan: number };
    pengaduan: { total: number; diajukan: number };
    keuangan: {
      pendapatan: number;
      belanja: number;
      saldo: number;
      tahun: number;
    };
    idm: {
      skor: number;
      status: string;
      target: string;
      skorMinimal: number;
      tahun: number;
      komponen: { skorIKE: number; skorIKS: number; skorIKL: number };
    };
  };
  navigate: (path: string) => void;
}> = ({ stats, navigate }) => (
  <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-2xl backdrop-blur-xl">
    {/* Animated background patterns */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
    <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/5 to-transparent blur-3xl" />
    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-500/5 to-transparent blur-3xl" />

    <div className="relative z-10">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Ringkasan Cepat</h3>
          <p className="text-sm font-medium text-gray-600">
            Overview statistik utama desa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div
          onClick={() => navigate("/admin/surat")}
          className="group cursor-pointer rounded-2xl border border-white/30 bg-white/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:shadow-lg"
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <p className="mb-1 text-3xl font-black text-yellow-600">
            {stats.surat.diajukan}
          </p>
          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
            Surat Diajukan
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/artikel")}
          className="group cursor-pointer rounded-2xl border border-white/30 bg-white/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:shadow-lg"
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <p className="mb-1 text-3xl font-black text-indigo-600">
            {stats.artikel.diajukan}
          </p>
          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
            Artikel Diajukan
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/pengaduan")}
          className="group cursor-pointer rounded-2xl border border-white/30 bg-white/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:shadow-lg"
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <p className="mb-1 text-3xl font-black text-orange-600">
            {stats.pengaduan.diajukan}
          </p>
          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
            Pengaduan Diajukan
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/idm")}
          className="group cursor-pointer rounded-2xl border border-white/30 bg-white/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:shadow-lg"
        >
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <p
            className={`mb-1 text-3xl font-black ${getIDMStatusTextColor(stats.idm.skor)}`}
          >
            {stats.idm.skor}
          </p>
          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
            Skor IDM
          </p>
        </div>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="space-y-12">
    {/* Quick Stats Skeleton */}
    <QuickStatsSkeleton />

    {/* Administrative Services Skeleton */}
    <div>
      <SectionHeaderSkeleton />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>

    {/* Content Management Skeleton */}
    <div>
      <SectionHeaderSkeleton />
      <div className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>

    {/* Financial Overview Skeleton */}
    <div>
      <SectionHeaderSkeleton />
      <div className="grid gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>

    {/* IDM Skeleton */}
    <div>
      <SectionHeaderSkeleton />
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div>
          <div className="mb-6 h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  // Default stats for loading state
  const defaultStats = {
    surat: { total: 0, diajukan: 0 },
    artikel: { total: 0, diajukan: 0 },
    pengaduan: { total: 0, diajukan: 0 },
    keuangan: { pendapatan: 0, belanja: 0, saldo: 0, tahun: 0 },
    idm: {
      skor: 0,
      status: "",
      target: "",
      skorMinimal: 0,
      tahun: 0,
      komponen: { skorIKE: 0, skorIKS: 0, skorIKL: 0 },
    },
  };

  const currentStats = stats || defaultStats;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Enhanced Header */}
          <div className="relative border-b border-white/30 bg-gradient-to-r from-white/90 via-white/80 to-white/70 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="relative px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-2xl">
                    <Building className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">
                      Dashboard Desa
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-lg font-medium text-gray-600">
                      <MapPin className="h-4 w-4" />
                      Monitoring dan statistik sistem informasi desa
                    </p>
                  </div>
                </div>
                {error && (
                  <button
                    onClick={() => refetch()}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Muat Ulang
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50 to-pink-50 p-16 text-center shadow-xl">
                <AlertCircle className="mx-auto mb-6 h-20 w-20 text-red-400" />
                <h3 className="mb-4 text-2xl font-bold text-red-900">
                  Terjadi Kesalahan
                </h3>
                <p className="text-lg text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Gagal mengambil data dashboard"}
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-6 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Quick Stats Overview */}
                <QuickStats stats={currentStats} navigate={navigate} />

                {/* Administrative Services */}
                <div>
                  <SectionHeader
                    title="Layanan Administratif"
                    description="Statistik surat dan pengaduan masyarakat"
                    icon={Users}
                  />
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      title="Total Surat"
                      value={currentStats.surat.total}
                      icon={FileText}
                      color="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
                      change={
                        currentStats.surat.diajukan > 0
                          ? `${currentStats.surat.diajukan} menunggu`
                          : "Semua terproses"
                      }
                      changeType={
                        currentStats.surat.diajukan > 0 ? "neutral" : "positive"
                      }
                    />
                    <StatCard
                      title="Surat Diajukan"
                      value={currentStats.surat.diajukan}
                      icon={Clock}
                      color="bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-600"
                      change={`${((currentStats.surat.diajukan / Math.max(currentStats.surat.total, 1)) * 100).toFixed(1)}% dari total`}
                      changeType="neutral"
                    />
                    <StatCard
                      title="Total Pengaduan"
                      value={currentStats.pengaduan.total}
                      icon={AlertCircle}
                      color="bg-gradient-to-br from-red-100 to-pink-100 text-red-600"
                      change={
                        currentStats.pengaduan.diajukan > 0
                          ? `${currentStats.pengaduan.diajukan} diajukan`
                          : "Semua ditangani"
                      }
                      changeType={
                        currentStats.pengaduan.diajukan > 0
                          ? "negative"
                          : "positive"
                      }
                    />
                    <StatCard
                      title="Pengaduan Diajukan"
                      value={currentStats.pengaduan.diajukan}
                      icon={Clock}
                      color="bg-gradient-to-br from-orange-100 to-red-100 text-orange-600"
                      change={`${((currentStats.pengaduan.diajukan / Math.max(currentStats.pengaduan.total, 1)) * 100).toFixed(1)}% dari total`}
                      changeType="neutral"
                    />
                  </div>
                </div>

                {/* Content Management */}
                <div>
                  <SectionHeader
                    title="Manajemen Konten"
                    description="Statistik artikel dan publikasi"
                    icon={FileText}
                  />
                  <div className="grid gap-8 md:grid-cols-2">
                    <StatCard
                      title="Total Artikel"
                      value={currentStats.artikel.total}
                      icon={FileText}
                      color="bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600"
                      change={
                        currentStats.artikel.diajukan > 0
                          ? `${currentStats.artikel.diajukan} dalam review`
                          : "Semua dipublikasi"
                      }
                      changeType={
                        currentStats.artikel.diajukan > 0
                          ? "neutral"
                          : "positive"
                      }
                    />
                    <StatCard
                      title="Artikel Diajukan"
                      value={currentStats.artikel.diajukan}
                      icon={Clock}
                      color="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600"
                      change={`${((currentStats.artikel.diajukan / Math.max(currentStats.artikel.total, 1)) * 100).toFixed(1)}% dari total`}
                      changeType="neutral"
                    />
                  </div>
                </div>

                {/* Financial Overview */}
                <div>
                  <SectionHeader
                    title="Ringkasan Keuangan"
                    description="Laporan APBDesa dan anggaran"
                    icon={DollarSign}
                  />
                  <div className="grid gap-8 md:grid-cols-3">
                    <StatCard
                      title="Total Pendapatan"
                      value={
                        formatCurrency(currentStats.keuangan.pendapatan).text
                      }
                      icon={DollarSign}
                      color={
                        formatCurrency(currentStats.keuangan.pendapatan)
                          .isNegative
                          ? "bg-gradient-to-br from-red-100 to-pink-100 text-red-600"
                          : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
                      }
                      subtitle={`Tahun Anggaran ${currentStats.keuangan.tahun}`}
                      textColor={
                        formatCurrency(currentStats.keuangan.pendapatan)
                          .isNegative
                          ? "text-red-600"
                          : formatCurrency(currentStats.keuangan.pendapatan)
                                .isPositive
                            ? "text-emerald-600"
                            : undefined
                      }
                    />
                    <StatCard
                      title="Total Belanja"
                      value={formatCurrency(currentStats.keuangan.belanja).text}
                      icon={Receipt}
                      color={
                        formatCurrency(currentStats.keuangan.belanja).isNegative
                          ? "bg-gradient-to-br from-red-100 to-pink-100 text-red-600"
                          : "bg-gradient-to-br from-orange-100 to-red-100 text-orange-600"
                      }
                      subtitle={`Tahun Anggaran ${currentStats.keuangan.tahun}`}
                      change={`${((currentStats.keuangan.belanja / Math.max(currentStats.keuangan.pendapatan, 1)) * 100).toFixed(1)}% dari pendapatan`}
                      changeType="neutral"
                      textColor="text-red-600"
                    />
                    <StatCard
                      title="Saldo Akhir"
                      value={
                        formatCurrencyWithSign(currentStats.keuangan.saldo).text
                      }
                      icon={Wallet}
                      color={
                        formatCurrencyWithSign(currentStats.keuangan.saldo)
                          .isNegative
                          ? "bg-gradient-to-br from-red-100 to-pink-100 text-red-600"
                          : "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
                      }
                      subtitle={`Tahun Anggaran ${currentStats.keuangan.tahun}`}
                      change={
                        currentStats.keuangan.saldo > 0 ? "Surplus" : "Defisit"
                      }
                      changeType={
                        currentStats.keuangan.saldo > 0
                          ? "positive"
                          : "negative"
                      }
                      textColor={
                        formatCurrencyWithSign(currentStats.keuangan.saldo)
                          .isNegative
                          ? "text-red-600"
                          : formatCurrencyWithSign(currentStats.keuangan.saldo)
                                .isPositive
                            ? "text-emerald-600"
                            : undefined
                      }
                    />
                  </div>
                </div>

                {/* Village Development Index */}
                <div>
                  <SectionHeader
                    title="Indeks Desa Membangun (IDM)"
                    description="Penilaian tingkat perkembangan desa"
                    icon={TrendingUp}
                  />
                  <div className="space-y-8">
                    {/* Main IDM Stats */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                      <StatCard
                        title="Skor IDM"
                        value={currentStats.idm.skor}
                        icon={TrendingUp}
                        color="bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
                        subtitle={`Evaluasi ${currentStats.idm.tahun}`}
                        textColor={getIDMStatusTextColor(currentStats.idm.skor)}
                      />
                      <StatCard
                        title="Status Saat Ini"
                        value={currentStats.idm.status}
                        icon={BarChart3}
                        color="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
                        subtitle={`Evaluasi ${currentStats.idm.tahun}`}
                        textColor={getIDMStatusTextColor(
                          currentStats.idm.status,
                        )}
                      />
                      <StatCard
                        title="Target Status"
                        value={currentStats.idm.target}
                        icon={TrendingUp}
                        color="bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
                        subtitle="Target pencapaian"
                        textColor={getIDMStatusTextColor(
                          currentStats.idm.target,
                        )}
                      />
                      <StatCard
                        title="Skor Minimal"
                        value={currentStats.idm.skorMinimal}
                        icon={Info}
                        color="bg-gradient-to-br from-gray-100 to-slate-100 text-gray-600"
                        subtitle="Standar minimum"
                        textColor={getIDMStatusTextColor(
                          currentStats.idm.target,
                        )}
                      />
                    </div>

                    {/* IDM Components */}
                    <div>
                      <h3 className="mb-6 text-2xl font-bold text-gray-900">
                        Komponen Penilaian IDM
                      </h3>
                      <div className="grid gap-8 md:grid-cols-3">
                        <StatCard
                          title="Indeks Ketahanan Ekonomi"
                          value={currentStats.idm.komponen.skorIKE}
                          icon={DollarSign}
                          color="bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
                          subtitle="Aspek ekonomi desa"
                          textColor={getIDMStatusTextColor(
                            currentStats.idm.komponen.skorIKE,
                          )}
                        />
                        <StatCard
                          title="Indeks Ketahanan Sosial"
                          value={currentStats.idm.komponen.skorIKS}
                          icon={Users}
                          color="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
                          subtitle="Aspek sosial budaya"
                          textColor={getIDMStatusTextColor(
                            currentStats.idm.komponen.skorIKS,
                          )}
                        />
                        <StatCard
                          title="Indeks Ketahanan Lingkungan"
                          value={currentStats.idm.komponen.skorIKL}
                          icon={TrendingUp}
                          color="bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600"
                          subtitle="Aspek lingkungan"
                          textColor={getIDMStatusTextColor(
                            currentStats.idm.komponen.skorIKL,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
