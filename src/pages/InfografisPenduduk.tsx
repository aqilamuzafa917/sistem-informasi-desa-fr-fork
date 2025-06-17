import {
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import * as React from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  Heart,
  Moon,
  Calendar,
  Activity,
  MapPin,
} from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import InfografisNav from "@/components/InfografisNav";
import { useDesa } from "@/contexts/DesaContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/infografis/Card";
import { StatCard } from "@/components/infografis/StatCard";
import { GridCard } from "@/components/infografis/GridCard";
import {
  getJobIcon,
  getReligionIcon,
  getMaritalStatusIcon,
} from "@/components/infografis/iconUtils";

interface PendudukStats {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_kk: number;
  data_usia: {
    [key: string]: {
      laki_laki: number;
      perempuan: number;
    };
  };
  data_pendidikan: {
    [key: string]: number;
  };
  data_pekerjaan: {
    [key: string]: number;
  };
  data_status_perkawinan: {
    [key: string]: number;
  };
  data_agama: {
    [key: string]: number;
  };
}

// NEW: Updated color palette based on the new brand colors
const COLORS = {
  primary: "#00b4d8", // Teal
  secondary: "#48cc6c", // Green
  accent: "#0096c7", // Deeper Blue/Teal
  surface: "#ffffff",
  background: "#f0f9ff", // Light Sky Blue
  text: "#083344", // Dark Cyan
  textSecondary: "#475569", // Slate Gray
};

const CHART_COLORS = [
  "#00b4d8",
  "#48cc6c",
  "#0096c7",
  "#90e0ef",
  "#fca311",
  "#70e000",
  "#0077b6",
  "#ade8f4",
];

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        const currentCount = Math.floor((progress / duration) * value);
        setCount(currentCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
};

