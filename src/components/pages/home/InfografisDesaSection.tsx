import * as React from "react";
import {
  Label,
  Pie,
  PieChart,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Users, Home, Info } from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "@/config/api";
import { PendudukStats, CustomTooltipProps } from "@/types/desa";
import { ErrorState } from "@/components/ui/ErrorState";

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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
};

export function InfografisDesaSection() {
  const [pendudukStats, setPendudukStats] =
    React.useState<PendudukStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPendudukStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<PendudukStats>(
        `${API_CONFIG.baseURL}/api/publik/penduduk/stats`,
        { headers: API_CONFIG.headers },
      );
      setPendudukStats(response.data);
    } catch (err) {
      console.error("Error fetching population stats:", err);
      setError("Gagal mengambil data statistik penduduk");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendudukStats();
    const interval = setInterval(fetchPendudukStats, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const chartDataPenduduk = React.useMemo(() => {
    if (!pendudukStats) return [];
    const total = pendudukStats.total_penduduk;
    return [
      {
        gender: "Laki-laki",
        jumlah: pendudukStats.total_laki_laki,
        fill: "#578EC8",
        percentage: parseFloat(
          ((pendudukStats.total_laki_laki / total) * 100).toFixed(1),
        ),
      },
      {
        gender: "Perempuan",
        jumlah: pendudukStats.total_perempuan,
        fill: "#55A84D",
        percentage: parseFloat(
          ((pendudukStats.total_perempuan / total) * 100).toFixed(1),
        ),
      },
    ];
  }, [pendudukStats]);

  const totalPenduduk = React.useMemo(
    () => pendudukStats?.total_penduduk || 0,
    [pendudukStats],
  );
  const jumlahKK = pendudukStats?.total_kk || 0;

  if (error) {
    return <ErrorState error={error} onRetry={fetchPendudukStats} />;
  }

  return (
    <div className="mb-8">
      <div className="rounded-3xl border border-gray-100/50 bg-white shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row">
          {/* Chart Section */}
          <div className="bg-gradient-to-br from-cyan-50/50 to-green-50/50 p-8 lg:w-1/2 dark:from-gray-800 dark:to-gray-700">
            <div className="flex flex-col items-center">
              <div className="aspect-square w-full max-w-md">
                {isLoading ? (
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="absolute inset-[90px] animate-pulse rounded-full bg-white dark:bg-gray-800"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                      <div className="mt-2 h-4 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Pie
                        data={chartDataPenduduk}
                        dataKey="jumlah"
                        nameKey="gender"
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={140}
                        paddingAngle={2}
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {chartDataPenduduk.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            stroke="#fff"
                            strokeWidth={3}
                          />
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
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-gray-600 text-sm font-medium dark:fill-gray-400"
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
                )}
              </div>

              {/* Legend */}
              <div className="mt-6 w-full max-w-sm space-y-3">
                {isLoading ? (
                  <>
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-white/70 p-3 backdrop-blur-sm dark:bg-gray-800/70"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-4 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-5 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                          <div className="mt-1 h-3 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  chartDataPenduduk.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-white/70 p-3 backdrop-blur-sm dark:bg-gray-800/70"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {entry.gender}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {entry.jumlah.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.percentage}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-8 lg:w-1/2">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Data Statistik Penduduk
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Statistik demografis terkini desa
              </p>
            </div>

            <div className="space-y-4">
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                      Total Penduduk
                    </h4>
                    <div className="rounded-xl bg-gradient-to-br from-cyan-100 to-green-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:from-cyan-900 dark:to-green-900">
                      <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-2">
                      {isLoading ? (
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                      ) : (
                        <span className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent">
                          {totalPenduduk.toLocaleString()}
                        </span>
                      )}
                      <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Jiwa
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                      Jumlah Kepala Keluarga
                    </h4>
                    <div className="rounded-xl bg-gradient-to-br from-cyan-100 to-green-100 p-2 transition-transform duration-200 group-hover:scale-110 dark:from-cyan-900 dark:to-green-900">
                      <Home className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-2">
                      {isLoading ? (
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                      ) : (
                        <span className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent">
                          {jumlahKK.toLocaleString()}
                        </span>
                      )}
                      <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                        KK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Info className="h-4 w-4" />
                  <span>
                    {isLoading ? (
                      <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ) : (
                      <>
                        Rasio jenis kelamin:{" "}
                        {(() => {
                          const maleCount = chartDataPenduduk[0]?.jumlah || 0;
                          const femaleCount = chartDataPenduduk[1]?.jumlah || 0;
                          if (maleCount === 0 && femaleCount === 0) {
                            return "Belum ada data";
                          } else if (femaleCount === 0) {
                            return "Laki-laki saja";
                          } else if (maleCount === 0) {
                            return "Perempuan saja";
                          } else if (maleCount >= femaleCount) {
                            const rawRatio = maleCount / femaleCount;
                            const formattedRatio =
                              rawRatio % 1 === 0
                                ? rawRatio.toString()
                                : rawRatio.toFixed(2);
                            return `${formattedRatio} : 1 (L:P)`;
                          } else {
                            const rawRatio = femaleCount / maleCount;
                            const formattedRatio =
                              rawRatio % 1 === 0
                                ? rawRatio.toString()
                                : rawRatio.toFixed(2);
                            return `1 : ${formattedRatio} (L:P)`;
                          }
                        })()}
                      </>
                    )}
                  </span>
                </div>

                <button
                  className="w-full transform rounded-lg bg-gradient-to-r from-cyan-600 to-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
                  onClick={() =>
                    (window.location.href = "/infografis/penduduk")
                  }
                >
                  LIHAT DATA LEBIH LENGKAP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-200/50 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/50">
          {isLoading ? (
            <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <div className="mb-2 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {totalPenduduk && jumlahKK
                ? (totalPenduduk / jumlahKK).toFixed(1)
                : "N/A"}
            </div>
          )}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Rata-rata Anggota per KK
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/50">
          {isLoading ? (
            <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <div className="mb-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {chartDataPenduduk[0]?.percentage || 0}%
            </div>
          )}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Proporsi Laki-laki
          </div>
        </div>

        <div className="rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/50">
          {isLoading ? (
            <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <div className="mb-2 text-2xl font-bold text-green-600 dark:text-green-400">
              {chartDataPenduduk[1]?.percentage || 0}%
            </div>
          )}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Proporsi Perempuan
          </div>
        </div>
      </div>
    </div>
  );
}
