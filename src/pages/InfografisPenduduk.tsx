import { PieChart, Pie, Cell, Label, Tooltip, LabelList } from "recharts";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
export default function InfografisPenduduk() {
  // Data untuk pie chart penduduk desa
  const chartDataPenduduk = [
    { gender: "Laki-laki", jumlah: 2750, fill: "#94a3b8" }, // slate-400
    { gender: "Perempuan", jumlah: 2500, fill: "#cbd5e1" }, // slate-300
  ];

  // Menghitung total penduduk
  const totalPenduduk = React.useMemo(() => {
    return chartDataPenduduk.reduce((acc, curr) => acc + curr.jumlah, 0);
  }, [chartDataPenduduk]);

  // Jumlah kepala keluarga
  const jumlahKK = 1250;

  // Data agama penduduk
  const dataAgama = [
    { name: "Islam", jumlah: 4500 },
    { name: "Kristen", jumlah: 350 },
    { name: "Katolik", jumlah: 200 },
    { name: "Hindu", jumlah: 100 },
    { name: "Buddha", jumlah: 50 },
    { name: "Konghucu", jumlah: 50 },
  ];

  // Data pekerjaan penduduk
  const dataPekerjaan = [
    { name: "Telah Bekerja", jumlah: 1200 },
    { name: "Belum/Tidak Bekerja", jumlah: 950 },
    { name: "Pelajar/Mahasiswa", jumlah: 450 },
  ];

  // Data status penduduk
  const dataStatus = [
    { name: "Belum Kawin", jumlah: 2100 },
    { name: "Kawin", jumlah: 2700 },
  ];

  const chartDataUmur = [
    { kelompokUmur: "0-4", laki: 186, perempuan: 170 },
    { kelompokUmur: "5-9", laki: 210, perempuan: 190 },
    { kelompokUmur: "10-14", laki: 245, perempuan: 220 },
    { kelompokUmur: "15-19", laki: 230, perempuan: 215 },
    { kelompokUmur: "20-24", laki: 280, perempuan: 260 },
    { kelompokUmur: "25-29", laki: 320, perempuan: 290 },
  ];

  const chartConfigUmur = {
    laki: {
      label: "Laki-laki",
      color: "#94a3b8", // slate-400
    },
    perempuan: {
      label: "Perempuan",
      color: "#cbd5e1", // slate-300
    },
  } satisfies ChartConfig;

  const chartDataPendidikan = [
    { tingkat: "Tidak/Belum Sekolah", jumlah: 998 },
    { tingkat: "Belum Tamat SD", jumlah: 644 },
    { tingkat: "Tamat SD", jumlah: 3164 },
    { tingkat: "SLTP/Sederajat", jumlah: 416 },
    { tingkat: "SLTA/Sederajat", jumlah: 238 },
    { tingkat: "Diploma I/II", jumlah: 7 },
    { tingkat: "Diploma III", jumlah: 4 },
    { tingkat: "Diploma IV/S1", jumlah: 21 },
    { tingkat: "Strata II", jumlah: 0 },
    { tingkat: "Strata III", jumlah: 152 },
  ];

  const chartConfigPendidikan = {
    pendidikan: {
      label: "Pendidikan",
      color: "#3b82f6", // blue-500
    },
  } satisfies ChartConfig;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />

      <div className="container mx-auto px-4">
        {/* Judul Halaman */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            INFOGRAFIS DESA BATUJAJAR TIMUR
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Informasi statistik dan data desa dalam bentuk visual
          </p>
        </div>

        {/* Navigasi Tab */}
        <div className="mb-8 flex flex-wrap justify-center gap-8">
          <a href="/Infografis/penduduk" className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Penduduk
              </span>
              <div className="mt-1 h-1 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
            </div>
          </a>

          <a href="/Infografis/apbdesa" className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              APBDes
            </span>
          </a>

          <a href="/Infografis/idm" className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                <svg
                  className="h-6 w-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                IDM
              </span>
            </div>
          </a>
        </div>

        {/* Judul Demografi */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
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
                            <div>{data.jumlah.toLocaleString()} jiwa</div>
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
                                className="fill-gray-900 text-3xl font-bold dark:fill-white"
                              >
                                {totalPenduduk.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 28}
                                className="fill-gray-600 text-base dark:fill-gray-400"
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
                      style={{ backgroundColor: "#94a3b8" }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Laki-laki
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {chartDataPenduduk[0].jumlah.toLocaleString()} jiwa
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: "#cbd5e1" }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Perempuan
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {chartDataPenduduk[1].jumlah.toLocaleString()} jiwa
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian Kanan - Informasi Tambahan */}
            <div className="flex-1 p-8">
              <h2 className="mb-2 text-3xl font-bold text-gray-700 dark:text-indigo-400">
                Data Penduduk
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Informasi statistik penduduk dan kepala keluarga desa
              </p>

              <div className="space-y-6">
                {/* Total Penduduk */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-1 text-xl font-bold text-gray-700 dark:text-gray-300">
                    Total Penduduk
                  </h3>
                  <p className="text-right text-3xl font-bold text-gray-900 dark:text-white">
                    {totalPenduduk.toLocaleString()}{" "}
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-400">
                      jiwa
                    </span>
                  </p>
                </div>

                {/* Jumlah Kepala Keluarga */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-1 text-xl font-bold text-gray-700 dark:text-gray-300">
                    Jumlah Kepala Keluarga
                  </h3>
                  <p className="text-right text-3xl font-bold text-gray-900 dark:text-white">
                    {jumlahKK.toLocaleString()}{" "}
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
