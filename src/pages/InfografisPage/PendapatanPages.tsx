"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Pie,
  PieChart,
  Sector,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { API_CONFIG } from "../../config/api";
import { DollarSign, Building2, ArrowUpRight, Plus } from "lucide-react";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Button } from "@/components/ui/button";

interface PendapatanData {
  tahun_anggaran: number;
  total_pendapatan: string;
  detail_pendapatan: {
    "Pendapatan Asli Desa": string;
    "Pendapatan Transfer": string | number;
    "Pendapatan Lain-lain": string | number;
  };
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    payload?: {
      fill?: string;
    };
  }>;
  label?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  percentage: string;
  gradientKey: string;
}

// Add new constants for enhanced design
const COLORS = {
  asli: "#3b82f6",
  transfer: "#10b981",
  lain: "#f59e0b",
  gradient: {
    asli: ["#3b82f6", "#1d4ed8"],
    transfer: ["#10b981", "#059669"],
    lain: ["#f59e0b", "#d97706"],
  },
};

// Enhanced Custom Tooltip
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
        <p className="mb-3 text-lg font-semibold text-gray-900">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full shadow-sm"
                  style={{
                    backgroundColor: entry.color || entry.payload?.fill,
                  }}
                />
                <span className="text-sm font-medium text-gray-600">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                Rp {new Intl.NumberFormat("id-ID").format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Enhanced Pie Chart Label (this will be removed as its logic is merged into renderActiveShape)
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//       className="font-bold text-sm drop-shadow-lg"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// Custom components for better UI
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <Card className="border-0 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="mb-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-4 ${color} shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function PendapatanPages() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined,
  );
  const [apiData, setApiData] = useState<PendapatanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<
    Array<{
      year: number;
      asli: number;
      transfer: number;
      lain: number;
    }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token:", token ? "Token exists" : "No token found");

        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          navigate("/");
          return;
        }

        console.log(
          "Fetching data from:",
          `${API_CONFIG.baseURL}/api/publik/apbdesa/multi-tahun`,
        );
        const response = await axios.get(
          `${API_CONFIG.baseURL}/api/publik/apbdesa/multi-tahun`,
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("API Response:", response.data);

        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          const data = response.data.data;
          // Sort data by year in descending order
          const sortedData = [...data].sort(
            (a, b) => b.tahun_anggaran - a.tahun_anggaran,
          );
          // Take only the last 3 years
          const lastThreeYears = sortedData.slice(0, 3);

          // Transform data for the chart
          const chartData = lastThreeYears.map((item) => ({
            year: item.tahun_anggaran,
            asli: parseFloat(item.detail_pendapatan["Pendapatan Asli Desa"]),
            transfer: parseFloat(
              String(item.detail_pendapatan["Pendapatan Transfer"]),
            ),
            lain: parseFloat(
              String(item.detail_pendapatan["Pendapatan Lain-lain"]),
            ),
          }));

          setHistoricalData(chartData);

          const latestData = sortedData[0];
          console.log("Latest Data:", latestData);
          setApiData(latestData);

          // Set the initial active index to the first item for the pie chart
          if (chartData.length > 0) {
            setActiveIndex(0);
          }
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

  const formatCurrency = (amount: number) =>
    `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;

  // Enhanced Active Shape for Pie Chart moved inside the component
  const renderActiveShape = (props: PieSectorDataItem) => {
    const {
      cx = 0,
      cy = 0,
      innerRadius = 0,
      outerRadius = 0,
      startAngle,
      endAngle,
      fill,
    } = props;
    // const sin = Math.sin(-RADIAN * midAngle);
    // const cos = Math.cos(-RADIAN * midAngle);

    // For the connector line and outside labels (variables commented out as they are no longer used)
    // const sx = cx + (outerRadius + 10) * cos;
    // const sy = cy + (outerRadius + 10) * sin;
    // const mx = cx + (outerRadius + 30) * cos;
    // const my = cy + (outerRadius + 30) * sin;
    // const ex = mx + (cos >= 0 ? 1 : -1) * 22; // Extend horizontally
    // const ey = my;
    // const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        {/* Sector elements */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="drop-shadow-lg"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          className="animate-pulse"
        />

        {/* Connector line (commented out as per user request) */}
        {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" className="drop-shadow" /> */}
        {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}

        {/* Text elements outside the slice (commented out as per user request) */}
        {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#374151" className="font-semibold"> */}
        {/* {payload.name} */}
        {/* </text> */}
      </g>
    );
  };

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

  const chartData: ChartDataItem[] = [
    {
      name: "Pendapatan Asli Desa",
      value: pendapatanAsli,
      fill: COLORS.asli,
      percentage: ((pendapatanAsli / totalPendapatan) * 100).toFixed(1),
      gradientKey: "asli",
    },
    {
      name: "Pendapatan Transfer",
      value: pendapatanTransfer,
      fill: COLORS.transfer,
      percentage: ((pendapatanTransfer / totalPendapatan) * 100).toFixed(1),
      gradientKey: "transfer",
    },
    {
      name: "Pendapatan Lain-lain",
      value: pendapatanLain,
      fill: COLORS.lain,
      percentage: ((pendapatanLain / totalPendapatan) * 100).toFixed(1),
      gradientKey: "lain",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Pendapatan Desa
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Kelola data pendapatan desa
                </p>
              </div>
              <Button
                onClick={() => navigate("/pendapatan/tambah")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Tambah Pendapatan
              </Button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-700">
                {error}
              </div>
            )}
            {!error && apiData && (
              <div className="mx-auto max-w-7xl space-y-8">
                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                  <StatCard
                    title="Total Pendapatan"
                    value={formatCurrency(totalPendapatan)}
                    icon={DollarSign}
                    color="bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                  <StatCard
                    title="Pendapatan Asli Desa"
                    value={formatCurrency(pendapatanAsli)}
                    icon={Building2}
                    color="bg-gradient-to-r from-green-500 to-green-600"
                  />
                  <StatCard
                    title="Pendapatan Transfer"
                    value={formatCurrency(pendapatanTransfer)}
                    icon={ArrowUpRight}
                    color="bg-gradient-to-r from-purple-500 to-purple-600"
                  />
                  <StatCard
                    title="Pendapatan Lain-lain"
                    value={formatCurrency(pendapatanLain)}
                    icon={DollarSign}
                    color="bg-gradient-to-r from-orange-500 to-orange-600"
                  />
                </div>

                {/* Enhanced Charts */}
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                  {/* Enhanced Pie Chart */}
                  <Card className="border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Komposisi Pendapatan {apiData.tahun_anggaran}
                      </CardTitle>
                      <p className="mt-2 text-gray-600">
                        Distribusi sumber pendapatan desa dengan visualisasi
                        interaktif
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <defs>
                              {Object.entries(COLORS.gradient).map(
                                ([key, colors]) => (
                                  <linearGradient
                                    key={key}
                                    id={`gradient-${key}`}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                  >
                                    <stop offset="0%" stopColor={colors[0]} />
                                    <stop offset="100%" stopColor={colors[1]} />
                                  </linearGradient>
                                ),
                              )}
                            </defs>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              innerRadius={60}
                              dataKey="value"
                              activeIndex={activeIndex}
                              activeShape={renderActiveShape}
                              onMouseEnter={(_, index) => setActiveIndex(index)}
                              className="transition-all duration-300"
                            >
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#gradient-${entry.gradientKey})`}
                                  className="transition-opacity duration-200 hover:opacity-80"
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Enhanced Legend */}
                      <div className="mt-6 space-y-4">
                        {chartData.map((item, index) => (
                          <div
                            key={index}
                            className={`flex cursor-pointer items-center justify-between rounded-xl p-4 transition-all duration-300 ${
                              activeIndex === index
                                ? "scale-105 bg-gradient-to-r from-blue-50 to-green-50 shadow-md"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                            onMouseEnter={() => setActiveIndex(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="h-4 w-4 rounded-full shadow-sm"
                                style={{ backgroundColor: item.fill }}
                              />
                              <span className="font-medium text-gray-800">
                                {item.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {formatCurrency(item.value)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.percentage}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Bar Chart */}
                  <Card className="border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Tren Pendapatan 3 Tahun Terakhir
                      </CardTitle>
                      <p className="mt-2 text-gray-600">
                        Perkembangan pendapatan dari berbagai sumber dengan
                        animasi interaktif
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={historicalData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient
                                id="gradient-asli"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0.9}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#1d4ed8"
                                  stopOpacity={0.7}
                                />
                              </linearGradient>
                              <linearGradient
                                id="gradient-transfer"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#10b981"
                                  stopOpacity={0.9}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#059669"
                                  stopOpacity={0.7}
                                />
                              </linearGradient>
                              <linearGradient
                                id="gradient-lain"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0.9}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#d97706"
                                  stopOpacity={0.7}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                              className="opacity-30"
                            />
                            <XAxis
                              dataKey="year"
                              stroke="#6b7280"
                              fontSize={12}
                              tick={{ fill: "#6b7280" }}
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={12}
                              tickFormatter={(value) =>
                                `${(value / 1e9).toFixed(1)}M`
                              }
                              tick={{ fill: "#6b7280" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                              wrapperStyle={{ paddingTop: "20px" }}
                              iconType="circle"
                            />
                            <Bar
                              dataKey="asli"
                              name="Pendapatan Asli Desa"
                              fill="url(#gradient-asli)"
                              radius={[4, 4, 0, 0]}
                              className="transition-all duration-300 hover:opacity-80"
                            />
                            <Bar
                              dataKey="transfer"
                              name="Pendapatan Transfer"
                              fill="url(#gradient-transfer)"
                              radius={[4, 4, 0, 0]}
                              className="transition-all duration-300 hover:opacity-80"
                            />
                            <Bar
                              dataKey="lain"
                              name="Pendapatan Lain-lain"
                              fill="url(#gradient-lain)"
                              radius={[4, 4, 0, 0]}
                              className="transition-all duration-300 hover:opacity-80"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Enhanced Summary Cards */}
                      <div className="mt-6 grid grid-cols-1 gap-4">
                        {historicalData.map((item, index) => {
                          const total = item.asli + item.transfer + item.lain;

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-green-50 p-4 transition-all duration-300 hover:shadow-md"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-800">
                                  Total Pendapatan {item.year}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {formatCurrency(total)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Area Chart for Trend Analysis */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          Tabel Detail Pendapatan Tahun{" "}
                          {historicalData[0]?.year}
                        </CardTitle>
                        <p className="mt-2 text-gray-600">
                          Rincian pendapatan desa tahun{" "}
                          {historicalData[0]?.year} dengan breakdown setiap
                          jenis pendapatan
                        </p>
                      </div>
                      <Button
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
                        onClick={() => navigate("/pendapatan/detail")}
                      >
                        Detail Pendapatan
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Jenis Pendapatan
                            </th>
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Jumlah
                            </th>
                            <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                              Persentase
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {historicalData.length > 0 &&
                            (() => {
                              const latestData = historicalData[0];
                              const total =
                                latestData.asli +
                                latestData.transfer +
                                latestData.lain;

                              const rows = [
                                {
                                  name: "Pendapatan Asli Desa",
                                  value: latestData.asli,
                                  color: "from-blue-500 to-blue-600",
                                },
                                {
                                  name: "Pendapatan Transfer",
                                  value: latestData.transfer,
                                  color: "from-green-500 to-green-600",
                                },
                                {
                                  name: "Pendapatan Lain-lain",
                                  value: latestData.lain,
                                  color: "from-orange-500 to-orange-600",
                                },
                              ];

                              return (
                                <>
                                  {rows.map((row, index) => (
                                    <tr
                                      key={index}
                                      className="transition-colors hover:bg-gray-50"
                                    >
                                      <td className="border-b border-gray-200 px-6 py-4">
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`h-3 w-3 rounded-full bg-gradient-to-r ${row.color}`}
                                          />
                                          <span className="text-sm font-medium text-gray-900">
                                            {row.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="border-b border-gray-200 px-6 py-4 text-sm font-semibold text-gray-900">
                                        {formatCurrency(row.value)}
                                      </td>
                                      <td className="border-b border-gray-200 px-6 py-4 text-sm text-gray-600">
                                        {((row.value / total) * 100).toFixed(1)}
                                        %
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <td className="border-b border-gray-200 px-6 py-4">
                                      <span className="text-sm font-bold text-gray-900">
                                        Total Pendapatan
                                      </span>
                                    </td>
                                    <td className="border-b border-gray-200 px-6 py-4 text-sm font-bold text-gray-900">
                                      {formatCurrency(total)}
                                    </td>
                                    <td className="border-b border-gray-200 px-6 py-4 text-sm font-bold text-gray-900">
                                      100%
                                    </td>
                                  </tr>
                                </>
                              );
                            })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
