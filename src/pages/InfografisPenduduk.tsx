import { PieChart, Pie, Cell, Label, Tooltip, LabelList } from "recharts";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import NavbarDesa from "@/components/NavbarDesa";
import FooterDesa from "@/components/FooterDesa";
import InfografisNav from "@/components/InfografisNav";
import { useDesa } from "@/contexts/DesaContext";

interface PendudukStats {
  total_penduduk: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_kk: number;
  data_usia: {
    [key: string]: number;
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

const COLORS = {
  primary: "#49904D", // Forest green
  secondary: "#55A84D", // Light forest green
  accent1: "#69B458", // Lime green
  accent2: "#6CA7E0", // Sky blue
  accent3: "#578EC8", // Steel blue
  yellow: "#F4EB3C", // Bright yellow
  lightYellow: "#DEDF41", // Light yellow
};

export default function InfografisPenduduk() {
  const { loading } = useDesa();
  const [stats, setStats] = React.useState<PendudukStats | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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

  // Data untuk pie chart penduduk desa
  const chartDataPenduduk = React.useMemo(() => {
    if (!stats) return [];
    return [
      {
        gender: "Laki-laki",
        jumlah: stats.total_laki_laki,
        fill: "#2563EB", // Deep blue for male
      },
      {
        gender: "Perempuan",
        jumlah: stats.total_perempuan,
        fill: "#EC4899", // Pink for female
      },
    ];
  }, [stats]);

  // Data umur penduduk
  const chartDataUmur = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.data_usia).map(([kelompokUmur, jumlah]) => ({
      kelompokUmur: kelompokUmur.replace("_", "-"),
      laki: Math.floor(jumlah / 2), // Assuming equal distribution
      perempuan: Math.ceil(jumlah / 2),
    }));
  }, [stats]);

  // Data pendidikan penduduk
  const chartDataPendidikan = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.data_pendidikan).map(([tingkat, jumlah]) => ({
      tingkat,
      jumlah,
    }));
  }, [stats]);

  // Data pekerjaan penduduk
  const dataPekerjaan = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.data_pekerjaan).map(([name, jumlah]) => ({
      name,
      jumlah,
    }));
  }, [stats]);

  // Data status penduduk
  const dataStatus = React.useMemo(() => {
    if (!stats) return [];
    return [
      {
        name: "Belum Menikah",
        jumlah: stats.data_status_perkawinan.belum_menikah,
      },
      { name: "Menikah", jumlah: stats.data_status_perkawinan.menikah },
      { name: "Cerai Hidup", jumlah: stats.data_status_perkawinan.cerai_hidup },
      { name: "Cerai Mati", jumlah: stats.data_status_perkawinan.cerai_mati },
    ];
  }, [stats]);

  // Data agama penduduk
  const dataAgama = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.data_agama).map(([name, jumlah]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      jumlah,
    }));
  }, [stats]);

  const chartConfigUmur = {
    laki: {
      label: "Laki-laki",
      color: COLORS.primary,
    },
    perempuan: {
      label: "Perempuan",
      color: COLORS.secondary,
    },
  } satisfies ChartConfig;

  const chartConfigPendidikan = {
    pendidikan: {
      label: "Pendidikan",
      color: COLORS.accent2,
    },
  } satisfies ChartConfig;

  if (loading || !stats) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <NavbarDesa />
        <div className="container mx-auto px-4">
          <InfografisNav activeTab="penduduk" />

          {/* Judul Demografi Placeholder */}
          <div className="mb-8">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Bagian 1: Total Penduduk dan Jenis Kelamin Placeholder */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col items-stretch md:flex-row">
              <div className="flex-shrink-0 p-8 md:w-1/2">
                <div className="mx-auto aspect-square max-h-[350px] animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="flex-1 p-8">
                <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="ml-auto h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="ml-auto h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 2: Data Umur Warga Placeholder */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-[300px] animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Bagian 3: Data Pendidikan Warga Placeholder */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-[300px] animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Bagian 4: Data Pekerjaan Warga Placeholder */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-auto h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 5: Data Status Warga Placeholder */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-auto h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian 6: Data Agama Warga Placeholder */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-auto h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <NavbarDesa />
        <div className="container mx-auto px-4">
          <InfografisNav activeTab="penduduk" />
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />

      <div className="container mx-auto px-4">
        <InfografisNav activeTab="penduduk" />

        {/* Judul Demografi */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            DEMOGRAFI PENDUDUK
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Memberikan informasi lengkap mengenai karakteristik demografi
            penduduk suatu wilayah. Mulai dari jumlah penduduk, usia, jenis
            kelamin, tingkat pendidikan, pekerjaan, agama, dan aspek penting
            lainnya yang menggambarkan komposisi populasi secara rinci.
          </p>
        </div>

        {/* Bagian 1: Total Penduduk dan Jenis Kelamin */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-stretch md:flex-row">
            {/* Bagian Kiri - Pie Chart */}
            <div className="from-white-50 to-white-100 flex flex-shrink-0 flex-col items-center justify-center bg-gradient-to-br p-8 md:w-1/2 dark:from-gray-800 dark:to-gray-700">
              <div className="mx-auto aspect-square max-h-[350px]">
                <PieChart width={350} height={350}>
                  <Tooltip
                    content={({ active, payload }) => {
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
                    }}
                  />
                  <Pie
                    data={chartDataPenduduk}
                    dataKey="jumlah"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    innerRadius={120}
                    outerRadius={170}
                    fill="#8884d8"
                    stroke="#fff"
                    strokeWidth={2}
                    isAnimationActive={true}
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
                                className="text-3xl font-bold"
                                style={{ fill: COLORS.primary }}
                              >
                                {stats.total_penduduk.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 28}
                                className="text-base"
                                style={{ fill: COLORS.secondary }}
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
              </div>
              <div className="mt-4 w-full max-w-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: COLORS.primary }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Laki-laki
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.total_laki_laki.toLocaleString()} jiwa
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: COLORS.secondary }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Perempuan
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.total_perempuan.toLocaleString()} jiwa
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian Kanan - Informasi Tambahan */}
            <div className="flex-1 p-8">
              <h2
                className="mb-2 text-3xl font-bold"
                style={{ color: COLORS.primary }}
              >
                Data Penduduk
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Informasi statistik penduduk dan kepala keluarga desa
              </p>

              <div className="space-y-6">
                {/* Total Penduduk */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-1 text-xl font-bold text-black">
                    Total Penduduk
                  </h3>
                  <p
                    className="text-right text-3xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {stats.total_penduduk.toLocaleString()}{" "}
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-400">
                      jiwa
                    </span>
                  </p>
                </div>

                {/* Jumlah Kepala Keluarga */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-1 text-xl font-bold text-black">
                    Jumlah Kepala Keluarga
                  </h3>
                  <p
                    className="text-right text-3xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {stats.total_kk.toLocaleString()}{" "}
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-400">
                      KK
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian 2: Data Umur Warga */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Card>
            <CardHeader>
              <CardTitle>Data Umur Warga</CardTitle>
              <CardDescription>Distribusi umur penduduk desa</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigUmur}>
                <BarChart accessibilityLayer data={chartDataUmur}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="kelompokUmur"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="laki" fill="var(--color-laki)" radius={4} />
                  <Bar
                    dataKey="perempuan"
                    fill="var(--color-perempuan)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Kelompok umur produktif mendominasi{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Menampilkan distribusi penduduk berdasarkan kelompok umur dan
                jenis kelamin
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Bagian 3: Data Pendidikan Warga */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Card>
            <CardHeader>
              <CardTitle>Data Pendidikan Warga</CardTitle>
              <CardDescription>
                Tingkat pendidikan penduduk desa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigPendidikan}>
                <BarChart
                  accessibilityLayer
                  data={chartDataPendidikan}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="tingkat"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="jumlah"
                    fill="var(--color-pendidikan)"
                    radius={8}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Tamatan SD/Sederajat mendominasi{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Menampilkan distribusi penduduk berdasarkan tingkat pendidikan
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Bagian 4: Data Pekerjaan Warga */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Data Pekerjaan Warga
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {dataPekerjaan.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {item.name}
                </h4>
                <p className="mt-2 text-right text-2xl font-bold text-gray-900 dark:text-white">
                  {item.jumlah.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian 5: Data Status Warga */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Data Status Warga
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dataStatus.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {item.name}
                </h4>
                <p className="mt-2 text-right text-2xl font-bold text-gray-900 dark:text-white">
                  {item.jumlah.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian 6: Data Agama Warga */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            Data Agama Warga
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataAgama.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {item.name}
                </h4>
                <p className="mt-2 text-right text-2xl font-bold text-gray-900 dark:text-white">
                  {item.jumlah.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <FooterDesa />
    </main>
  );
}
