import { LabelList } from "recharts";
import * as React from "react";
import axios from "axios";

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
  // Tambahkan state untuk tahun yang dipilih
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [apbDesaData, setApbDesaData] = React.useState<APBDesaData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { desaConfig } = useDesa();

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

  // Data untuk APBDesa
  const desaNama = desaConfig?.nama_desa || "Loading...";
  const kecamatan = desaConfig?.nama_kecamatan || "Loading...";
  const kabupaten = desaConfig?.nama_kabupaten || "Loading...";
  const provinsi = desaConfig?.nama_provinsi || "Loading...";

  // Get selected year data
  const selectedYearData = apbDesaData.find(
    (data) => data.tahun_anggaran.toString() === selectedYear,
  );

  // Data perbandingan pendapatan dan belanja per tahun
  const dataPerbandinganTahunan = apbDesaData.map((data) => ({
    tahun: data.tahun_anggaran.toString(),
    pendapatan: parseFloat(data.total_pendapatan),
    belanja: parseFloat(data.total_belanja),
    pendapatanAsliDesa: parseFloat(
      data.detail_pendapatan["Pendapatan Asli Desa"],
    ),
    pendapatanTransfer: parseFloat(
      data.detail_pendapatan["Pendapatan Transfer"],
    ),
    pendapatanLainLain: parseFloat(
      data.detail_pendapatan["Pendapatan Lain-lain"].toString(),
    ),
    belanjaDesa: Object.entries(data.detail_belanja).map(
      ([kategori, jumlah]) => ({
        kategori,
        jumlah: parseFloat(jumlah),
      }),
    ),
  }));

  // Data untuk chart "Pendapatan Desa" (bagian 4)
  const dataPendapatanDesa = selectedYearData
    ? [
        {
          kategori: "Pendapatan Asli Desa",
          jumlah: parseFloat(
            selectedYearData.detail_pendapatan["Pendapatan Asli Desa"],
          ),
        },
        {
          kategori: "Pendapatan Transfer",
          jumlah: parseFloat(
            selectedYearData.detail_pendapatan["Pendapatan Transfer"],
          ),
        },
        {
          kategori: "Pendapatan Lain-lain",
          jumlah: parseFloat(
            selectedYearData.detail_pendapatan[
              "Pendapatan Lain-lain"
            ].toString(),
          ),
        },
      ]
    : [];

  // Data untuk chart "Belanja Desa" (bagian 5)
  const dataBelanjaDesa = selectedYearData
    ? Object.entries(selectedYearData.detail_belanja).map(
        ([kategori, jumlah]) => ({
          kategori,
          jumlah: parseFloat(jumlah),
        }),
      )
    : [];

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

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <NavbarDesa />
        <div className="container mx-auto px-4">
          <InfografisNav activeTab="apbdesa" />

          {/* Judul APB Desa */}
          <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="mt-2 h-6 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Bagian 1: Ringkasan APBDesa */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Pendapatan */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="mt-2 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Belanja */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="mt-2 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Bagian 4: Pendapatan Desa */}
          <div className="mb-8">
            <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <Card>
              <CardHeader>
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </CardHeader>
              <CardContent>
                <div className="relative h-[300px] w-full">
                  <div className="absolute top-0 right-0 bottom-0 left-0 flex items-end justify-around">
                    <div className="h-1/3 w-16 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-2/3 w-16 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-1/4 w-16 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bagian 5: Belanja Desa */}
          <div className="mb-8">
            <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <Card>
              <CardHeader>
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </CardHeader>
              <CardContent>
                <div className="relative h-[300px] w-full">
                  <div className="absolute top-0 right-0 bottom-0 left-0 flex items-end justify-around">
                    <div className="h-1/4 w-16 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-1/2 w-16 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-1/3 w-16 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bagian 3: Grafik Pendapatan dan Belanja per Tahun */}
          <div className="mb-8">
            <div className="mb-4 h-8 w-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <Card>
              <CardHeader>
                <div className="h-6 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </CardHeader>
              <CardContent>
                <div className="relative h-[300px] w-full">
                  <div className="absolute top-0 right-0 bottom-0 left-0 flex items-end justify-around">
                    <div className="flex h-full w-16 flex-col items-center justify-end gap-2">
                      <div className="h-1/3 w-full animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-2/3 w-full animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="flex h-full w-16 flex-col items-center justify-end gap-2">
                      <div className="h-1/2 w-full animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-3/4 w-full animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="flex h-full w-16 flex-col items-center justify-end gap-2">
                      <div className="h-2/3 w-full animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4/5 w-full animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <FooterDesa />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <NavbarDesa />
      <div className="container mx-auto px-4">
        <InfografisNav activeTab="apbdesa" />

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
              {apbDesaData.map((data) => (
                <option key={data.tahun_anggaran} value={data.tahun_anggaran}>
                  {data.tahun_anggaran}
                </option>
              ))}
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
              {selectedYearData
                ? formatRupiah(parseFloat(selectedYearData.total_pendapatan))
                : "Loading..."}
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
              {selectedYearData
                ? formatRupiah(parseFloat(selectedYearData.total_belanja))
                : "Loading..."}
            </p>
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
                      formatter={(value: number) => formatRupiah(value)}
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
                      formatter={(value: number) => formatRupiah(value)}
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
              <CardDescription>
                Tahun {apbDesaData[0]?.tahun_anggaran} -{" "}
                {apbDesaData[apbDesaData.length - 1]?.tahun_anggaran}
              </CardDescription>
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
