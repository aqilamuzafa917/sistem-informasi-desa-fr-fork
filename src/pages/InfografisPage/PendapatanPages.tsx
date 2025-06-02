"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

interface PendapatanData {
  tahun_anggaran: number;
  total_pendapatan: string;
  detail_pendapatan: {
    "Pendapatan Asli Desa": string;
    "Pendapatan Transfer": string | number;
    "Pendapatan Lain-lain": string | number;
  };
}

interface ApiResponse {
  status: string;
  data: PendapatanData[];
}

const initialChartData = [
  { pendapatan: "asli", total: 0, fill: "var(--color-asli)" },
  { pendapatan: "transfer", total: 0, fill: "var(--color-transfer)" },
  { pendapatan: "lain", total: 0, fill: "var(--color-lain)" },
];

const chartConfig = {
  asli: {
    label: "Asli",
    color: "#3b82f6",
  },
  transfer: {
    label: "Transfer",
    color: "#29B6F6",
  },
  lain: {
    label: "Lain-lain",
    color: "#E76E50",
  },
} satisfies ChartConfig;

interface PayloadItem {
  name: string;
  value: number;
  payload: PieSectorDataItem;
  dataKey: string;
  color?: string;
  fill?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
  config: ChartConfig;
}

const CustomTooltip = ({ active, payload, config }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const name = data.name as string;
    const value = data.value as number;
    const color =
      config[name]?.color || data.payload?.fill || data.color || data.fill;

    const formattedValue = `Rp. ${new Intl.NumberFormat("id-ID").format(value)}`;
    const label = config[name]?.label || name;

    return (
      <div className="bg-background rounded-lg border p-2 text-sm shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
          <div>
            <span className="text-muted-foreground">{label}: </span>
            <span className="text-foreground">{formattedValue}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function PendapatanPages() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined,
  );
  const [apiData, setApiData] = useState<PendapatanData | null>(null);
  const [chartData, setChartData] = useState(initialChartData);
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          navigate("/");
          return;
        }

        const response = await axios.get<ApiResponse>(
          "https://thankful-urgently-silkworm.ngrok-free.app/api/publik/apbdesa/multi-tahun",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          },
        );

        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          const latestData = response.data.data.reduce((latest, current) => {
            return current.tahun_anggaran > latest.tahun_anggaran
              ? current
              : latest;
          }, response.data.data[0]);
          setApiData(latestData);
          setYear(latestData.tahun_anggaran);

          const newChartData = [
            {
              pendapatan: "asli",
              total: parseFloat(
                latestData.detail_pendapatan["Pendapatan Asli Desa"],
              ),
              fill: "var(--color-asli)",
            },
            {
              pendapatan: "transfer",
              total: parseFloat(
                String(latestData.detail_pendapatan["Pendapatan Transfer"]),
              ),
              fill: "var(--color-transfer)",
            },
            {
              pendapatan: "lain",
              total: parseFloat(
                String(latestData.detail_pendapatan["Pendapatan Lain-lain"]),
              ),
              fill: "var(--color-lain)",
            },
          ];
          setChartData(newChartData);
        } else if (response.data.data.length === 0) {
          setError("Tidak ada data pendapatan yang tersedia.");
        } else {
          setError(
            "Gagal mengambil data pendapatan: Status API bukan success atau tidak ada data.",
          );
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Sesi Anda telah berakhir. Silakan login kembali.");
            navigate("/");
          } else if (err.response?.status === 404) {
            setError("Endpoint API tidak ditemukan (404).");
          } else {
            setError("Gagal mengambil data pendapatan.");
          }
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const totalPendapatan = apiData ? parseFloat(apiData.total_pendapatan) : 0;
  const pendapatanAsli = apiData
    ? parseFloat(apiData.detail_pendapatan["Pendapatan Asli Desa"])
    : 0;
  const pendapatanTransfer = apiData
    ? parseFloat(String(apiData.detail_pendapatan["Pendapatan Transfer"]))
    : 0;
  const pendapatanLain = apiData
    ? parseFloat(String(apiData.detail_pendapatan["Pendapatan Lain-lain"]))
    : 0;

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-center justify-center p-4">
            <Spinner size="xl" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  Infografis Desa
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Pendapatan Desa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-700">
              {error}
            </div>
          )}
          {!error && apiData && (
            <>
              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <Card className="flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle>Total Pendapatan Tahun {year}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[250px]"
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<CustomTooltip config={chartConfig} />}
                        />
                        <Pie
                          data={chartData}
                          dataKey="total"
                          nameKey="pendapatan"
                          outerRadius={100}
                          innerRadius={60}
                          strokeWidth={5}
                          activeIndex={activeIndex}
                          activeShape={({
                            outerRadius = 0,
                            ...props
                          }: PieSectorDataItem) => (
                            <Sector {...props} outerRadius={outerRadius + 10} />
                          )}
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(undefined)}
                        />
                        <ChartLegend
                          content={<ChartLegendContent nameKey="pendapatan" />}
                          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <div className="flex max-h-96 flex-col gap-2 rounded-xl">
                  <Card className="flex max-h-20">
                    <div className="flex w-full flex-row items-center justify-start gap-x-4 px-4 py-2">
                      <span className="text-base font-semibold">
                        Total Pendapatan Tahun {year}:
                      </span>
                      <p className="text-xl font-bold">
                        {`Rp. ${new Intl.NumberFormat("id-ID").format(totalPendapatan)}`}
                      </p>
                    </div>
                  </Card>
                  <Card className="flex max-h-20">
                    <div className="flex w-full flex-row items-center justify-start gap-x-18 px-4 py-2">
                      <span className="text-base font-semibold">
                        Total Pendapatan Asli:
                      </span>
                      <p className="text-xl font-bold">
                        {`Rp. ${new Intl.NumberFormat("id-ID").format(pendapatanAsli)}`}
                      </p>
                    </div>
                  </Card>
                  <Card className="flex max-h-20">
                    <div className="flex w-full flex-row items-center justify-start gap-x-10 px-4 py-2">
                      <span className="text-base font-semibold">
                        Total Pendapatan Transfer:
                      </span>
                      <p className="text-xl font-bold">
                        {`Rp. ${new Intl.NumberFormat("id-ID").format(pendapatanTransfer)}`}
                      </p>
                    </div>
                  </Card>
                  <Card className="flex max-h-20">
                    <div className="flex w-full flex-row items-center justify-start gap-x-8 px-4 py-2">
                      <span className="text-base font-semibold">
                        Total Pendapatan Lain-Lain:
                      </span>
                      <p className="text-xl font-bold">
                        {`Rp. ${new Intl.NumberFormat("id-ID").format(pendapatanLain)}`}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
