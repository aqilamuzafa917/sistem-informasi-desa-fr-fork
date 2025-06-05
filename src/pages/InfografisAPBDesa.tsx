import { LabelList } from "recharts";
import * as React from "react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
export default function InfografisAPBDesa() {
  // Tambahkan state untuk tahun yang dipilih
  const [selectedYear, setSelectedYear] = React.useState("2025");

  // Data untuk APBDesa
  const desaNama = "Batujajar Timur";
  const kecamatan = "Batujajar";
  const kabupaten = "Bandung Barat";
  const provinsi = "Jawa Barat";

  // Data perbandingan pendapatan dan belanja per tahun
  const dataPerbandinganTahunan = [
    {
      tahun: "2021",
      pendapatan: 3046366800,
      belanja: 3116145362,
      pendapatanAsliDesa: 15000000,
      pendapatanTransfer: 3030366800,
      pendapatanLainLain: 1000000,
      penerimaan: 69778562,
      pengeluaran: 0,
      surplusDefisit: 0,
      belanjaDesa: [
        { kategori: "Penyelenggaraan Pemerintahan Desa", jumlah: 900000000 },
        { kategori: "Pelaksanaan Pembangunan Desa", jumlah: 1600000000 },
        { kategori: "Pembinaan Kemasyarakatan Desa", jumlah: 190000000 },
        { kategori: "Pemberdayaan Masyarakat Desa", jumlah: 320000000 },
        {
          kategori: "Penanggulangan Bencana, dan Keadaan Mendesak Desa",
          jumlah: 106145362,
        },
      ],
    },
    {
      tahun: "2024",
      pendapatan: 2577636000,
      belanja: 2591292403,
      pendapatanAsliDesa: 10000000,
      pendapatanTransfer: 2566636000,
      pendapatanLainLain: 1000000,
      penerimaan: 13656403,
      pengeluaran: 0,
      surplusDefisit: 0,
      belanjaDesa: [
        { kategori: "Penyelenggaraan Pemerintahan Desa", jumlah: 800000000 },
        { kategori: "Pelaksanaan Pembangunan Desa", jumlah: 1300000000 },
        { kategori: "Pembinaan Kemasyarakatan Desa", jumlah: 180000000 },
        { kategori: "Pemberdayaan Masyarakat Desa", jumlah: 250000000 },
        {
          kategori: "Penanggulangan Bencana, dan Keadaan Mendesak Desa",
          jumlah: 61292403,
        },
      ],
    },
    {
      tahun: "2025",
      pendapatan: 3274172780,
      belanja: 3301178128,
      pendapatanAsliDesa: 0,
      pendapatanTransfer: 3273172780,
      pendapatanLainLain: 1000000,
      penerimaan: 27005348,
      pengeluaran: 0,
      surplusDefisit: 0,
      belanjaDesa: [
        { kategori: "Penyelenggaraan Pemerintahan Desa", jumlah: 937047110 },
        { kategori: "Pelaksanaan Pembangunan Desa", jumlah: 1696158000 },
        { kategori: "Pembinaan Kemasyarakatan Desa", jumlah: 194066500 },
        { kategori: "Pemberdayaan Masyarakat Desa", jumlah: 329928000 },
        {
          kategori: "Penanggulangan Bencana, dan Keadaan Mendesak Desa",
          jumlah: 143978518,
        },
      ],
    },
  ];

  const selectedYearData =
    dataPerbandinganTahunan.find((data) => data.tahun === selectedYear) ||
    dataPerbandinganTahunan[2]; // Default ke 2025 jika tidak ditemukan

  // Data pendapatan dan belanja untuk bagian 1 dan 2 (berubah sesuai tahun yang dipilih)
  const totalPendapatan = selectedYearData.pendapatan;
  const totalBelanja = selectedYearData.belanja;
  const totalAPBDesa = totalPendapatan;
  const pendapatanAsliDesa = selectedYearData.pendapatanAsliDesa;
  const pendapatanTransfer = selectedYearData.pendapatanTransfer;
  const pendapatanLainLain = selectedYearData.pendapatanLainLain;
  const penerimaan = selectedYearData.penerimaan;
  const pengeluaran = selectedYearData.pengeluaran;
  const surplusDefisit = selectedYearData.surplusDefisit;

  // Data untuk chart "Pendapatan Desa" (bagian 4) - sekarang menggunakan data tahun yang dipilih
  const dataPendapatanDesa = [
    {
      kategori: "Pendapatan Asli Desa",
      jumlah: selectedYearData.pendapatanAsliDesa,
    },
    {
      kategori: "Pendapatan Transfer",
      jumlah: selectedYearData.pendapatanTransfer,
    },
    {
      kategori: "Pendapatan Lain-lain",
      jumlah: selectedYearData.pendapatanLainLain,
    },
  ];

  // Data untuk chart "Belanja Desa" (bagian 5) - sekarang menggunakan data tahun yang dipilih
  const dataBelanjaDesa = selectedYearData.belanjaDesa;

  // Konfigurasi chart untuk perbandingan tahunan
  const chartConfigPerbandingan = {
    pendapatan: {
      label: "Pendapatan",
      color: "#3b82f6", // blue-500
    },
    belanja: {
      label: "Belanja",
      color: "#29B6F6", // violet-500
    },
  } satisfies ChartConfig;

  // Format angka ke format rupiah dengan format seperti di gambar
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(angka)
      .replace("IDR", "Rp")
      .replace(",00", ",00"); // Mempertahankan 2 angka di belakang koma
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar Section */}
      <NavbarDesa />
      <div className="container mx-auto px-4">
        {/* Judul Halaman */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            INFOGRAFIS DESA {desaNama.toUpperCase()}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Penduduk
              </span>
            </div>
          </a>

          <a href="/Infografis/apbdesa" className="flex flex-col items-center">
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              APBDes
            </span>
            <div className="mt-1 h-1 w-16 rounded-full bg-blue-600 dark:bg-blue-400"></div>
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

        {/* Judul APB Desa */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              APB Desa {desaNama} Tahun {selectedYear}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Desa {desaNama}, Kecamatan {kecamatan}, Kabupaten {kabupaten},
              Provinsi {provinsi}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
              }}
            >
              <option value="2021">2021</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Bagian 1: Ringkasan APBDesa */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Pendapatan */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Pendapatan
              </h3>
            </div>
            <p className="mt-2 text-right text-2xl font-bold text-green-600 dark:text-green-400">
              {formatRupiah(totalPendapatan)}
            </p>
          </div>

          {/* Belanja */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Belanja
              </h3>
            </div>
            <p className="mt-2 text-right text-2xl font-bold text-red-600 dark:text-red-400">
              {formatRupiah(totalBelanja)}
            </p>
          </div>
        </div>

        {/* Bagian 2: Pembiayaan */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
            Pembiayaan
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Penerimaan */}
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Penerimaan
                </h4>
              </div>
              <p className="mt-2 text-right text-xl font-bold text-green-600 dark:text-green-400">
                {formatRupiah(penerimaan)}
              </p>
            </div>

            {/* Pengeluaran */}
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Pengeluaran
                </h4>
              </div>
              <p className="mt-2 text-right text-xl font-bold text-gray-600 dark:text-gray-400">
                {formatRupiah(pengeluaran)}
              </p>
            </div>
          </div>

          {/* Surplus/Defisit */}
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Surplus/Defisit
              </h4>
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                {formatRupiah(surplusDefisit)}
              </p>
            </div>
          </div>
        </div>

        {/* Bagian 4: Pendapatan Desa */}
        <div className="mb-8">
          <h3 className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
            Pendapatan Desa {selectedYear}
          </h3>
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan Desa</CardTitle>
              <CardDescription>Tahun {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  jumlah: {
                    label: "Jumlah",
                    color: "#3b82f6", // blue-500
                  },
                }}
              >
                <BarChart
                  accessibilityLayer
                  data={dataPendapatanDesa}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="kategori"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={8}>
                    <LabelList
                      dataKey="jumlah"
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value) => formatRupiah(value)}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bagian 5: Belanja Desa */}
        <div className="mb-8">
          <h3 className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
            Belanja Desa {selectedYear}
          </h3>
          <Card>
            <CardHeader>
              <CardTitle>Belanja Desa</CardTitle>
              <CardDescription>Tahun {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  jumlah: {
                    label: "Jumlah",
                    color: "#29B6F6", // violet-500
                  },
                }}
              >
                <BarChart
                  accessibilityLayer
                  data={dataBelanjaDesa}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="kategori"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={8}>
                    <LabelList
                      dataKey="jumlah"
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value) => formatRupiah(value)}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bagian 3: Grafik Pendapatan dan Belanja per Tahun */}
        <div className="mb-8">
          <h3 className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
            Pendapatan dan Belanja Desa dari Tahun ke Tahun
          </h3>
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan dan Belanja Desa</CardTitle>
              <CardDescription>Tahun 2021 - 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigPerbandingan}>
                <BarChart accessibilityLayer data={dataPerbandinganTahunan}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="tahun"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="pendapatan"
                    fill="var(--color-pendapatan)"
                    radius={4}
                  />
                  <Bar
                    dataKey="belanja"
                    fill="var(--color-belanja)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Section */}
      <FooterDesa />
    </main>
  );
}