export default function InfografisPenduduk() {
  const [stats, setStats] = React.useState<PendudukStats | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { desaConfig } = useDesa();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const handleMouseEnter = (state: { activeTooltipIndex?: number }) => {
    if (state && state.activeTooltipIndex !== undefined) {
      setActiveIndex(state.activeTooltipIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/publik/penduduk/stats`,
          {
            headers: API_CONFIG.headers,
          },
        );
        setStats(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchStats();
  }, []);

  const chartDataPenduduk = React.useMemo(() => {
    if (!stats) return [];
    return [
      {
        gender: "Laki-laki",
        jumlah: stats.total_laki_laki,
        fill: COLORS.primary,
        percentage: (
          (stats.total_laki_laki / stats.total_penduduk) *
          100
        ).toFixed(1),
      },
      {
        gender: "Perempuan",
        jumlah: stats.total_perempuan,
        fill: COLORS.secondary,
        percentage: (
          (stats.total_perempuan / stats.total_penduduk) *
          100
        ).toFixed(1),
      },
    ];
  }, [stats]);

  const chartDataUmur = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.data_usia).map(([kelompokUmur, data]) => ({
      kelompokUmur,
      laki: data.laki_laki,
      perempuan: data.perempuan,
      total: data.laki_laki + data.perempuan,
    }));
  }, [stats]);

  const chartDataPendidikan = React.useMemo(() => {
    if (!stats) return [];
    const total = Object.values(stats.data_pendidikan).reduce(
      (sum, val) => sum + val,
      0,
    );
    return Object.entries(stats.data_pendidikan).map(
      ([tingkat, jumlah], index) => ({
        tingkat,
        jumlah,
        fill: CHART_COLORS[index % CHART_COLORS.length],
        percentage: ((jumlah / total) * 100).toFixed(1),
      }),
    );
  }, [stats]);

  const dataPekerjaan = React.useMemo(
    () =>
      Object.entries(stats?.data_pekerjaan || {})
        .map(([name, jumlah]) => ({
          name,
          jumlah,
        }))
        .sort((a, b) => b.jumlah - a.jumlah), // Sort by highest value
    [stats],
  );

  const [showAllJobs, setShowAllJobs] = React.useState(false);
  const displayedJobs = showAllJobs
    ? dataPekerjaan
    : dataPekerjaan.slice(0, 12);

  const dataStatus = React.useMemo(
    () =>
      stats
        ? [
            {
              name: "Belum Menikah",
              jumlah: stats.data_status_perkawinan.belum_menikah,
            },
            { name: "Menikah", jumlah: stats.data_status_perkawinan.menikah },
            {
              name: "Cerai Hidup",
              jumlah: stats.data_status_perkawinan.cerai_hidup,
            },
            {
              name: "Cerai Mati",
              jumlah: stats.data_status_perkawinan.cerai_mati,
            },
          ]
        : [],
    [stats],
  );
  const dataAgama = React.useMemo(
    () =>
      Object.entries(stats?.data_agama || {}).map(([name, jumlah]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        jumlah,
      })),
    [stats],
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavbarDesa />
        <div className="container mx-auto space-y-8 px-4 py-8">
          <InfografisNav activeTab="penduduk" />
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavbarDesa />
        <div className="container mx-auto space-y-8 px-4 py-8">
          <InfografisNav activeTab="penduduk" />
          <div className="animate-pulse space-y-8">
            {/* Hero Section Placeholder */}
            <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 p-8">
              <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
                <div className="h-48 w-48 rounded-full bg-gray-300"></div>
              </div>
              <div className="relative z-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-300"></div>
                      <div className="h-8 w-48 rounded-lg bg-gray-300"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      <div className="h-4 w-64 rounded-lg bg-gray-300"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      <div className="h-4 w-32 rounded-lg bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      <div className="h-4 w-24 rounded-lg bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Stats Card Placeholder */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="flex flex-col gap-8 xl:flex-row">
                {/* Left Side - Pie Chart */}
                <div className="xl:w-1/2">
                  <div className="aspect-square max-w-lg rounded-2xl bg-gray-100"></div>
                  <div className="mt-8 space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-2xl bg-gray-100 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                            <div className="h-6 w-24 rounded-lg bg-gray-200"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-20 rounded-lg bg-gray-200"></div>
                            <div className="h-4 w-12 rounded-lg bg-gray-200"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Stats */}
                <div className="xl:w-1/2">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                    <div>
                      <div className="mb-2 h-6 w-48 rounded-lg bg-gray-200"></div>
                      <div className="h-4 w-64 rounded-lg bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-2xl bg-gray-100 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
                            <div>
                              <div className="mb-1 h-5 w-32 rounded-lg bg-gray-200"></div>
                              <div className="h-4 w-24 rounded-lg bg-gray-200"></div>
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
                        </div>
                        <div className="flex items-baseline justify-end gap-2">
                          <div className="h-8 w-32 rounded-lg bg-gray-200"></div>
                          <div className="h-5 w-12 rounded-lg bg-gray-200"></div>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="rounded-2xl bg-gray-100 p-4">
                          <div className="mb-2 h-8 w-24 rounded-lg bg-gray-200"></div>
                          <div className="h-6 w-16 rounded-lg bg-gray-200"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white p-8 shadow-lg">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                    <div>
                      <div className="mb-2 h-6 w-48 rounded-lg bg-gray-200"></div>
                      <div className="h-4 w-64 rounded-lg bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="h-80 rounded-2xl bg-gray-100"></div>
                </div>
              ))}
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
        <InfografisNav activeTab="penduduk" />

        {/* Hero Section */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
              <Users size={200} className="rotate-12 transform" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                      <Users size={24} />
                    </div>
                    <h1 className="text-4xl font-bold">
                      Data Demografi Desa {desaConfig?.nama_desa}
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
                    <span>Data Tahun {new Date().getFullYear()}</span>
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

        <Card className="mb-12 overflow-hidden" gradient={true}>
          <div className="flex flex-col xl:flex-row">
            <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50/50 to-green-50/50 p-12 xl:w-1/2">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-green-500/5"></div>
              <div className="relative w-full max-w-lg">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-2xl border border-gray-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
                              <div className="text-lg font-bold text-slate-800">
                                {data.gender}
                              </div>
                              <div className="text-xl font-bold text-cyan-600">
                                {data.jumlah.toLocaleString()} Jiwa
                              </div>
                              <div className="font-medium text-slate-600">
                                {data.percentage}% dari total
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={chartDataPenduduk}
                      dataKey="jumlah"
                      nameKey="gender"
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={160}
                      stroke="#fff"
                      strokeWidth={6}
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {chartDataPenduduk.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                                  className="fill-slate-800 text-4xl font-black"
                                >
                                  <AnimatedCounter
                                    value={stats.total_penduduk}
                                  />
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 25}
                                  className="fill-slate-600 text-base font-semibold"
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
              <div className="mt-8 w-full max-w-md space-y-4">
                {chartDataPenduduk.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-6 w-6 rounded-full shadow-md"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-lg font-bold text-slate-700">
                        {item.gender}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-800">
                        {item.jumlah.toLocaleString()}
                      </span>
                      <div className="text-sm font-semibold text-slate-600">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative p-12 xl:w-1/2">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 p-3 shadow-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-4xl font-black text-transparent">
                    Data Penduduk
                  </h2>
                  <p className="mt-2 text-lg font-medium text-slate-600">
                    Statistik demografis terkini
                  </p>
                </div>
              </div>
              <div className="space-y-8">
                <StatCard
                  title="Total Penduduk"
                  value={<AnimatedCounter value={stats.total_penduduk} />}
                  unit="jiwa"
                  icon={Users}
                  trend="+2.3%"
                  gradient={true}
                />
                <StatCard
                  title="Jumlah Kepala Keluarga"
                  value={<AnimatedCounter value={stats.total_kk} />}
                  unit="KK"
                  icon={UserCheck}
                  trend="+1.8%"
                  gradient={true}
                />
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-cyan-200/50 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 p-6">
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-black text-cyan-600">
                        {(stats.total_penduduk / stats.total_kk).toFixed(1)}
                      </div>
                      <div className="text-sm font-semibold text-slate-600">
                        Rata-rata per KK
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6">
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-black text-green-600">
                        {stats.total_laki_laki > stats.total_perempuan
                          ? (
                              (stats.total_laki_laki / stats.total_perempuan) *
                              100
                            ).toFixed(0)
                          : (
                              (stats.total_perempuan / stats.total_laki_laki) *
                              100
                            ).toFixed(0)}
                      </div>
                      <div className="text-sm font-semibold text-slate-600">
                        Rasio Gender
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle icon={UserCheck}>Distribusi Usia Penduduk</CardTitle>
            <CardDescription>
              Analisis mendalam distribusi usia dengan breakdown gender untuk
              setiap kelompok umur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <AreaChart
                data={chartDataUmur}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="gradientLaki" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradientPerempuan"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS.secondary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.secondary}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="kelompokUmur"
                  tick={{ fontSize: 14, fill: "#64748b", fontWeight: 600 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  stroke="#94a3b8"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-2xl border border-gray-200/50 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
                          <p className="mb-3 text-lg font-bold text-slate-800">
                            Kelompok Usia {label} tahun
                          </p>
                          <div className="space-y-2">
                            <p
                              className="font-semibold"
                              style={{ color: COLORS.primary }}
                            >
                              👨 Laki-laki: {payload[0].value} jiwa
                            </p>
                            <p
                              className="font-semibold"
                              style={{ color: COLORS.secondary }}
                            >
                              👩 Perempuan: {payload[1].value} jiwa
                            </p>
                            <div className="mt-3 border-t pt-2">
                              <p className="font-bold text-slate-800">
                                📊 Total: {payload[0].payload.total} jiwa
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="laki"
                  stackId="1"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fill="url(#gradientLaki)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="perempuan"
                  stackId="1"
                  stroke={COLORS.secondary}
                  strokeWidth={3}
                  fill="url(#gradientPerempuan)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div
                  className="h-6 w-6 rounded-full shadow-md"
                  style={{ backgroundColor: COLORS.primary }}
                ></div>
                <span className="text-lg font-semibold text-slate-700">
                  👨 Laki-laki
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-6 w-6 rounded-full shadow-md"
                  style={{ backgroundColor: COLORS.secondary }}
                ></div>
                <span className="text-lg font-semibold text-slate-700">
                  👩 Perempuan
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle icon={GraduationCap}>
              Tingkat Pendidikan Penduduk
            </CardTitle>
            <CardDescription>
              Visualisasi distribusi tingkat pendidikan dengan breakdown jumlah
              penduduk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-12 lg:flex-row">
              <div className="lg:w-1/2">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartDataPendidikan}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="tingkat"
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                      stroke="#94a3b8"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      stroke="#94a3b8"
                      label={{
                        value: "",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-2xl border border-gray-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
                              <div className="text-lg font-bold text-slate-800">
                                {label}
                              </div>
                              <div className="text-xl font-bold text-cyan-600">
                                {data.jumlah.toLocaleString()} jiwa
                              </div>
                              <div className="font-medium text-slate-600">
                                {data.percentage}% dari total
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="jumlah"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationBegin={0}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {chartDataPendidikan.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          fillOpacity={activeIndex === index ? 1 : 0.8}
                          stroke={activeIndex === index ? entry.fill : "none"}
                          strokeWidth={activeIndex === index ? 3 : 0}
                          style={{
                            filter:
                              activeIndex === index
                                ? "drop-shadow(0 8px 16px rgba(0,180,216,0.3))"
                                : "none",
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 lg:w-1/2">
                {chartDataPendidikan
                  .sort((a, b) => b.jumlah - a.jumlah) // Sort by highest value
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="h-6 w-6 rounded-full shadow-md"
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <div>
                          <span className="font-bold text-slate-800">
                            {item.tingkat}
                          </span>
                          <div className="text-sm text-slate-600">
                            {item.percentage}% dari total
                          </div>
                        </div>
                      </div>
                      <span className="text-xl font-black text-slate-800">
                        {item.jumlah.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-12">
          <GridCard
            title="Data Pekerjaan Penduduk"
            data={displayedJobs}
            columns={3}
            icon={Briefcase}
            customItemIcon={getJobIcon}
            footer={
              dataPekerjaan.length > 12 && (
                <button
                  onClick={() => setShowAllJobs(!showAllJobs)}
                  className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-gray-50 hover:text-slate-800"
                >
                  {showAllJobs
                    ? "Tampilkan Lebih Sedikit"
                    : `Tampilkan ${dataPekerjaan.length - 12} Pekerjaan Lainnya`}
                </button>
              )
            }
          />
          <GridCard
            title="Status Perkawinan Penduduk"
            data={dataStatus}
            columns={2}
            icon={Heart}
            customItemIcon={getMaritalStatusIcon}
          />
          <GridCard
            title="Keberagaman Agama Penduduk"
            data={dataAgama}
            columns={3}
            icon={Moon}
            customItemIcon={getReligionIcon}
          />
        </div>
      </div>
      <FooterDesa />
    </div>
  );
}
